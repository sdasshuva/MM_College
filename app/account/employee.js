function employeeTab(UN) {
    if (Ext.getCmp('employee_tab')) {
        tab_panel.setActiveTab(Ext.getCmp("employee_tab"));
    } else {
        var new_tab = tab_panel.add({
            title: 'Employee',
            id: 'employee_tab',
            layout: 'fit',
            closable: true,
            autoScroll: false,
            items: [Ext.create('Ext.grid.Panel', {
                id: 'employee_grid',
                autoScroll: true,
                columnLines: true,
                loadMask: true,
                frame: true,
                store: {
                    proxy: {
                        type: 'ajax',
                        url: '/getEmployeeList'
                    },
                    autoLoad: true,
                    autoSync: false,
                    model: Ext.define('EMPLOYEE_MODEL', {
                        extend: 'Ext.data.Model',
                        fields: [{
                            name: 'id',
                            type: 'int'
                        }, {
                            name: 'name',
                            type: 'string'
                        }, {
                            name: 'email',
                            type: 'string'
                        }, {
                            name: 'card_no',
                            type: 'string'
                        }, {
                            name: 'designation',
                            type: 'string',
                            mapping: 'Designation_Table.name'
                        }, {
                            name: 'department',
                            type: 'string',
                            mapping: 'Department_Table.name'
                        }, {
                            name: 'section',
                            type: 'string',
                            mapping: 'Section_Table.name'
                        }]
                    })
                },
                columns: [Ext.create('Ext.grid.RowNumberer', {
                    width: 50
                }), {
                    header: 'NAME',
                    dataIndex: 'name',
                    editor: 'textfield',
                    listeners: {
                        beforerender: function(self, eOpts) {
                            if (UN.role < 2)
                                self.editor = false;
                        }
                    },
                    flex: 1
                }, {
                    header: 'E-MAIL',
                    dataIndex: 'email',
                    editor: 'textfield',
                    listeners: {
                        beforerender: function(self, eOpts) {
                            if (UN.role < 2)
                                self.editor = false;
                        }
                    },
                    flex: 1
                }, {
                    header: 'CARD NO',
                    dataIndex: 'card_no',
                    flex: 1,
                    listeners: {
                        beforerender: function(self, eOpts) {
                            if (UN.role < 2)
                                self.editor = false;
                        }
                    },
                    editor: 'textfield'
                }, {
                    header: 'DESIGNATION',
                    dataIndex: 'designation',
                    flex: 1,
                    listeners: {
                        beforerender: function(self, eOpts) {
                            if (UN.role < 2)
                                self.editor = false;
                        }
                    },
                    editor: {
                        xtype: 'combo',
                        name: 'designation',
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
                                url: '/getDesignationList'
                            },
                            autoLoad: true,
                            autoSync: true
                        }
                    }
                }, {
                    header: 'DEPARTMENT',
                    dataIndex: 'department',
                    flex: 1,
                    listeners: {
                        beforerender: function(self, eOpts) {
                            if (UN.role < 2)
                                self.editor = false;
                        }
                    },
                    editor: {
                        xtype: 'combo',
                        name: 'department',
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
                                url: '/getDepartmentList'
                            },
                            autoLoad: true,
                            autoSync: true
                        }
                    }
                }, {
                    header: 'SECTION',
                    dataIndex: 'section',
                    flex: 1,
                    listeners: {
                        beforerender: function(self, eOpts) {
                            if (UN.role < 2)
                                self.editor = false;
                        }
                    },
                    editor: {
                        xtype: 'combo',
                        name: 'section',
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
                                url: '/getSectionList'
                            },
                            autoLoad: true,
                            autoSync: true
                        }
                    }
                }, {
                    xtype: 'actioncolumn',
                    header: 'PRINTER',
                    flex: 0.3,
                    items: [{
                        icon: '/public/icons/print.png',
                        tooltip: 'Print',
                        handler: function(grid, rowIndex, colIndex) {
                            var rec = grid.getStore().getAt(rowIndex);
                            socket.emit('PrintEmployee', rec.id).on('PrintEmployeeReturn', function(message) {
                                if (message == "success") {
                                    if (Ext.getCmp('employee_grid')) {
                                        Ext.getCmp('employee_grid').getStore().load();
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
                    }],
                    align: 'center'
                }, {
                    xtype: 'actioncolumn',
                    header: 'DELETE',
                    hideable: true,
                    listeners: {
                        afterrender: function(cmp) {
                            cmp.hidden = (UN.role > 2) ? false : true;
                        }
                    },
                    flex: 0.3,
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
                                        socket.emit('DestroyEmployee', rec.id).on('DestroyEmployeeReturn', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('employee_grid')) {
                                                    Ext.getCmp('employee_grid').getStore().load();
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
                                        })
                                    }
                                }
                            })
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
                        socket.emit('UpdateEmployee', rec).on('UpdateEmployeeReturn', function(message) {
                            if (message == "success") {
                                if (Ext.getCmp('employee_grid')) {
                                    Ext.getCmp('employee_grid').getStore().load();
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
                name: 'AddNew',
                text: 'Add New',
                tooltip: 'Add New',
                border: 1,
                style: {
                    borderColor: 'blue',
                    borderStyle: 'solid'
                },
                handler: function() {
                    employeeFormWindow();
                }
            }, {
                xtype: 'button',
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
                    Ext.getCmp('employee_grid').getStore().load()
                }
            }]
        })
        tab_panel.setActiveTab(new_tab)
    }
}

function employeeFormWindow() {
    return Ext.create('Ext.window.Window', {
        title: 'Add New Employee',
        modal: true,
        id: 'employeeFormWindow',
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
                emptyText: 'Give Employee Name...',
                labelClsExtra: 'some-class',
                fieldStyle: 'text-align: left;font-size: 12px;',
                autoScroll: true
            }, {
                xtype: 'textfield',
                name: 'email',
                fieldLabel: 'E-mail',
                filedAlign: 'top',
                allowBlank: false,
                width: 300,
                labelWidth: 80,
                labelAlign: 'left',
                labelStyle: 'text-align:left;border solid 1px white;',
                labelSeparator: '',
                emptyText: 'Give Employee email ...',
                labelClsExtra: 'some-class',
                fieldStyle: 'text-align: left;font-size: 12px;',
                autoScroll: true
            }, {
                xtype: 'textfield',
                name: 'card_no',
                fieldLabel: ' Card No',
                filedAlign: 'top',
                allowBlank: false,
                width: 300,
                labelWidth: 80,
                labelAlign: 'left',
                labelStyle: 'text-align:left;border solid 1px white;',
                labelSeparator: '',
                emptyText: 'Give Employee Card No...',
                labelClsExtra: 'some-class',
                fieldStyle: 'text-align: left;font-size: 12px;',
                autoScroll: true
            }, {
                xtype: 'combo',
                name: 'designation',
                fieldLabel: 'Designation',
                allowBlank: false,
                editable: false,
                width: 300,
                labelWidth: 80,
                labelAlign: 'left',
                labelSeparator: '',
                emptyText: 'Select Designation Name...',
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
                        url: '/getDesignationList'
                    },
                    autoLoad: true,
                    autoSync: true
                }
            }, {
                xtype: 'combo',
                name: 'department',
                fieldLabel: 'Department',
                allowBlank: false,
                editable: false,
                width: 300,
                labelWidth: 80,
                labelAlign: 'left',
                labelSeparator: '',
                emptyText: 'Select Department Name...',
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
                        url: '/getDepartmentList'
                    },
                    autoLoad: true,
                    autoSync: true
                }
            }, {
                xtype: 'combo',
                name: 'section',
                fieldLabel: 'Section',
                allowBlank: false,
                editable: false,
                width: 300,
                labelWidth: 80,
                labelAlign: 'left',
                labelSeparator: '',
                emptyText: 'Select Section Name...',
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
                        url: '/getSectionList'
                    },
                    autoLoad: true,
                    autoSync: true
                }
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
                        socket.emit('CreateEmployee', values).on('CreateEmployeeReturn', function(message) {
                            if (message == "success") {
                                if (Ext.getCmp('employee_grid')) {
                                    Ext.getCmp('employee_grid').getStore().load();
                                }
                                Ext.MessageBox.alert('Success', 'Successfully data inserted');
                                Ext.getCmp('employeeFormWindow').close()
                            } else if (message == "error") {
                                Ext.MessageBox.alert('Error', 'Data not inserted. \nPossible problem could be duplicate entry');
                            }
                        });
                    }
                }
            }, {
                text: 'Close',
                handler: function() {
                    Ext.getCmp('employeeFormWindow').close()
                }
            }]
        })]
    }).show();
}