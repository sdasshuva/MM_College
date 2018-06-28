function accountHeadTab(UN) {
    if (Ext.getCmp('account_head_tab')) {
        tab_panel.setActiveTab(Ext.getCmp("account_head_tab"));
    } else {
        var new_tab = tab_panel.add({
            title: 'Account Head',
            id: 'account_head_tab',
            layout: 'fit',
            closable: true,
            autoScroll: false,
            items: [Ext.create('Ext.grid.Panel', {
                id: 'account_head_grid',
                autoScroll: true,
                columnLines: true,
                loadMask: true,
                frame: true,
                store: {
                    proxy: {
                        type: 'ajax',
                        url: '/getAccountHeadList'
                    },
                    autoLoad: true,
                    autoSync: false,
                    model: Ext.define('ACCOUNT_HEAD_MODEL', {
                        extend: 'Ext.data.Model',
                        fields: [{
                            name: 'id',
                            type: 'int'
                        }, {
                            name: 'name',
                            type: 'string'
                        }, {
                            name: 'account_type',
                            type: 'string',
                            mapping: 'Account_Type_Table.name'
                        }, {
                            name: 'parent',
                            type: 'string',
                            mapping: 'Parent_Table.name'
                        }]
                    })
                },
                columns: [Ext.create('Ext.grid.RowNumberer', {
                    width: 50
                }), {
                    header: 'NAME',
                    dataIndex: 'name',
                    listeners: {
                        beforerender: function(self, eOpts) {
                            if (UN.role < 2)
                                self.editor = false;
                        }
                    },
                    editor: 'textfield',
                    flex: 1
                }, {
                    header: 'ACCOUNT TYPE',
                    dataIndex: 'account_type',
                    editor: 'textfield',
                    flex: 1,
                    renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
                        if (value === 'Credit / Income') {
                            metaData.style = "background-color:#CCFFCC;";
                        } else {
                            metaData.style = "background-color:#FFCCCC;";
                        }
                        return value;
                    },
                    listeners: {
                        beforerender: function(self, eOpts) {
                            if (UN.role < 2)
                                self.editor = false;
                        }
                    },
                    editor: {
                        xtype: 'combo',
                        name: 'account_type',
                        allowBlank: false,
                        editable: false,
                        width: 300,
                        labelWidth: 80,
                        labelAlign: 'left',
                        labelSeparator: '',
                        labelClsExtra: 'some-class',
                        fieldStyle: 'text-align: left;font-size: 12px;',
                        autoScroll: true,
                        displayField: 'name',
                        valueField: 'id',
                        selectOnFocus: true,
                        triggerAction: 'all',
                        forceSelection: true,
                        store: {
                            fields: ['id', 'name'],
                            proxy: {
                                type: 'ajax',
                                url: '/getAccountType'
                            },
                            autoLoad: true,
                            autoSync: true
                        },
                    },
                }, {
                    header: 'PARENT',
                    dataIndex: 'parent',
                    editor: 'textfield',
                    flex: 1,
                    listeners: {
                        beforerender: function(self, eOpts) {
                            if (UN.role < 2)
                                self.editor = false;
                        }
                    },
                    editor: {
                        xtype: 'combo',
                        name: 'parent',
                        allowBlank: false,
                        editable: false,
                        width: 300,
                        labelWidth: 80,
                        labelAlign: 'left',
                        labelSeparator: '',
                        labelClsExtra: 'some-class',
                        fieldStyle: 'text-align: left;font-size: 12px;',
                        autoScroll: true,
                        displayField: 'name',
                        valueField: 'id',
                        selectOnFocus: true,
                        triggerAction: 'all',
                        forceSelection: true,
                        store: {
                            fields: ['id', 'name'],
                            proxy: {
                                type: 'ajax',
                                url: '/getAccountHeadList'
                            },
                            autoLoad: true,
                            autoSync: true
                        },
                    },
                }, {
                    xtype: 'actioncolumn',
                    header: 'DELETE',
                    flex: 0.5,
                    hideable: true,
                    listeners: {
                        afterrender: function(cmp) {
                            cmp.hidden = (UN.role > 2) ? false : true;
                        }
                    },
                    items: [{
                        icon: '/public/icons/delete.png',
                        tooltip: 'Delete',
                        handler: function(grid, rowIndex, colIndex) {
                            var rec = grid.getStore().getAt(rowIndex);
                            Ext.Msg.show({
                                title: 'Delete Promotion?',
                                msg: 'Are you sure you want to delete this information. <br>It will permanently delete this information from the server',
                                buttons: Ext.Msg.YESNO,
                                icon: Ext.Msg.WARNING,
                                fn: function(btn, text) {
                                    if (btn == 'yes') {
                                        socket.emit('DestroyAccountHead', rec.id).on('DestroyAccountHeadReturn', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('account_head_grid')) {
                                                    Ext.getCmp('account_head_grid').getStore().load();
                                                }
                                                Ext.MessageBox.alert('Success', 'Successfully data Deleted');
                                            } else if (message == "error") {
                                                Ext.MessageBox.alert('Error',
                                                    'Please contact with the developer');
                                            } else {
                                                Ext.MessageBox.alert('Unauthorized',
                                                    'You are not authorized to perform this task. ' +
                                                    'Repeatedly doing this might block your ID');
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    }],
                    align: 'center'
                }],
                selModel: 'cellmodel',
                plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
                    clicksToEdit: 2,
                    autoCancel: false
                })],
                listeners: {
                    edit: function(column, rowIndex) {
                        var rec = {}
                        rec.id = rowIndex.record.data.id
                        rec.data = {}
                        rec.data[rowIndex.field] = rowIndex.value
                        socket.emit('UpdateAccountHead', rec).on('UpdateAccountHeadReturn', function(message) {
                            if (message == "success") {
                                if (Ext.getCmp('account_head_grid')) {
                                    Ext.getCmp('account_head_grid').getStore().load();
                                }
                            } else if (message == "error") {
                                Ext.MessageBox.alert('Error',
                                    'Please contact with the developer');
                            } else {
                                Ext.MessageBox.alert('Unauthorized',
                                    'You are not authorized to perform this task. ' +
                                    'Repeatedly doing this might block your ID');
                            }
                        })
                    }

                }
            })],
            tbar: [{
                xtype: 'button',
                icon: '/public/icons/create.png',
                text: 'Add New',
                tooltip: 'Add New',
                border: 1,
                style: {
                    borderColor: 'blue',
                    borderStyle: 'solid'
                },
                handler: function() {
                    accountHeadFormWindow();
                }
            }, {
                xtype: 'button',
                icon: '/public/icons/refresh.png',
                iconCls: 'add',
                tooltip: 'Reload',
                border: 1,
                style: {
                    borderColor: 'blue',
                    borderStyle: 'solid'
                },
                handler: function() {
                    Ext.getCmp('account_head_grid').getStore().load();
                }
            }]
        });
        tab_panel.setActiveTab(new_tab);
    }
}

function accountHeadFormWindow() {
    return Ext.create('Ext.window.Window', {
        title: 'Add New Account Head',
        modal: true,
        resizable: false,
        id: 'accountHeadFormWindow',
        layout: 'fit',
        items: [Ext.create('Ext.form.Panel', {
            width: '35%',
            bodyPadding: 20,
            border: true,
            items: [{
                xtype: 'textfield',
                name: 'name',
                fieldLabel: 'Name',
                filedAlign: 'top',
                allowBlank: false,
                width: 300,
                labelWidth: 80,
                labelAlign: 'left',
                labelStyle: 'text-align:left;border solid 1px white;',
                labelSeparator: '',
                emptyText: 'Give Account Head Name...',
                labelClsExtra: 'some-class',
                fieldStyle: 'text-align: left;font-size: 12px;',
                autoScroll: true
            }, {
                xtype: 'combo',
                name: 'parent',
                fieldLabel: 'Parent',
                allowBlank: false,
                typeAhead: true,
                transform: 'stateSelect',
                forceSelection: true,
                editable: true,
                width: 300,
                labelWidth: 80,
                labelAlign: 'left',
                labelSeparator: '',
                emptyText: 'Select Account Head Parent...',
                labelClsExtra: 'some-class',
                fieldStyle: 'text-align: left;font-size: 12px;',
                autoScroll: true,
                queryMode: 'local',
                displayField: 'name',
                valueField: 'id',
                selectOnFocus: true,
                triggerAction: 'all',
                store: {
                    fields: ['id', 'name'],
                    proxy: {
                        type: 'ajax',
                        url: '/getAccountHeadList'
                    },
                    autoLoad: true,
                    autoSync: true
                },
                listeners: {
                    change: {
                        fn: function(combo, value) {
                            //console.log(value)
                        }
                    }
                }
            }, {
                xtype: 'radiogroup',
                fieldLabel: 'Account Type ',
                defaultType: 'radiofield',
                allowBlank: false,
                defaults: {
                    flex: 1
                },
                layout: 'hbox',
                items: [{
                    boxLabel: 'Credit ',
                    name: 'account_type',
                    padding: '0 10 0 0',
                    inputValue: 1,
                }, {
                    boxLabel: 'Debit ',
                    name: 'account_type',
                    inputValue: 2,
                }]
            }],
            buttons: [{
                text: 'Reset',
                handler: function() {
                    this.up('form').getForm().reset();
                }
            }, {
                text: 'Submit',
                formBind: true,
                handler: function() {
                    var panel = this.up('form');
                    var form = panel.getForm();
                    var values = form.getValues();
                    for (var key in values) {
                        if (values[key] === '') {
                            values[key] = null;
                        }
                    }
                    if (form.isValid()) {
                        socket.emit('CreateAccountHead', values).on('CreateAccountHeadReturn', function(message) {
                            if (message == "success") {
                                if (Ext.getCmp('account_head_grid')) {
                                    Ext.getCmp('account_head_grid').getStore().load();
                                }
                                Ext.MessageBox.alert('Success', 'Successfully data inserted');
                                Ext.getCmp('accountHeadFormWindow').close()
                            } else if (message == "error") {
                                Ext.MessageBox.alert('Error', 'Data not inserted. \nPossible problem could be duplicate entry');
                            }
                        });

                    }
                }
            }, {
                text: 'Close',
                handler: function() {
                    Ext.getCmp('accountHeadFormWindow').close()
                }
            }]
        })]
    }).show();
}