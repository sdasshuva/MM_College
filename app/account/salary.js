function salaryTab(UN) {
    if (Ext.getCmp('salary_tab')) {
        tab_panel.setActiveTab(Ext.getCmp("salary_tab"));
    } else {
        var new_tab = tab_panel.add({
            title: 'Salary',
            layout: 'fit',
            closable: true,
            autoScroll: false,
            id: 'salary_tab',
            items: [Ext.create('Ext.grid.Panel', {
                id: 'salary_grid',
                autoScroll: true,
                columnLines: true,
                loadMask: true,
                frame: true,
                store: {
                    proxy: {
                        type: 'ajax',
                        url: '/getSalaryList',
                    },
                    autoLoad: true,
                    autoSync: false,
                    model: Ext.define('SALARY_MODEL', {
                        extend: 'Ext.data.Model',
                        fields: [{
                            name: 'id',
                            type: 'int'
                        }, {
                            name: 'card_no',
                            type: 'string',
                            mapping: 'Employee_Table.card_no'
                        }, {
                            name: 'employee',
                            type: 'string',
                            mapping: 'Employee_Table.name'
                        }, {
                            name: 'department',
                            type: 'string',
                            mapping: 'Employee_Table.Department_Table.name'
                        }, {
                            name: 'section',
                            type: 'string',
                            mapping: 'Employee_Table.Section_Table.name'
                        }, {
                            name: 'designation',
                            type: 'string',
                            mapping: 'Employee_Table.Designation_Table.name'
                        }, {
                            name: 'date',
                            type: 'date'
                        }, {
                            name: 'amount',
                            type: 'float'
                        }, {
                            name: 'type',
                            type: 'string',
                            mapping: 'Salary_Type_Table.name'
                        }]
                    })
                },
                columns: [Ext.create('Ext.grid.RowNumberer', {
                    width: 50
                }), {
                    header: 'EMPLOYEE',
                    dataIndex: 'employee',
                    flex: 1
                }, {
                    header: 'CARD NO',
                    dataIndex: 'card_no',
                    flex: 1
                }, {
                    header: 'SECTION',
                    dataIndex: 'section',
                    flex: 1
                }, {
                    header: 'DESIGNATION',
                    dataIndex: 'designation',
                    flex: 1
                }, {
                    header: 'SALARY',
                    dataIndex: 'amount',
                    listeners: {
                        beforerender: function(self, eOpts) {
                            if (UN.role < 2)
                                self.editor = false;
                        }
                    },
                    editor: 'numberfield',
                    flex: 1
                }, {
                    header: 'TYPE',
                    dataIndex: 'type',
                    flex: 1,
                    listeners: {
                        beforerender: function(self, eOpts) {
                            if (UN.role < 2)
                                self.editor = false;
                        }
                    },
                    editor: {
                        xtype: 'combo',
                        name: 'type',
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
                                url: '/getSalaryType'
                            },
                            autoLoad: true,
                            autoSync: true
                        }
                    }
                }, {
                    header: 'DATE',
                    dataIndex: 'date',
                    flex: 1,
                    listeners: {
                        beforerender: function(self, eOpts) {
                            if (UN.role < 2)
                                self.editor = false;
                        }
                    },
                    xtype: 'datecolumn',
                    editor: 'datefield'
                }, {
                    xtype: 'actioncolumn',
                    header: 'VIEW',
                    flex: 0.3,
                    listeners: {
                        beforerender: function(self, eOpts) {
                            if (UN.role < 2)
                                self.editor = false;
                        }
                    },
                    items: [{
                        icon: '/public/icons/eye.png',
                        tooltip: 'View',
                        handler: function(grid, rowIndex, colIndex) {
                            var rec = grid.getStore().getAt(rowIndex);
                            var employeeId = rec.data.employeeId;
                            // salaryViewWindow(rec.data);
                        }
                    }],
                    align: 'center'
                }, {
                    xtype: 'actioncolumn',
                    header: 'DELETE',
                    flex: 0.3,
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
                                        socket.emit('DestroySalary', rec.id).on('DestroySalaryReturn', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('salary_grid')) {
                                                    Ext.getCmp('salary_grid').getStore().load();
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
                        socket.emit('UpdateSalary', rec).on('UpdateSalaryReturn', function(message) {
                            if (message == "success") {
                                if (Ext.getCmp('salary_grid')) {
                                    Ext.getCmp('salary_grid').getStore().load();
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
                    salaryFormWindow();
                }
            }, {
                xtype: 'textfield',
                id: 'employee_list_fp_id_search',
                name: 'employee',
                width: 200,
                border: 1,
                style: {
                    borderColor: 'blue',
                    borderStyle: 'solid'
                },
                emptyText: 'Search Salary .....',
                listeners: {
                    change: {
                        fn: function(combo, value) {

                        }
                    }
                }
            }]
        });
        tab_panel.setActiveTab(new_tab);
    }
}

function salaryFormWindow() {
    return Ext.create('Ext.window.Window', {
        title: 'Add New Salary',
        modal: true,
        id: 'salaryFormWindow',
        layout: 'fit',
        items: [Ext.create('Ext.form.Panel', {
            width: '35%',
            bodyPadding: 20,
            border: true,
            items: [{
                xtype: 'combo',
                name: 'salary_type',
                fieldLabel: 'Salary Type',
                allowBlank: false,
                editable: false,
                width: 300,
                labelWidth: 80,
                labelAlign: 'left',
                labelSeparator: '',
                emptyText: 'Select Salary Type...',
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
                        url: '/getSalaryType'
                    },
                    autoLoad: true,
                    autoSync: true
                }
            }, {
                xtype: 'numberfield',
                name: 'amount',
                fieldLabel: 'Amount',
                filedAlign: 'top',
                allowBlank: false,
                width: 300,
                labelWidth: 80,
                labelAlign: 'left',
                labelStyle: 'text-align:left;border solid 1px white;',
                labelSeparator: '',
                emptyText: 'Give Amount...',
                labelClsExtra: 'some-class',
                fieldStyle: 'text-align: left;font-size: 12px;',
                autoScroll: true
            }, {

                xtype: 'datefield',
                fieldLabel: 'Date',
                name: 'date',
                filedAlign: 'top',
                allowBlank: false,
                width: 300,
                labelWidth: 80,
                labelAlign: 'left',
                labelStyle: 'text-align:left;border solid 1px white;',
                labelSeparator: '',
                emptyText: 'Give Salary Date...',
                labelClsExtra: 'some-class',
                fieldStyle: 'text-align: left;font-size: 12px;'
            }, {
                xtype: 'combo',
                name: 'employee',
                fieldLabel: 'Employee',
                allowBlank: false,
                editable: false,
                width: 300,
                labelWidth: 80,
                labelAlign: 'left',
                labelSeparator: '',
                emptyText: 'Select Employee Name...',
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
                        url: '/getEmployeeList'
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
                        socket.emit('CreateSalary', values).on('CreateSalaryReturn', function(message) {
                            if (message == "success") {
                                if (Ext.getCmp('salary_grid')) {
                                    Ext.getCmp('salary_grid').getStore().load();
                                }
                                Ext.MessageBox.alert('Success', 'Successfully data inserted')
                                Ext.getCmp('salaryFormWindow').close()
                            } else if (message == "error") {
                                Ext.MessageBox.alert('Error', 'Data not inserted. \nPossible problem could be duplicate entry');
                            }
                        })
                    }
                }
            }, {
                text: 'Close',
                handler: function() {
                    Ext.getCmp('salaryFormWindow').close()
                }
            }]
        })]
    }).show();
}

function salaryViewWindow(rec) {
    return Ext.create('Ext.window.Window', {
        title: 'Salary List',
        modal: true,
        id: 'salaryViewWindow',
        layout: 'fit',
        height: 400,
        width: 700,
        items: [Ext.create('Ext.grid.Panel', {
            id: 'salary_view_grid',
            autoScroll: true,
            columnLines: true,
            loadMask: true,
            frame: true,
            store: {
                proxy: {
                    type: 'ajax',
                    url: '/getEmployeeSalary/' + rec.employeeId
                },
                autoLoad: true,
                autoSync: false,
                model: Ext.define('SALARY_MODEL', {
                    extend: 'Ext.data.Model',
                    fields: [{
                        name: 'id',
                        type: 'int'
                    }, {
                        name: 'employee_card_no',
                        type: 'string',
                        mapping: 'Employee_Table.card_no'
                    }, {
                        name: 'employee',
                        type: 'string',
                        mapping: 'Employee_Table.name'
                    }, {
                        name: 'employee_id',
                        type: 'int',
                        mapping: 'Employee_Table.id'
                    }, {
                        name: 'section',
                        type: 'string',
                        mapping: 'Employee_Table.section'
                    }, {
                        name: 'designation',
                        type: 'string',
                        mapping: 'Employee_Table.designation'
                    }, {
                        name: 'date',
                        type: 'date'
                    }, {
                        name: 'amount',
                        type: 'int'
                    }, {
                        name: 'type',
                        type: 'string',
                        mapping: 'Salary_Type_Table.name'
                    }]
                })
            },
            columns: [Ext.create('Ext.grid.RowNumberer', {
                width: 50
            }), {
                header: 'Card No',
                dataIndex: 'card_no',
                flex: 1
            }, {
                header: 'Employee Id',
                dataIndex: 'employeeId',
                flex: 1
            }, {
                header: 'Employee Name#',
                dataIndex: 'employee_name',
                flex: 1
            }, {
                header: 'Section#',
                dataIndex: 'section_name',
                flex: 1
            }, {
                header: 'Designation#',
                dataIndex: 'designation_name',
                flex: 1
            }, {
                header: 'Salary',
                dataIndex: 'salary_amount',
                flex: 1
            }, {
                header: 'Type',
                dataIndex: 'salary_type',
                flex: 1,
            }, {
                header: 'Date',
                dataIndex: 'salary_date',
                flex: 1,
                xtype: 'datecolumn',
            }],
            selModel: 'cellmodel'
        })]
    }).show();
}