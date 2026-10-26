define("SystemDesigner", ["SystemDesignerResources", "RightUtilities"],
    function (resources, RightUtilities) {
        return {
            attributes: {
                "CanUseSqlConsole": { dataValueType: Terrasoft.DataValueType.BOOLEAN }
            },
            methods: {
                init: function (callback, scope) {
                    this.callParent([function () {
                        this.initCanUseSqlConsoleOperationRights(function () {
                            if (callback) {
                                callback.call(scope);
                            }
                        }, this);
                    }, this]);
                },
                getCanUseSqlConsoleOperationRightsDecoupling: function () {
                    return {
                        "navigateToSamConsolePlusClick": "CanUseSqlConsole"
                    };
                },
                initCanUseSqlConsoleOperationRights: function (callback, scope) {
                    var decoupling = this.getCanUseSqlConsoleOperationRightsDecoupling();
                    var operationRightsNames = Ext.Object.getValues(decoupling);
                    var uniqueOperationNames = [];
                    Terrasoft.each(operationRightsNames, function (operationName) {
                        if (uniqueOperationNames.indexOf(operationName) < 0) {
                            uniqueOperationNames.push(operationName);
                        }
                    }, this);
                    RightUtilities.checkCanExecuteOperations(uniqueOperationNames, function (result) {
                        Terrasoft.each(result, function (operationRight, operationName) {
                            this.set(operationName, operationRight);
                        }, this);
                        if (callback) {
                            callback.call(scope);
                        }
                    }, this);
                },
                onNavigateToSamConsolePlusClick: function () {
                    if (this.get("CanUseSqlConsole") != null) {
                        this.navigateToSamConsolePlus();
                    } else {
                        RightUtilities.checkCanExecuteOperation({
                            operation: "CanUseSqlConsole"
                        }, function (result) {
                            this.set("CanUseSqlConsole", result);
                            this.navigateToSamConsolePlus();
                        }, this);
                    }
                    return false;
                },
                navigateToSamConsolePlus: function () {
                    if (this.get("CanUseSqlConsole") === true) {
                        this.sandbox.publish("PushHistoryState", {
                            hash: "Section/Command_ListPage"
                        });
                    } else {
                        var message = this.get("Resources.Strings.RightsErrorMessage");
                        this.Terrasoft.utils.showInformation(message);
                        this.hideBodyMask();
                    }
                }
            },
            diff: [
                {
                    "operation": "insert",
                    "propertyName": "items",
                    "parentName": "ConfigurationTile",
                    "name": "SamConsolePlusLink",
                    "values": {
                        "itemType": Terrasoft.ViewItemType.LINK,
                        "caption": { "bindTo": "Resources.Strings.SqlConsoleCaption" },
                        "click": { "bindTo": "onNavigateToSamConsolePlusClick" }
                    }
                }
            ]
        };
    });
