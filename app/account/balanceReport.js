function balaneReportTab(UN) {
    if (Ext.getCmp('balance_report_tab')) {
        tab_panel.setActiveTab(Ext.getCmp("balance_report_tab"));
    } else {
        var new_tab = tab_panel.add({
            title: 'Monthly Receipt & Payment Statement',
            id: 'balance_report_tab',
            layout: 'fit',
            closable: true,
            autoScroll: false,
            items: [{
                xtype: 'textfield',
                name: 'BalanceIncomeHiddenField',
                id: 'BalanceIncomeHiddenField',
                hidden: true,
                value: 0,
                listeners: {
                    change: function(self, newValue, oldValue, eOpts) {
                        var b = Ext.getCmp("expenditureHiddenField").getValue();
                        var c = parseFloat(newValue) - parseFloat(b);
                        var d = "<h3><u>Excess Income Over Expenditure:</u> " + c + " </h3>"
                        Ext.getCmp("Balance_Excess_Income_Over_Expenditure").update(d);
                    }
                }
            }, {
                xtype: 'textfield',
                name: 'BalanceExpenseHiddenField',
                id: 'BalanceExpenseHiddenField',
                hidden: true,
                value: 0,
                listeners: {
                    change: function(self, newValue, oldValue, eOpts) {
                        var a = Ext.getCmp("BalanceIncomeHiddenField").getValue();
                        var c = parseFloat(a) - parseFloat(newValue);
                        var d = "<h3><u>Excess Income Over Expenditure:</u> " + c + " </h3>"
                        Ext.getCmp("Balance_Excess_Income_Over_Expenditure").update(d);
                    }
                }
            }, Ext.create('Ext.panel.Panel', {
                width: '100%',
                border: false,
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                items: [Ext.create('Ext.panel.Panel', {
                    width: '50%',
                    border: false,
                    layout: 'fit',
                    autoScroll: false,
                    items: [Ext.create('Ext.grid.Panel', {
                        id: 'balance_income_report_statement_grid',
                        autoScroll: true,
                        columnLines: true,
                        store: {
                            proxy: {
                                type: 'ajax',
                                url: '/getBalanceIncomeList'
                            },
                            autoLoad: true,
                            autoSync: false,
                            model: Ext.define('INCOME_BALANCE_MODEL', {
                                extend: 'Ext.data.Model',
                                fields: []
                            })
                        },
                        loadMask: true,
                        frame: true,
                        features: [{
                            ftype: 'summary',
                            dock: 'bottom'
                        }],
                        columns: [{
                            header: 'HEAD OF ACCOUNT',
                            dataIndex: 'name',
                            flex: 1.5,
                            align: 'left',
                            summaryRenderer: function(value, summaryData, dataIndex) {
                                return '-----';
                            }
                        }, {
                            header: 'OPENING BALANCE',
                            dataIndex: 'opening_balance',
                            flex: 1,
                            align: 'right',
                            summaryRenderer: function(value, summaryData, dataIndex) {
                                return '<b><big>TOTAL Inc.</big></b>';
                            }
                        }, {
                            header: 'CURRENT MONTH',
                            dataIndex: 'current_balance',
                            flex: 1,
                            align: 'right',
                            summaryType: 'sum',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                return value + ' TK';
                            },
                            summaryRenderer: function(value, summaryData, dataIndex) {
                                Ext.getCmp("BalanceIncomeHiddenField").setValue(value);
                                return '<b><big>' + value + ' TK</big></b>';
                            }
                        }, ],
                        selModel: 'cellmodel',
                    })]
                }), Ext.create('Ext.panel.Panel', {
                    width: '50%',
                    border: false,
                    layout: 'fit',
                    autoScroll: false,
                    items: [Ext.create('Ext.grid.Panel', {
                        id: 'balance_expence_report_statement_grid',
                        autoScroll: true,
                        columnLines: true,
                        store: {
                            proxy: {
                                type: 'ajax',
                                url: '/getBalanceExpenceList'
                            },
                            autoLoad: true,
                            autoSync: false,
                            model: Ext.define('EXPENSE_BALANCE_MODEL', {
                                extend: 'Ext.data.Model',
                                fields: []
                            })
                        },
                        loadMask: true,
                        frame: true,
                        features: [{
                            ftype: 'summary',
                            dock: 'bottom'
                        }],
                        columns: [{
                            header: 'HEAD OF ACCOUNT',
                            dataIndex: 'name',
                            flex: 1.5,
                            align: 'left',
                            summaryRenderer: function(value, summaryData, dataIndex) {
                                return '-----';
                            }
                        }, {
                            header: 'OPENING BALANCE',
                            dataIndex: 'opening_balance',
                            flex: 1,
                            align: 'right',
                            summaryRenderer: function(value, summaryData, dataIndex) {
                                return '<b><big>TOTAL Exp.</big></b>';
                            }
                        }, {
                            header: 'CURRENT MONTH',
                            dataIndex: 'current_balance',
                            flex: 1,
                            summaryType: 'sum',
                            align: 'right',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                return value + ' TK';
                            },
                            summaryRenderer: function(value, summaryData, dataIndex) {
                                Ext.getCmp("BalanceExpenseHiddenField").setValue(value);
                                return '<b><big>' + value + ' TK</big></b>';
                            }
                        }, ],
                        selModel: 'cellmodel',
                    })]
                })]
            }), Ext.create('Ext.panel.Panel', {
                width: '100%',
                id: 'Balance_Excess_Income_Over_Expenditure',
                autoHeight: true,
                html: "<h2><u>Excess Income Over Expenditure:</u> 0.00</h2>",
                style: {
                    "text-align": 'center'
                }
            })],
            bbar: [{
                xtype: 'button',
                text: 'Reload',
                icon: '/public/icons/refresh.png',
                iconCls: 'add',
                name: 'reload',
                tooltip: 'Reload',
                border: 1,
                style: {
                    borderColor: 'blue',
                    borderStyle: 'solid'
                },
                handler: function() {
                    Ext.getCmp('balance_expence_report_statement_grid').getStore().load();
                    Ext.getCmp('balance_income_report_statement_grid').getStore().load();
                }
            }]
        });
        tab_panel.setActiveTab(new_tab);
    }
}