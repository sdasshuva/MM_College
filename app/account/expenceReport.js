function expenceReportTab(UN) {
    if (Ext.getCmp('expence_report_tab')) {
        tab_panel.setActiveTab(Ext.getCmp("expence_report_tab"));
    } else {
        var new_tab = tab_panel.add({
            title: 'Expence Report',
            layout: 'fit',
            closable: true,
            autoScroll: false,
            id: 'expence_report_tab',
            items: [Ext.create('Ext.grid.Panel', {
                border: false,
                id: 'expence_report_grid',
                autoScroll: true,
                store: {
                    proxy: {
                        type: 'ajax',
                        url: '/getExpenceList'
                    },
                    autoLoad: true,
                    autoSync: false,
                    model: Ext.define('EXPENCE_MODEL', {
                        extend: 'Ext.data.Model',
                        fields: [{
                            name: 'narration',
                            type: 'string'
                        }, {
                            name: 'quantity',
                            type: 'int'
                        }, {
                            name: 'amount',
                            type: 'float',
                        }, {
                            name: 'account_Type',
                            type: 'string',
                            mapping: 'Account_Head_Table.Account_Type_Table.name'
                        }, {
                            name: 'account_head',
                            type: 'string',
                            mapping: 'Account_Head_Table.name'
                        }, {
                            name: 'date',
                            type: 'date',
                            mapping: 'Voucher_Table.date'
                        }, {
                            name: 'user',
                            type: 'string',
                            mapping: 'Voucher_Table.User_Table.username'
                        }]
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
                columns: [Ext.create('Ext.grid.RowNumberer', {
                    width: 50
                }), {
                    header: 'DATE',
                    dataIndex: 'date',
                    renderer: Ext.util.Format.dateRenderer('d-M-Y'),
                    flex: 1,
                    align: 'center',
                    summaryType: 'count',
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return '<b><big>TOTAL</big></b>';
                    }
                }, {
                    header: 'ACCOUNT HEAD',
                    dataIndex: 'account_head',
                    flex: 1.3,
                    align: 'center',
                    summaryType: 'count',
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return '-----';
                    }
                }, {
                    header: 'NARRATION',
                    dataIndex: 'narration',
                    flex: 1,
                    align: 'center',
                    summaryType: 'count',
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return '<b><big>TOTAL</big></b>';
                    }
                }, {
                    header: 'VOUCHER NO',
                    dataIndex: 'voucher',
                    flex: 1,
                    align: 'center',
                    summaryType: 'count',
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return '-----';
                    }
                }, {
                    header: 'QUANTITY',
                    dataIndex: 'quantity',
                    flex: 1,
                    align: 'center',
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
                }, {
                    header: 'USER',
                    dataIndex: 'user',
                    flex: 1,
                    align: 'center',
                    summaryType: 'count',
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return '-----';
                    }
                }]
            })],
            bbar: [{
                xtype: 'button',
                text: 'Reload',
                icon: '/public/icons/refresh.png',
                iconCls: 'add',
                name: 'reload',
                id: 'expenceReportTabReload',
                tooltip: 'Reload',
                border: 1,
                style: {
                    borderColor: 'blue',
                    borderStyle: 'solid'
                },
                handler: function() {
                    Ext.getCmp('expence_report_grid').getStore().load();
                }
            }]
        });
        tab_panel.setActiveTab(new_tab);
    }
}