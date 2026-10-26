namespace Terrasoft.Configuration.SamSqlConsoleService
{
	using System.CodeDom.Compiler;
	using System.ServiceModel;
	using System.ServiceModel.Web;
	using System.ServiceModel.Activation;
	using System.Runtime.Serialization;
	using System.Web;
	using Terrasoft.Common;
	using Terrasoft.Core;
	using Terrasoft.Core.DB;
	using Terrasoft.Core.Entities;
	using Terrasoft.Core.Store;
	using System;
	using System.Data;
	using System.Collections.Generic;
	using System.Linq;
	using System.Text;
	using System.Text.RegularExpressions;
	using Newtonsoft.Json.Linq;

	[ServiceContract]
	[AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
	public class SamSqlConsoleService {
		[OperationContract]
		[WebInvoke(Method = "POST", UriTemplate = "GetDatabaseType", BodyStyle = WebMessageBodyStyle.Wrapped,
			RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
		public DatabaseTypeResult GetDatabaseType() {
			var result = new DatabaseTypeResult();
			UserConnection userConnection = (UserConnection)HttpContext.Current.Session["UserConnection"];
			try {
				userConnection.DBSecurityEngine.CheckCanExecuteOperation("CanUseSqlConsole");
			} catch (System.Security.SecurityException exc) {
				result.ErrorMessage = exc.Message;
				return result;
			}
			result.Id = GetDatabaseTypeId(userConnection.DBEngine.DBEngineType);
			var select = new Select(userConnection)
				.Column("Name")
				.From("SamSqlDatabaseType")
				.Where("Id").IsEqual(Column.Parameter(result.Id)) as Select;
			result.Name = select.ExecuteScalar<string>();
			return result;
		}

		// Id записей справочника SamSqlDatabaseType из привязки SamSqlDatabaseType_All
		private static Guid GetDatabaseTypeId(DBEngineType dbEngineType) {
			switch (dbEngineType) {
				case DBEngineType.PostgreSql:
					return new Guid("5ee27039-e794-4307-aaff-d18899aaa7d0");
				case DBEngineType.Oracle:
					return new Guid("ddcabf7f-29e8-4cc7-ac95-4f19338c030a");
				default:
					return new Guid("0026baf4-8bc4-4425-8c9d-95680fd0522f");
			}
		}

		[OperationContract]
		[WebInvoke(Method = "POST", UriTemplate = "ExecuteSqlScript", BodyStyle = WebMessageBodyStyle.Wrapped,
			RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
		public ExecuteSqlResult ExecuteSqlScript(string sqlScript) {
			ExecuteSqlResult result = new ExecuteSqlResult();
			UserConnection userConnection = null;
			
			try {
				userConnection = (UserConnection)HttpContext.Current.Session["UserConnection"];
				userConnection.DBSecurityEngine.CheckCanExecuteOperation("CanUseSqlConsole");
			} catch (System.Security.SecurityException exc) {
				result.SecurityError = true;
				result.ErrorMessage = exc.ToString();
                return result;
			}
			
			List<QueryResult> queryResults = new List<QueryResult>();
			int rowsAffected = 0;
			
			try {
				var resultQuery = new CustomQuery(userConnection, sqlScript);
				
				Guid logRecordId = Guid.NewGuid();
				LogQuery(sqlScript, logRecordId, userConnection);
				List<string> blockedWords = FindBlockedWords(sqlScript, userConnection);
				if (blockedWords.Count > 0) {
					result.ErrorMessage = String.Format(GetBlockedWordsMessage(userConnection), String.Join(", ", blockedWords));
					return result;
				}
				using (DBExecutor dbExecutor = userConnection.EnsureDBConnection()) {
					using(var dr = resultQuery.ExecuteReader(dbExecutor)) {
						DataTable dataTable;
						while (true) {
							var queryResult = new QueryResult();
							dataTable = new DataTable();
							dataTable.Load(dr);
							
							queryResult.Columns = new List<string>();
							queryResult.Columns.AddRange(dataTable.Columns.Cast<DataColumn>().Select(column => column.ColumnName));
							
							if (queryResult.Columns.Count == 0) {
								rowsAffected = (dr.RecordsAffected > 0) ? dr.RecordsAffected : 0;
								break;
							}
							
							queryResult.Rows = new List<List<string>>();
							foreach (DataRow row in dataTable.Rows)
							{
								var r = new List<string>();
								r.AddRange(row.ItemArray.Select(field => (field == DBNull.Value) ? "NULL" : field.ToString()));
								queryResult.Rows.Add(r);
							}
							queryResults.Add(queryResult);
						}
						UpdateLogQuery(logRecordId, userConnection);
					}
				}
			} catch (Exception exc) {
				result.ErrorMessage = FormatErrorMessage(exc, sqlScript);
				return result;
			}
			
			result.QueryResults = queryResults;
			result.RowsAffected = rowsAffected;
			result.Success = true;
			return result;
		}
		
		private void LogQuery(string text, Guid logRecordId, UserConnection userConnection) {
			var insert = new Insert(userConnection).Into("SamSqlConsoleLog")
				.Set("Id", Column.Parameter(logRecordId))
				.Set("CreatedOn", Column.Parameter(DateTime.UtcNow))
				.Set("ModifiedOn", Column.Parameter(DateTime.UtcNow))
				.Set("ContactId", Column.Parameter(userConnection.CurrentUser.ContactId))
				.Set("IpAdress", Column.Parameter(userConnection.CurrentUser.ClientIP))
				.Set("QueryText", Column.Parameter(text));
			insert.Execute();
		}
		
		// Запрет действует, если SamAdminUnit пуст (для всех), равен пользователю или любой его роли (SysAdminUnitInRole учитывает иерархию)
		private List<string> FindBlockedWords(string sqlScript, UserConnection userConnection) {
			Guid userId = userConnection.CurrentUser.Id;
			var userRoles = new Select(userConnection)
				.Column("SysAdminUnitRoleId")
				.From("SysAdminUnitInRole")
				.Where("SysAdminUnitId").IsEqual(Column.Parameter(userId)) as Select;
			var select = new Select(userConnection)
				.Column("Name")
				.From("SamSqlBlockedWord")
				.Where("SamAdminUnitId").IsNull()
				.Or("SamAdminUnitId").IsEqual(Column.Parameter(userId))
				.Or("SamAdminUnitId").In(userRoles) as Select;
			string normalizedScript = sqlScript.ToLowerInvariant();
			var blockedWords = new List<string>();
			using (DBExecutor dbExecutor = userConnection.EnsureDBConnection()) {
				using (IDataReader reader = select.ExecuteReader(dbExecutor)) {
					while (reader.Read()) {
						string word = (reader["Name"] as string ?? String.Empty).Trim().ToLowerInvariant();
						if (word.Length == 0 || blockedWords.Contains(word)) {
							continue;
						}
						// Ищем слово целиком: "update" не должен срабатывать на колонку "UpdatedOn"
						string pattern = @"(?<![\w@#$])" + Regex.Escape(word) + @"(?![\w@#$])";
						if (Regex.IsMatch(normalizedScript, pattern)) {
							blockedWords.Add(word);
						}
					}
				}
			}
			return blockedWords;
		}

		private string GetBlockedWordsMessage(UserConnection userConnection) {
			return new LocalizableString(userConnection.Workspace.ResourceStorage, "SamSqlConsoleService",
				"LocalizableStrings.BlockedWordsMessage.Value").Value;
		}

		// Консоль для продвинутых администраторов: стек нужен для диагностики, сводка ошибки БД — над ним
		private static string FormatErrorMessage(Exception exc, string sqlScript) {
			string dbErrorSummary = FormatDbErrorSummary(exc, sqlScript);
			return dbErrorSummary == null ? exc.ToString() : dbErrorSummary + Environment.NewLine + exc.ToString();
		}

		// Исключение драйвера может прийти обёрнутым — ищем его по цепочке InnerException
		private static string FormatDbErrorSummary(Exception exc, string sqlScript) {
			for (Exception current = exc; current != null; current = current.InnerException) {
				var sqlException = current as System.Data.SqlClient.SqlException;
				if (sqlException != null && sqlException.Errors != null) {
					return FormatSqlServerErrors(sqlException);
				}
				if (current is System.Data.Common.DbException) {
					return FormatPostgresError(current, sqlScript);
				}
			}
			return null;
		}

		private static string FormatSqlServerErrors(System.Data.SqlClient.SqlException exc) {
			StringBuilder sb = new StringBuilder();
			for (var i = 0; i < exc.Errors.Count; i++) {
				var sqlError = exc.Errors[i];
				sb.AppendLine(String.Format("Msg {0}, Level {1}, State {2}, Line {3}\n{4}", sqlError.Number, sqlError.Class, sqlError.State, sqlError.LineNumber, sqlError.Message));
			}
			return sb.ToString();
		}

		// Npgsql не входит в ссылки пакета — поля PostgresException читаем рефлексией.
		// У Oracle их нет: код ORA-xxxxx и так в первой строке стека
		private static string FormatPostgresError(Exception exc, string sqlScript) {
			string sqlState = GetPropertyValue(exc, "SqlState");
			string messageText = GetPropertyValue(exc, "MessageText");
			if (String.IsNullOrEmpty(sqlState) || String.IsNullOrEmpty(messageText)) {
				return null;
			}
			StringBuilder sb = new StringBuilder("SQLSTATE " + sqlState);
			int position;
			if (Int32.TryParse(GetPropertyValue(exc, "Position"), out position) && position > 0) {
				sb.Append(", Line " + GetLineNumber(sqlScript, position));
			}
			sb.AppendLine().AppendLine(messageText);
			foreach (string detailName in new[] { "Detail", "Hint", "Where" }) {
				string detail = GetPropertyValue(exc, detailName);
				if (!String.IsNullOrEmpty(detail)) {
					sb.AppendLine(detailName.ToUpperInvariant() + ": " + detail);
				}
			}
			return sb.ToString();
		}

		// Position у PostgreSQL — номер символа в тексте запроса, начиная с 1
		private static int GetLineNumber(string sqlScript, int position) {
			int length = Math.Min(position - 1, sqlScript.Length);
			return sqlScript.Take(length).Count(ch => ch == '\n') + 1;
		}

		private static string GetPropertyValue(object source, string propertyName) {
			var property = source.GetType().GetProperty(propertyName);
			object value = property == null ? null : property.GetValue(source, null);
			return value == null ? null : value.ToString();
		}

		private void UpdateLogQuery(Guid logRecordId, UserConnection userConnection) {
			Update update = new Update(userConnection, "SamSqlConsoleLog");
				update.Set("CompletedOn", Column.Parameter(DateTime.UtcNow));
				update.Where("Id").IsEqual(Column.Parameter(logRecordId));
			update.Execute();
		}
		
		[DataContract(Namespace = "http://Terrasoft.WebApp.Service/")]
		public class QueryResult
		{
			[DataMember]
			public List<string> Columns {
				get;
				set;
			}

			[DataMember]
			public List<List<string>> Rows {
				get;
				set;
			}
		}
		
		[DataContract(Namespace = "http://Terrasoft.WebApp.Service/")]
		public class ExecuteSqlResult
		{
			[DataMember]
			public List<QueryResult> QueryResults {
				get;
				set;
			}

			[DataMember]
			public int RowsAffected {
				get;
				set;
			}
			
			[DataMember]
			public string ErrorMessage {
				get;
				set;
			}
			
			[DataMember]
			public bool SecurityError {
				get;
				set;
			}
			
			[DataMember]
			public bool Success {
				get;
				set;
			}
		}

		[DataContract(Namespace = "http://Terrasoft.WebApp.Service/")]
		public class DatabaseTypeResult
		{
			[DataMember]
			public Guid Id {
				get;
				set;
			}

			[DataMember]
			public string Name {
				get;
				set;
			}

			[DataMember]
			public string ErrorMessage {
				get;
				set;
			}
		}
	}
}