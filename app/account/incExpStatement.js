function incExpStatementTab(UN) {
    if (Ext.getCmp('income_expence_statement')) {
        tab_panel.setActiveTab(Ext.getCmp("income_expence_statement"));
    } else {
        var new_tab = tab_panel.add({
            title: 'Income & Expenditure Statement',
            id: 'income_expence_statement',
            layout: 'fit',
            closable: true,
            autoScroll: false,
            items: [{
                xtype: 'textfield',
                name: 'incomeHiddenField',
                id: 'incomeHiddenField',
                hidden: true,
                value: 0,
                listeners: {
                    change: function(self, newValue, oldValue, eOpts) {
                        var b = Ext.getCmp("expenditureHiddenField").getValue();
                        var c = parseFloat(newValue) - parseFloat(b);
                        var d = "<h3><u>Excess Income Over Expenditure:</u> " + c + " </h3>"
                        Ext.getCmp("excessIncomeOverExpenditure").update(d);
                    }
                }
            }, {
                xtype: 'textfield',
                name: 'expenditureHiddenField',
                id: 'expenditureHiddenField',
                hidden: true,
                value: 0,
                listeners: {
                    change: function(self, newValue, oldValue, eOpts) {
                        var a = Ext.getCmp("incomeHiddenField").getValue();
                        var c = parseFloat(a) - parseFloat(newValue);
                        var d = "<h3><u>Excess Income Over Expenditure:</u> " + c + " </h3>"
                        Ext.getCmp("excessIncomeOverExpenditure").update(d);
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
                    width: '49%',
                    border: false,
                    layout: 'fit',
                    autoScroll: false,
                    items: [Ext.create('Ext.grid.Panel', {
                        border: false,
                        id: 'inc_exp_income_report_grid',
                        autoScroll: true,
                        store: {
                            proxy: {
                                type: 'ajax',
                                url: '/getIncExpIncomeStatement'
                            },
                            autoLoad: true,
                            autoSync: false,
                            model: Ext.define('INCEXPINCOME_MODEL', {
                                extend: 'Ext.data.Model',
                                fields: []
                            })
                        },
                        columnLines: true,
                        loadMask: true,
                        frame: true,
                        viewConfig: {
                            stripeRows: true,
                            emptyText: 'No records'
                        },
                        features: [{
                            ftype: 'summary',
                            dock: 'bottom'
                        }],
                        columns: [Ext.create('Ext.grid.RowNumberer'), {
                            header: 'ACCOUNT HEAD',
                            dataIndex: 'name',
                            flex: 1.3,
                            align: 'left',
                            summaryType: 'count',
                            summaryRenderer: function(value, summaryData, dataIndex) {
                                return '-----';
                            }
                        }, {
                            header: 'AMOUNT',
                            dataIndex: 'amount',
                            flex: 1,
                            align: 'right',
                            summaryType: 'sum',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                grossExpense = value;
                                return value + ' TK';
                            },
                            summaryRenderer: function(value, summaryData, dataIndex) {
                                Ext.getCmp("expenditureHiddenField").setValue(value);
                                return '<b><big>' + value + ' TK</big></b>';
                            },
                        }]
                    })]
                }), Ext.create('Ext.panel.Panel', {
                    width: '49%',
                    border: false,
                    layout: 'fit',
                    autoScroll: false,
                    items: [Ext.create('Ext.grid.Panel', {
                        border: false,
                        id: 'inc_exp_expence_report_grid',
                        autoScroll: true,
                        store: {
                            proxy: {
                                type: 'ajax',
                                url: '/getIncExpExpenceStatement'
                            },
                            autoLoad: true,
                            autoSync: false,
                            model: Ext.define('INCEXPEXPENCE_MODEL', {
                                extend: 'Ext.data.Model',
                                fields: []
                            })
                        },
                        columnLines: true,
                        loadMask: true,
                        frame: true,
                        viewConfig: {
                            stripeRows: true,
                            emptyText: 'No records'
                        },
                        features: [{
                            ftype: 'summary',
                            dock: 'bottom'
                        }],
                        columns: [Ext.create('Ext.grid.RowNumberer'), {
                            header: 'ACCOUNT HEAD',
                            dataIndex: 'name',
                            flex: 1.3,
                            align: 'left',
                            summaryType: 'count',
                            summaryRenderer: function(value, summaryData, dataIndex) {
                                return '-----';
                            }
                        }, {
                            header: 'AMOUNT',
                            dataIndex: 'amount',
                            flex: 1,
                            align: 'right',
                            summaryType: 'sum',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                                grossExpense = value;
                                return value + ' TK';
                            },
                            summaryRenderer: function(value, summaryData, dataIndex) {
                                Ext.getCmp("expenditureHiddenField").setValue(value);
                                return '<b><big>' + value + ' TK</big></b>';
                            },
                        }]
                    })]
                })]
            }), Ext.create('Ext.panel.Panel', {
                width: '100%',
                id: 'excessIncomeOverExpenditure',
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
                id: 'ledgerTabReload',
                tooltip: 'Reload',
                border: 1,
                style: {
                    borderColor: 'blue',
                    borderStyle: 'solid'
                },
                handler: function() {
                    Ext.getCmp('ledger_grid').getStore().load();
                }
            }]
        });
        tab_panel.setActiveTab(new_tab);
    }
}