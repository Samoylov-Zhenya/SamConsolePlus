define("SamSqlBlockedWord_MiniPage", /**SCHEMA_DEPS*/[]/**SCHEMA_DEPS*/, function/**SCHEMA_ARGS*/()/**SCHEMA_ARGS*/ {
	return {
		viewConfigDiff: /**SCHEMA_VIEW_CONFIG_DIFF*/[
			{
				"operation": "insert",
				"name": "Button_SetRecordRights",
				"values": {
					"type": "crt.Button",
					"caption": "",
					"title": "$Resources.Strings.Button_SetRecordRights_title",
					"color": "default",
					"size": "medium",
					"iconPosition": "only-icon",
					"icon": "lock-button-icon",
					"visible": true,
					"clicked": {
						"request": "crt.SetRecordRightsRequest",
						"params": {
							"openInModalWindow": true
						}
					},
					"clickMode": "default"
				},
				"parentName": "ActionButtonsContainer",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "Input_Name",
				"values": {
					"layoutConfig": {
						"column": 1,
						"colSpan": 1,
						"row": 1,
						"rowSpan": 1
					},
					"type": "crt.Input",
					"label": "$Resources.Strings.PDS_Name",
					"control": "$PDS_Name",
					"labelPosition": "above",
					"multiline": false,
					"readonly": false
				},
				"parentName": "MainContainer",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "ComboBox_AdminUnit",
				"values": {
					"layoutConfig": {
						"column": 1,
						"colSpan": 1,
						"row": 2,
						"rowSpan": 1
					},
					"type": "crt.ComboBox",
					"label": "$Resources.Strings.PDS_SamAdminUnit",
					"control": "$PDS_SamAdminUnit",
					"labelPosition": "above",
					"isAddAllowed": false,
					"showValueAsLink": false,
					"controlActions": [],
					"listActions": []
				},
				"parentName": "MainContainer",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "Input_Description",
				"values": {
					"layoutConfig": {
						"column": 1,
						"colSpan": 1,
						"row": 3,
						"rowSpan": 2
					},
					"type": "crt.Input",
					"label": "$Resources.Strings.PDS_Description",
					"control": "$PDS_Description",
					"labelPosition": "above",
					"multiline": true,
					"readonly": false
				},
				"parentName": "MainContainer",
				"propertyName": "items",
				"index": 2
			}
		]/**SCHEMA_VIEW_CONFIG_DIFF*/,
		viewModelConfigDiff: /**SCHEMA_VIEW_MODEL_CONFIG_DIFF*/[
			{
				"operation": "merge",
				"path": [
					"attributes"
				],
				"values": {
					"PDS_Name": {
						"modelConfig": {
							"path": "PDS.Name"
						}
					},
					"PDS_SamAdminUnit": {
						"modelConfig": {
							"path": "PDS.SamAdminUnit"
						}
					},
					"PDS_SamAdminUnit_List": {
						"isCollection": true,
						"modelConfig": {
							"sortingConfig": {
								"default": [
									{
										"columnName": "Name",
										"direction": "asc"
									}
								]
							}
						}
					},
					"PDS_Description": {
						"modelConfig": {
							"path": "PDS.Description"
						}
					}
				}
			}
		]/**SCHEMA_VIEW_MODEL_CONFIG_DIFF*/,
		modelConfigDiff: /**SCHEMA_MODEL_CONFIG_DIFF*/[
			{
				"operation": "merge",
				"path": [],
				"values": {
					"primaryDataSourceName": "PDS",
					"dataSources": {
						"PDS": {
							"type": "crt.EntityDataSource",
							"config": {
								"entitySchemaName": "SamSqlBlockedWord"
							},
							"scope": "page"
						}
					}
				}
			}
		]/**SCHEMA_MODEL_CONFIG_DIFF*/,
		handlers: /**SCHEMA_HANDLERS*/[]/**SCHEMA_HANDLERS*/,
		converters: /**SCHEMA_CONVERTERS*/{}/**SCHEMA_CONVERTERS*/,
		validators: /**SCHEMA_VALIDATORS*/{}/**SCHEMA_VALIDATORS*/
	};
});
