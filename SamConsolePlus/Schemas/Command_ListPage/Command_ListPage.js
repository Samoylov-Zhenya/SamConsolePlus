define("Command_ListPage", /**SCHEMA_DEPS*/["SamCodeEditor", "@creatio-devkit/common"]/**SCHEMA_DEPS*/, function/**SCHEMA_ARGS*/(SamCodeEditor, sdk)/**SCHEMA_ARGS*/ {
	return {
		viewConfigDiff: /**SCHEMA_VIEW_CONFIG_DIFF*/[
			{
				"operation": "merge",
				"name": "PageTitle",
				"values": {
					"caption": "$Resources.Strings.PageTitle_caption"
				}
			},
			{
				"operation": "remove",
				"name": "ActionButtonsContainer",
				"properties": [
					"layoutConfig"
				]
			},
			{
				"operation": "merge",
				"name": "AddButton",
				"values": {
					"size": "large"
				}
			},
			{
				"operation": "remove",
				"name": "DataImportButton"
			},
			{
				"operation": "remove",
				"name": "MenuItem_ImportFromExcel"
			},
			{
				"operation": "remove",
				"name": "OpenLandingDesigner"
			},
			{
				"operation": "merge",
				"name": "ActionButton",
				"values": {
					"visible": false
				}
			},
			{
				"operation": "merge",
				"name": "MainFilterContainer",
				"values": {
					"alignItems": "stretch",
					"visible": false
				}
			},
			{
				"operation": "merge",
				"name": "LeftFilterContainer",
				"values": {
					"layoutConfig": {
						"column": 1,
						"row": 1,
						"colSpan": 1,
						"rowSpan": 1
					},
					"padding": {
						"top": "none",
						"right": "none",
						"bottom": "none",
						"left": "extra-small"
					}
				}
			},
			{
				"operation": "remove",
				"name": "LeftFilterContainerInner"
			},
			{
				"operation": "remove",
				"name": "FolderTreeActions"
			},
			{
				"operation": "remove",
				"name": "LookupQuickFilterByTag"
			},
			{
				"operation": "merge",
				"name": "RightFilterContainer",
				"values": {
					"layoutConfig": {
						"column": 2,
						"row": 1,
						"colSpan": 2,
						"rowSpan": 1
					}
				}
			},
			{
				"operation": "remove",
				"name": "MainButtonToggleGroup"
			},
			{
				"operation": "remove",
				"name": "FolderTree"
			},
			{
				"operation": "remove",
				"name": "MainTabPanel"
			},
			{
				"operation": "remove",
				"name": "ListTabContainer"
			},
			{
				"operation": "remove",
				"name": "ListContainer"
			},
			{
				"operation": "merge",
				"name": "DataTable",
				"values": {
					"columns": [
						{
							"id": "b7f2a4c1-5e83-4d09-8c6a-2f1e9d3b4a75",
							"code": "PDS_SamCode",
							"columnType": "tools",
							"width": 40,
							"cellView": {
								"type": "crt.Button",
								"caption": "",
								"title": "#ResourceString(Button_InsertCommand_title)#",
								"icon": "codeblock-icon",
								"iconPosition": "only-icon",
								"displayType": "text",
								"color": "primary",
								"size": "small",
								"clicked": {
									"request": "sam.ApplyCommandRequest",
									"params": {
										"sqlCode": "$Items.PDS_SamCode"
									}
								}
							}
						},
						{
							"id": "6557a699-512b-c23c-0c35-ae418ac5dab0",
							"code": "PDS_SamName",
							"caption": "#ResourceString(PDS_SamName)#",
							"dataValueType": 28,
							"width": 250
						},
						{
							"id": "3c9e5b7a-0d41-4f6e-9a2b-7c1d8e4f5a62",
							"code": "PDS_SamSqlDatabaseType",
							"caption": "#ResourceString(PDS_SamSqlDatabaseType)#",
							"dataValueType": 10,
							"referenceSchemaName": "SamSqlDatabaseType",
							"width": 100
						}
					],
					"features": {
						"rows": {
							"selection": false,
							"numeration": false,
							"toolbar": true
						},
						"header": {
							"visible": true
						},
						"columns": {
							"dragAndDrop": true,
							"resizing": true,
							"sorting": true
						},
						"editable": {
							"enable": false,
							"itemsCreation": false,
							"floatingEditPanel": false
						}
					},
					"rowToolbarItems": [
						{
							"type": "crt.MenuItem",
							"caption": "#ResourceString(MenuItem_InsertCommand_caption)#",
							"icon": "codeblock-icon",
							"clicked": {
								"request": "sam.ApplyCommandRequest",
								"params": {
									"sqlCode": "$Items.PDS_SamCode"
								}
							}
						}
					],
					"visible": true
				}
			},
			{
				"operation": "remove",
				"name": "DashboardsTabContainer"
			},
			{
				"operation": "remove",
				"name": "DashboardsContainer"
			},
			{
				"operation": "remove",
				"name": "Dashboards"
			},
			{
				"operation": "insert",
				"name": "FlexContainer_Content",
				"values": {
					"type": "crt.FlexContainer",
					"direction": "row",
					"items": [],
					"fitContent": true
				},
				"parentName": "ContentContainer",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "GridContainer_Workspace",
				"values": {
					"type": "crt.GridContainer",
					"columns": [
						"minmax(32px, 1fr)",
						"minmax(32px, 1fr)",
						"minmax(32px, 1fr)",
						"minmax(32px, 1fr)",
						"minmax(32px, 1fr)"
					],
					"rows": "minmax(max-content, 32px)",
					"gap": {
						"columnGap": "large",
						"rowGap": "none"
					},
					"items": [],
					"fitContent": true,
					"visible": true,
					"color": "transparent",
					"borderRadius": "none",
					"padding": {
						"top": "none",
						"right": "none",
						"bottom": "none",
						"left": "none"
					},
					"alignItems": "stretch"
				},
				"parentName": "FlexContainer_Content",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "FlexContainer_EditorPanel",
				"values": {
					"layoutConfig": {
						"column": 1,
						"colSpan": 4,
						"row": 1,
						"rowSpan": 1
					},
					"type": "crt.FlexContainer",
					"direction": "column",
					"items": [],
					"fitContent": true,
					"visible": true,
					"color": "transparent",
					"borderRadius": "none",
					"padding": {
						"top": "none",
						"right": "none",
						"bottom": "none",
						"left": "extra-small"
					},
					"alignItems": "stretch",
					"justifyContent": "start",
					"gap": "small",
					"wrap": "nowrap"
				},
				"parentName": "GridContainer_Workspace",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "GridContainer_Editor",
				"values": {
					"type": "crt.GridContainer",
					"columns": [
						"minmax(32px, 1fr)"
					],
					"rows": "minmax(max-content, 32px)",
					"gap": {
						"columnGap": "large",
						"rowGap": "none"
					},
					"items": [],
					"fitContent": true,
					"padding": {
						"top": "medium",
						"bottom": "medium",
						"right": "medium",
						"left": "medium"
					},
					"color": "primary",
					"borderRadius": "medium",
					"visible": true,
					"alignItems": "stretch"
				},
				"parentName": "FlexContainer_EditorPanel",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "FlexContainer_SqlEditor",
				"values": {
					"layoutConfig": {
						"column": 1,
						"colSpan": 1,
						"row": 1,
						"rowSpan": 1
					},
					"type": "crt.FlexContainer",
					"direction": "column",
					"items": [],
					"fitContent": false,
					"visible": true,
					"color": "transparent",
					"borderRadius": "none",
					"padding": {
						"top": "none",
						"right": "none",
						"bottom": "none",
						"left": "none"
					},
					"alignItems": "stretch"
				},
				"parentName": "GridContainer_Editor",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "FlexContainer_CommandList",
				"values": {
					"layoutConfig": {
						"column": 5,
						"colSpan": 1,
						"row": 1,
						"rowSpan": 1
					},
					"type": "crt.FlexContainer",
					"direction": "column",
					"items": [],
					"fitContent": true,
					"visible": true,
					"color": "transparent",
					"borderRadius": "none",
					"padding": {
						"top": "none",
						"right": "none",
						"bottom": "none",
						"left": "none"
					},
					"alignItems": "stretch",
					"justifyContent": "start",
					"gap": "small",
					"wrap": "nowrap"
				},
				"parentName": "GridContainer_Workspace",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "TabPanel_Lists",
				"values": {
					"type": "crt.TabPanel",
					"items": [],
					"mode": "tab",
					"styleType": "default",
					"fitContent": true,
					"stretch": false,
					"bodyBackgroundColor": "transparent",
					"selectedTabTitleColor": "auto",
					"tabTitleColor": "auto",
					"underlineSelectedTabColor": "auto",
					"headerBackgroundColor": "auto"
				},
				"parentName": "FlexContainer_CommandList",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "TabContainer_Commands",
				"values": {
					"type": "crt.TabContainer",
					"items": [],
					"caption": "$Resources.Strings.TabContainer_Commands_caption",
					"icon": "open-book-tab-icon",
					"iconPosition": "left-icon",
					"visible": true,
					"padding": {
						"top": "small",
						"right": "none",
						"bottom": "none",
						"left": "none"
					}
				},
				"parentName": "TabPanel_Lists",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "FlexContainer_CommandsTab",
				"values": {
					"type": "crt.FlexContainer",
					"direction": "column",
					"items": [],
					"fitContent": true,
					"visible": true,
					"color": "transparent",
					"borderRadius": "none",
					"padding": {
						"top": "none",
						"right": "none",
						"bottom": "none",
						"left": "none"
					},
					"alignItems": "stretch",
					"justifyContent": "start",
					"gap": "small",
					"wrap": "nowrap"
				},
				"parentName": "TabContainer_Commands",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "TabContainer_BlockedWords",
				"values": {
					"type": "crt.TabContainer",
					"items": [],
					"caption": "$Resources.Strings.TabContainer_BlockedWords_caption",
					"iconPosition": "left-icon",
					"visible": true,
					"padding": {
						"top": "small",
						"right": "none",
						"bottom": "none",
						"left": "none"
					}
				},
				"parentName": "TabPanel_Lists",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "FlexContainer_BlockedWordsTab",
				"values": {
					"type": "crt.FlexContainer",
					"direction": "column",
					"items": [],
					"fitContent": true,
					"visible": true,
					"color": "transparent",
					"borderRadius": "none",
					"padding": {
						"top": "none",
						"right": "none",
						"bottom": "none",
						"left": "none"
					},
					"alignItems": "stretch",
					"justifyContent": "start",
					"gap": "small",
					"wrap": "nowrap"
				},
				"parentName": "TabContainer_BlockedWords",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "FlexContainer_CommandListToolbar",
				"values": {
					"type": "crt.FlexContainer",
					"direction": "row",
					"items": [],
					"fitContent": true,
					"visible": true,
					"color": "transparent",
					"borderRadius": "none",
					"padding": {
						"top": "none",
						"right": "none",
						"bottom": "none",
						"left": "none"
					},
					"alignItems": "center",
					"justifyContent": "start",
					"gap": "small",
					"wrap": "wrap"
				},
				"parentName": "FlexContainer_CommandsTab",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "move",
				"name": "DataTable",
				"parentName": "FlexContainer_CommandsTab",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "move",
				"name": "SearchFilter",
				"parentName": "FlexContainer_CommandListToolbar",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "QuickFilter_DatabaseType",
				"values": {
					"type": "crt.QuickFilter",
					"config": {
						"caption": "#ResourceString(QuickFilter_DatabaseType_config_caption)#",
						"hint": "#ResourceString(QuickFilter_DatabaseType_config_hint)#",
						"icon": "filter-column-icon",
						"iconPosition": "left-icon",
						"defaultValue": [],
						"entitySchemaName": "SamSqlDatabaseType",
						"recordsFilter": null
					},
					"_filterOptions": {
						"expose": [
							{
								"attribute": "QuickFilter_DatabaseType_Items",
								"converters": [
									{
										"converter": "crt.QuickFilterAttributeConverter",
										"args": [
											{
												"target": {
													"viewAttributeName": "Items",
													"filterColumn": "SamSqlDatabaseType"
												},
												"quickFilterType": "lookup"
											}
										]
									}
								]
							}
						],
						"from": "QuickFilter_DatabaseType_Value"
					},
					"filterType": "lookup"
				},
				"parentName": "FlexContainer_CommandListToolbar",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "move",
				"name": "DataTable_Summaries",
				"parentName": "FlexContainer_CommandListToolbar",
				"propertyName": "items",
				"index": 2
			},
			{
				"operation": "move",
				"name": "RefreshButton",
				"parentName": "FlexContainer_CommandListToolbar",
				"propertyName": "items",
				"index": 3
			},
			{
				"operation": "insert",
				"name": "FlexContainer_BlockedWordsToolbar",
				"values": {
					"type": "crt.FlexContainer",
					"direction": "row",
					"items": [],
					"fitContent": true,
					"visible": true,
					"color": "transparent",
					"borderRadius": "none",
					"padding": {
						"top": "none",
						"right": "none",
						"bottom": "none",
						"left": "none"
					},
					"alignItems": "center",
					"justifyContent": "start",
					"gap": "small",
					"wrap": "wrap"
				},
				"parentName": "FlexContainer_BlockedWordsTab",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "SearchFilter_BlockedWords",
				"values": {
					"type": "crt.SearchFilter",
					"placeholder": "$Resources.Strings.SearchFilter_BlockedWords_placeholder",
					"iconOnly": false,
					"_filterOptions": {
						"expose": [
							{
								"attribute": "SearchFilter_BlockedWords_DataGrid_BlockedWords",
								"converters": [
									{
										"converter": "crt.SearchFilterAttributeConverter",
										"args": [
											"DataGrid_BlockedWords"
										]
									}
								]
							}
						],
						"from": [
							"SearchFilter_BlockedWords_SearchValue",
							"SearchFilter_BlockedWords_FilteredColumnsGroups"
						]
					}
				},
				"parentName": "FlexContainer_BlockedWordsToolbar",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "Button_AddBlockedWord",
				"values": {
					"type": "crt.Button",
					"caption": "",
					"title": "$Resources.Strings.Button_AddBlockedWord_title",
					"icon": "add-button-icon",
					"iconPosition": "only-icon",
					"displayType": "text",
					"color": "default",
					"size": "large",
					"clicked": {
						"request": "crt.CreateRecordRequest",
						"params": {
							"entityName": "SamSqlBlockedWord"
						}
					}
				},
				"parentName": "FlexContainer_BlockedWordsToolbar",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "Button_RefreshBlockedWords",
				"values": {
					"type": "crt.Button",
					"caption": "",
					"title": "$Resources.Strings.Button_RefreshBlockedWords_title",
					"icon": "reload-icon",
					"iconPosition": "only-icon",
					"displayType": "text",
					"color": "default",
					"size": "large",
					"clicked": {
						"request": "crt.LoadDataRequest",
						"params": {
							"config": {
								"loadType": "reload"
							},
							"dataSourceName": "DataGrid_BlockedWordsDS"
						}
					}
				},
				"parentName": "FlexContainer_BlockedWordsToolbar",
				"propertyName": "items",
				"index": 2
			},
			{
				"operation": "insert",
				"name": "DataGrid_BlockedWords",
				"values": {
					"type": "crt.DataGrid",
					"items": "$DataGrid_BlockedWords",
					"activeRow": "$DataGrid_BlockedWords_ActiveRow",
					"primaryColumnName": "DataGrid_BlockedWordsDS_Id",
					"columns": [
						{
							"id": "4f1c2b7e-8a3d-4e6f-9b0c-1d2e3f4a5b61",
							"code": "DataGrid_BlockedWordsDS_Name",
							"caption": "#ResourceString(DataGrid_BlockedWordsDS_Name)#",
							"dataValueType": 28,
							"width": 150
						},
						{
							"id": "7a2d3c8f-9b4e-4f70-8c1d-2e3f4a5b6c72",
							"code": "DataGrid_BlockedWordsDS_SamAdminUnit",
							"caption": "#ResourceString(DataGrid_BlockedWordsDS_SamAdminUnit)#",
							"dataValueType": 10,
							"referenceSchemaName": "SysAdminUnit",
							"width": 180
						},
						{
							"id": "9c3e4d0a-1b5f-4a81-9d2e-3f4a5b6c7d83",
							"code": "DataGrid_BlockedWordsDS_Description",
							"caption": "#ResourceString(DataGrid_BlockedWordsDS_Description)#",
							"dataValueType": 28,
							"width": 200
						}
					],
					"features": {
						"rows": {
							"selection": false,
							"numeration": false,
							"toolbar": true
						},
						"header": {
							"visible": true
						},
						"columns": {
							"dragAndDrop": true,
							"resizing": true,
							"sorting": true
						},
						"editable": {
							"enable": false,
							"itemsCreation": false,
							"floatingEditPanel": false
						}
					},
					"rowToolbarItems": [
						{
							"type": "crt.MenuItem",
							"caption": "#ResourceString(MenuItem_OpenBlockedWord_caption)#",
							"icon": "edit-row-action",
							"clicked": {
								"request": "crt.UpdateRecordRequest",
								"params": {
									"itemsAttributeName": "DataGrid_BlockedWords",
									"recordId": "$DataGrid_BlockedWords.DataGrid_BlockedWordsDS_Id"
								},
								"useRelativeContext": true
							}
						},
						{
							"type": "crt.MenuItem",
							"caption": "#ResourceString(MenuItem_DeleteBlockedWord_caption)#",
							"icon": "delete-row-action",
							"clicked": {
								"request": "sam.DeleteBlockedWordRequest",
								"params": {
									"recordId": "$DataGrid_BlockedWords.DataGrid_BlockedWordsDS_Id"
								}
							}
						}
					],
					"fitContent": true,
					"visible": true
				},
				"parentName": "FlexContainer_BlockedWordsTab",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "TabContainer_Logs",
				"values": {
					"type": "crt.TabContainer",
					"items": [],
					"caption": "$Resources.Strings.TabContainer_Logs_caption",
					"iconPosition": "left-icon",
					"visible": true,
					"padding": {
						"top": "small",
						"right": "none",
						"bottom": "none",
						"left": "none"
					}
				},
				"parentName": "TabPanel_Lists",
				"propertyName": "items",
				"index": 2
			},
			{
				"operation": "insert",
				"name": "FlexContainer_LogsTab",
				"values": {
					"type": "crt.FlexContainer",
					"direction": "column",
					"items": [],
					"fitContent": true,
					"visible": true,
					"color": "transparent",
					"borderRadius": "none",
					"padding": {
						"top": "none",
						"right": "none",
						"bottom": "none",
						"left": "none"
					},
					"alignItems": "stretch",
					"justifyContent": "start",
					"gap": "small",
					"wrap": "nowrap"
				},
				"parentName": "TabContainer_Logs",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "FlexContainer_LogsToolbar",
				"values": {
					"type": "crt.FlexContainer",
					"direction": "row",
					"items": [],
					"fitContent": true,
					"visible": true,
					"color": "transparent",
					"borderRadius": "none",
					"padding": {
						"top": "none",
						"right": "none",
						"bottom": "none",
						"left": "none"
					},
					"alignItems": "center",
					"justifyContent": "start",
					"gap": "small",
					"wrap": "wrap"
				},
				"parentName": "FlexContainer_LogsTab",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "Button_RefreshLogs",
				"values": {
					"type": "crt.Button",
					"caption": "",
					"title": "$Resources.Strings.Button_RefreshLogs_title",
					"icon": "reload-icon",
					"iconPosition": "only-icon",
					"displayType": "text",
					"color": "default",
					"size": "large",
					"clicked": {
						"request": "crt.LoadDataRequest",
						"params": {
							"config": {
								"loadType": "reload"
							},
							"dataSourceName": "DataGrid_LogsDS"
						}
					}
				},
				"parentName": "FlexContainer_LogsToolbar",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "DataGrid_Logs",
				"values": {
					"type": "crt.DataGrid",
					"items": "$DataGrid_Logs",
					"activeRow": "$DataGrid_Logs_ActiveRow",
					"primaryColumnName": "DataGrid_LogsDS_Id",
					"columns": [
						{
							"id": "5d8e1a3b-6c2f-4b97-a0e4-8f1d2c3b4a91",
							"code": "DataGrid_LogsDS_CreatedOn",
							"caption": "#ResourceString(DataGrid_LogsDS_CreatedOn)#",
							"dataValueType": 7,
							"width": 140
						},
						{
							"id": "6e9f2b4c-7d30-4ca8-b1f5-9a2e3d4c5ba2",
							"code": "DataGrid_LogsDS_Contact",
							"caption": "#ResourceString(DataGrid_LogsDS_Contact)#",
							"dataValueType": 10,
							"referenceSchemaName": "Contact",
							"width": 150
						},
						{
							"id": "7fa03c5d-8e41-4db9-82a6-ab3f4e5d6cb3",
							"code": "DataGrid_LogsDS_QueryText",
							"caption": "#ResourceString(DataGrid_LogsDS_QueryText)#",
							"dataValueType": 30,
							"width": 300
						},
						{
							"id": "80b14d6e-9f52-4eca-93b7-bc4a5f6e7dc4",
							"code": "DataGrid_LogsDS_CompletedOn",
							"caption": "#ResourceString(DataGrid_LogsDS_CompletedOn)#",
							"dataValueType": 7,
							"width": 140
						},
						{
							"id": "91c25e7f-a063-4fdb-a4c8-cd5b6a7f8ed5",
							"code": "DataGrid_LogsDS_IpAdress",
							"caption": "#ResourceString(DataGrid_LogsDS_IpAdress)#",
							"dataValueType": 28,
							"width": 120
						}
					],
					"features": {
						"rows": {
							"selection": false,
							"numeration": false,
							"toolbar": true
						},
						"header": {
							"visible": true
						},
						"columns": {
							"dragAndDrop": true,
							"resizing": true,
							"sorting": true
						},
						"editable": {
							"enable": false,
							"itemsCreation": false,
							"floatingEditPanel": false
						}
					},
					"rowToolbarItems": [
						{
							"type": "crt.MenuItem",
							"caption": "#ResourceString(MenuItem_InsertCommand_caption)#",
							"icon": "codeblock-icon",
							"clicked": {
								"request": "sam.ApplyCommandRequest",
								"params": {
									"sqlCode": "$DataGrid_Logs.DataGrid_LogsDS_QueryText"
								}
							}
						}
					],
					"fitContent": true,
					"visible": true
				},
				"parentName": "FlexContainer_LogsTab",
				"propertyName": "items",
				"index": 1
			}
		]/**SCHEMA_VIEW_CONFIG_DIFF*/,
		viewModelConfigDiff: /**SCHEMA_VIEW_MODEL_CONFIG_DIFF*/[
			{
				"operation": "merge",
				"path": [
					"attributes",
					"Items",
					"viewModelConfig",
					"attributes"
				],
				"values": {
					"PDS_SamName": {
						"modelConfig": {
							"path": "PDS.SamName"
						}
					},
					"PDS_SamSqlDatabaseType": {
						"modelConfig": {
							"path": "PDS.SamSqlDatabaseType"
						}
					},
					"PDS_SamCode": {
						"modelConfig": {
							"path": "PDS.SamCode"
						}
					}
				}
			},
			{
				"operation": "merge",
				"path": [
					"attributes",
					"Items",
					"modelConfig"
				],
				"values": {
					"filterAttributes": [
						{
							"name": "Items_PredefinedFilter",
							"loadOnChange": true
						},
						{
							"name": "SearchFilter_Items",
							"loadOnChange": true
						},
						{
							"name": "QuickFilter_DatabaseType_Items",
							"loadOnChange": true
						}
					]
				}
			},
			{
				"operation": "merge",
				"path": [
					"attributes",
					"Items",
					"modelConfig",
					"sortingConfig"
				],
				"values": {
					"default": [
						{
							"direction": "asc",
							"columnName": "SamName"
						}
					]
				}
			},
			{
				"operation": "merge",
				"path": [
					"attributes",
					"FolderTree_visible"
				],
				"values": {
					"modelConfig": {}
				}
			},
			{
				"operation": "merge",
				"path": [],
				"values": {
					"attributes": {
						"DataGrid_BlockedWords": {
							"isCollection": true,
							"modelConfig": {
								"path": "DataGrid_BlockedWordsDS",
								"filterAttributes": [
									{
										"name": "SearchFilter_BlockedWords_DataGrid_BlockedWords",
										"loadOnChange": true
									}
								],
								"sortingConfig": {
									"default": [
										{
											"direction": "asc",
											"columnName": "Name"
										}
									]
								}
							},
							"viewModelConfig": {
								"attributes": {
									"DataGrid_BlockedWordsDS_Id": {
										"modelConfig": {
											"path": "DataGrid_BlockedWordsDS.Id"
										}
									},
									"DataGrid_BlockedWordsDS_Name": {
										"modelConfig": {
											"path": "DataGrid_BlockedWordsDS.Name"
										}
									},
									"DataGrid_BlockedWordsDS_SamAdminUnit": {
										"modelConfig": {
											"path": "DataGrid_BlockedWordsDS.SamAdminUnit"
										}
									},
									"DataGrid_BlockedWordsDS_Description": {
										"modelConfig": {
											"path": "DataGrid_BlockedWordsDS.Description"
										}
									}
								}
							}
						},
						"DataGrid_Logs": {
							"isCollection": true,
							"modelConfig": {
								"path": "DataGrid_LogsDS",
								"sortingConfig": {
									"default": [
										{
											"direction": "desc",
											"columnName": "CreatedOn"
										}
									]
								}
							},
							"viewModelConfig": {
								"attributes": {
									"DataGrid_LogsDS_Id": {
										"modelConfig": {
											"path": "DataGrid_LogsDS.Id"
										}
									},
									"DataGrid_LogsDS_CreatedOn": {
										"modelConfig": {
											"path": "DataGrid_LogsDS.CreatedOn"
										}
									},
									"DataGrid_LogsDS_Contact": {
										"modelConfig": {
											"path": "DataGrid_LogsDS.Contact"
										}
									},
									"DataGrid_LogsDS_QueryText": {
										"modelConfig": {
											"path": "DataGrid_LogsDS.QueryText"
										}
									},
									"DataGrid_LogsDS_CompletedOn": {
										"modelConfig": {
											"path": "DataGrid_LogsDS.CompletedOn"
										}
									},
									"DataGrid_LogsDS_IpAdress": {
										"modelConfig": {
											"path": "DataGrid_LogsDS.IpAdress"
										}
									}
								}
							}
						}
					}
				}
			}
		]/**SCHEMA_VIEW_MODEL_CONFIG_DIFF*/,
		modelConfigDiff: /**SCHEMA_MODEL_CONFIG_DIFF*/[
			{
				"operation": "merge",
				"path": [
					"dataSources",
					"PDS",
					"config"
				],
				"values": {
					"entitySchemaName": "SamCommand",
					"attributes": {
						"SamName": {
							"path": "SamName"
						},
						"SamCode": {
							"path": "SamCode"
						},
						"SamSqlDatabaseType": {
							"path": "SamSqlDatabaseType"
						}
					}
				}
			},
			{
				"operation": "merge",
				"path": [],
				"values": {
					"dataSources": {
						"DataGrid_BlockedWordsDS": {
							"type": "crt.EntityDataSource",
							"scope": "viewElement",
							"config": {
								"entitySchemaName": "SamSqlBlockedWord",
								"attributes": {
									"Name": {
										"path": "Name"
									},
									"SamAdminUnit": {
										"path": "SamAdminUnit"
									},
									"Description": {
										"path": "Description"
									}
								}
							}
						},
						"DataGrid_LogsDS": {
							"type": "crt.EntityDataSource",
							"scope": "viewElement",
							"config": {
								"entitySchemaName": "SamSqlConsoleLog",
								"attributes": {
									"CreatedOn": {
										"path": "CreatedOn"
									},
									"Contact": {
										"path": "Contact"
									},
									"QueryText": {
										"path": "QueryText"
									},
									"CompletedOn": {
										"path": "CompletedOn"
									},
									"IpAdress": {
										"path": "IpAdress"
									}
								}
							}
						}
					}
				}
			}
		]/**SCHEMA_MODEL_CONFIG_DIFF*/,
		handlers: /**SCHEMA_HANDLERS*/[
            {
                request: "crt.HandleViewModelInitRequest",
                handler: async (request, next) => {
                    const result = await next?.handle(request);
                    var attempts = 0;
                    var tryInit = function () {
                        console.log("[SamConsole] tryInit attempt:", attempts);
                        var ok = SamCodeEditor.init("FlexContainer_SqlEditor", {
                            onExecute: function () {
                                request.$context.executeRequest({ type: "sam.ExecuteClickRequest", $context: request.$context });
                            },
                            onClear: function () {
                                request.$context.executeRequest({ type: "sam.ClearClickRequest", $context: request.$context });
                            }
                        });
                        console.log("[SamConsole] init result:", ok, "| initialized:", SamCodeEditor.isInitialized());
                        if (!ok && attempts < 20) {
                            attempts++;
                            setTimeout(tryInit, 250);
                        } else if (ok) {
                            console.log("[SamConsole] Editor successfully initialized on attempt:", attempts);
                            SamCodeEditor.initSplitter("FlexContainer_EditorPanel", "FlexContainer_CommandList");
                        } else {
                            console.error("[SamConsole] Failed to initialize after 20 attempts");
                        }
                    };
                    setTimeout(tryInit, 300);
                    // Без await: crt.QuickFilterRequest ждёт отрисовки страницы, а она — завершения этого обработчика
                    (async () => {
                        try {
                            debugger;
                            const httpClientService = new sdk.HttpClientService();
                            const response = await httpClientService.post("/rest/SamSqlConsoleService/GetDatabaseType", {});
                            const dbType = response?.body?.GetDatabaseTypeResult;
                            if (dbType?.Name) {
                                // QuickFilter_DatabaseType_Value вычисляется из _RawValue/_ProfileValue — прямая запись в него перетирается,
                                // значение ставим тем же запросом, что и чип при выборе пользователем
                                await request.$context.executeRequest({
                                    type: "crt.QuickFilterRequest",
                                    $context: request.$context,
                                    viewName: "QuickFilter_DatabaseType",
                                    value: [{ value: dbType.Id, displayValue: dbType.Name, checkedState: true }]
                                });
                            } else {
                                console.warn("[SamConsole] GetDatabaseType:", dbType?.ErrorMessage);
                            }
                        } catch (e) {
                            console.error("[SamConsole] GetDatabaseType request error:", e);
                        }
                    })();
                    return result;
                }
            },
            {
                // ── Execute SQL ──
                request: "sam.ExecuteClickRequest",
                handler: async (request, next) => {
                    //debugger;
                    var sql = SamCodeEditor.getValue();
                    SamCodeEditor.setLoading(true);
                    try {
                        console.log("[SamConsole] Executing SQL...", sql.substring(0, 100));
                        const httpClientService = new sdk.HttpClientService();
                        const response = await httpClientService.post("/rest/SamSqlConsoleService/ExecuteSqlScript", { sqlScript: sql });
                        console.log("[SamConsole] ExecuteSqlScript result:", response);
                        SamCodeEditor.setResult(response.body);
                    } catch (e) {
                        console.error("[SamConsole] request error:", e);
                        SamCodeEditor.setResult({ Success: false, ErrorMessage: e.message });
                    }
                    return next?.handle(request);
                }
            },
            {
                // ── Clear editor ──
                request: "sam.ClearClickRequest",
                handler: async (request, next) => {
                    SamCodeEditor.clear();
                    return next?.handle(request);
                }
            },
            {
                // ── Insert command into console (row button / row menu) ──
                // SamCode приходит параметром из строки списка — загружен вместе с записями, без доп. запроса
                request: "sam.ApplyCommandRequest",
                handler: async (request, next) => {
                    if (request.sqlCode) {
                        SamCodeEditor.insertText(request.sqlCode);
                    } else {
                        console.warn("[SamConsole] SamCode is empty for the selected command");
                    }
                    return next?.handle(request);
                }
            },
            {
                // ── Delete blocked word (row menu) ──
                // Платформа после удаления перезагружает только основной список страницы — второй список обновляем сами
                request: "sam.DeleteBlockedWordRequest",
                handler: async (request, next) => {
                    const deleted = await request.$context.executeRequest({
                        type: "crt.DeleteRecordRequest",
                        $context: request.$context,
                        itemsAttributeName: "DataGrid_BlockedWords",
                        recordId: request.recordId
                    });
                    if (deleted) {
                        await request.$context.executeRequest({
                            type: "crt.LoadDataRequest",
                            $context: request.$context,
                            config: { loadType: "reload" },
                            dataSourceName: "DataGrid_BlockedWordsDS"
                        });
                    }
                    return next?.handle(request);
                }
            }
        ]/**SCHEMA_HANDLERS*/,
		converters: /**SCHEMA_CONVERTERS*/{}/**SCHEMA_CONVERTERS*/,
		validators: /**SCHEMA_VALIDATORS*/{}/**SCHEMA_VALIDATORS*/
	};
});