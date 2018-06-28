function studentTab(UN) {
    if (Ext.getCmp('student_tab')) {
        tab_panel.setActiveTab(Ext.getCmp("student_tab"));
    } else {
        var new_tab = tab_panel.add({
            title: 'Student',
            id: 'student_tab',
            layout: 'fit',
            iconMask: true,
            closable: true,
            autoScroll: true,
            items: [Ext.create('Ext.grid.Panel', {
                id: 'student_grid',
                autoScroll: true,
                columnLines: true,
                loadMask: true,
                // frame: true,
                store: {
                    proxy: {
                        type: 'ajax',
                        url: '/getStudentList'
                    },
                    autoLoad: true,
                    autoSync: false,
                    model: Ext.define('STUDENT_MODEL', {
                        extend: 'Ext.data.Model',
                        fields: [{
                            name: 'id',
                            type: 'int'
                        }, {
                            name: 'name',
                            type: 'string'
                        }, {
                            name: 'gender',
                            type: 'string',
                            mapping: 'Gender_Table.name'
                        }, {
                            name: 'religion',
                            type: 'string',
                            mapping: 'Religion_Table.name'
                        }, {
                            name: 'blood_group',
                            type: 'string',
                            mapping: 'Blood_Group_Table.name'
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
                    header: 'CARD NO',
                    dataIndex: 'card_no',
                    editor: 'textfield',
                    listeners: {
                        beforerender: function(self, eOpts) {
                            if (UN.role < 2)
                                self.editor = false;
                        }
                    },
                    flex: 1
                }, {
                    header: 'BIRTHDATE',
                    dataIndex: 'date_of_birth',
                    flex: 1,
                    listeners: {
                        beforerender: function(self, eOpts) {
                            if (UN.role < 2)
                                self.editor = false;
                        }
                    },
                    editor: 'datefield'
                }, {
                    header: 'GENDER',
                    dataIndex: 'gender',
                    flex: 1,
                    listeners: {
                        beforerender: function(self, eOpts) {
                            if (UN.role < 2)
                                self.editor = false;
                        }
                    },
                    editor: {
                        xtype: 'combo',
                        name: 'gender',
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
                                url: '/getGenderList'
                            },
                            autoLoad: true,
                            autoSync: true
                        }
                    }
                }, {
                    header: 'RELIGION',
                    dataIndex: 'religion',
                    flex: 1,
                    listeners: {
                        beforerender: function(self, eOpts) {
                            if (UN.role < 2)
                                self.editor = false;
                        }
                    },
                    editor: {
                        xtype: 'combo',
                        name: 'religion',
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
                                url: '/getReligionList'
                            },
                            autoLoad: true,
                            autoSync: true
                        }
                    }
                }, {
                    header: 'BLOOD GROUP',
                    dataIndex: 'blood_group',
                    flex: 1,
                    listeners: {
                        beforerender: function(self, eOpts) {
                            if (UN.role < 2)
                                self.editor = false;
                        }
                    },
                    editor: {
                        xtype: 'combo',
                        name: 'blood_group',
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
                                url: '/getBloodGroupList'
                            },
                            autoLoad: true,
                            autoSync: true
                        }
                    }
                }, {
                    header: 'CONTACT NO',
                    dataIndex: 'contact_no',
                    flex: 1,
                    listeners: {
                        beforerender: function(self, eOpts) {
                            if (UN.role < 2)
                                self.editor = false;
                        }
                    },
                    editor: 'textfield'
                }, {
                    header: 'PHONE NO',
                    dataIndex: 'phone_no',
                    flex: 1,
                    listeners: {
                        beforerender: function(self, eOpts) {
                            if (UN.role < 2)
                                self.editor = false;
                        }
                    },
                    editor: 'textfield'
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
                                        socket.emit('DestroyStudent', rec.id).on('DestroyStudentReturn', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('student_grid')) {
                                                    Ext.getCmp('student_grid').getStore().load();
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
                        socket.emit('UpdateStudent', rec).on('UpdateStudentReturn', function(message) {
                            if (message == "success") {
                                if (Ext.getCmp('student_grid')) {
                                    Ext.getCmp('student_grid').getStore().load();
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
                    studentFormWindow();
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
                    Ext.getCmp('student_grid').getStore().load()
                }
            }]
        })
        tab_panel.setActiveTab(new_tab)
    }
}

function studentFormWindow() {
    return Ext.create('Ext.window.Window', {
        title: 'Add New Student',
        modal: true,
        id: 'studentFormWindow',
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
                emptyText: 'Give Student Name...',
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
                emptyText: 'Give Student Card No...',
                labelClsExtra: 'some-class',
                fieldStyle: 'text-align: left;font-size: 12px;',
                autoScroll: true
            }, {
                xtype: 'datefield',
                name: 'date_of_birth',
                fieldLabel: ' Birth Date',
                filedAlign: 'top',
                allowBlank: true,
                width: 300,
                labelWidth: 80,
                labelAlign: 'left',
                labelStyle: 'text-align:left;border solid 1px white;',
                labelSeparator: '',
                emptyText: 'Give Student Birth Date...',
                labelClsExtra: 'some-class',
                fieldStyle: 'text-align: left;font-size: 12px;',
                autoScroll: true
            }, {
                xtype: 'combo',
                name: 'gender',
                fieldLabel: 'Gender',
                allowBlank: true,
                editable: false,
                width: 300,
                labelWidth: 80,
                labelAlign: 'left',
                labelSeparator: '',
                emptyText: 'Select Gender Name...',
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
                        url: '/getGenderList'
                    },
                    autoLoad: true,
                    autoSync: true
                }
            }, {
                xtype: 'combo',
                name: 'religion',
                fieldLabel: 'Religion',
                allowBlank: true,
                editable: false,
                width: 300,
                labelWidth: 80,
                labelAlign: 'left',
                labelSeparator: '',
                emptyText: 'Select Religion Name...',
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
                        url: '/getReligionList'
                    },
                    autoLoad: true,
                    autoSync: true
                }
            }, {
                xtype: 'combo',
                name: 'blood_group',
                fieldLabel: 'Blood Group',
                allowBlank: true,
                editable: false,
                width: 300,
                labelWidth: 80,
                labelAlign: 'left',
                labelSeparator: '',
                emptyText: 'Select Blood Group ..',
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
                        url: '/getBloodGroupList'
                    },
                    autoLoad: true,
                    autoSync: true
                }
            }, {
                xtype: 'textfield',
                name: 'contact_no',
                fieldLabel: 'Contact No',
                filedAlign: 'top',
                allowBlank: true,
                width: 300,
                labelWidth: 80,
                labelAlign: 'left',
                labelStyle: 'text-align:left;border solid 1px white;',
                labelSeparator: '',
                emptyText: 'Give Contact No...',
                labelClsExtra: 'some-class',
                fieldStyle: 'text-align: left;font-size: 12px;',
                autoScroll: true
            }, {
                xtype: 'textfield',
                name: 'phone_no',
                fieldLabel: 'Phone No',
                filedAlign: 'top',
                allowBlank: true,
                width: 300,
                labelWidth: 80,
                labelAlign: 'left',
                labelStyle: 'text-align:left;border solid 1px white;',
                labelSeparator: '',
                emptyText: 'Give Phone No...',
                labelClsExtra: 'some-class',
                fieldStyle: 'text-align: left;font-size: 12px;',
                autoScroll: true
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
                        socket.emit('CreateStudent', values).on('CreateStudentReturn', function(message) {
                            if (message == "success") {
                                if (Ext.getCmp('student_grid')) {
                                    Ext.getCmp('student_grid').getStore().load();
                                }
                                Ext.MessageBox.alert('Success', 'Successfully Data Inserted');
                                Ext.getCmp('studentFormWindow').close()
                            } else if (message == "error") {
                                Ext.MessageBox.alert('Error', 'Data not inserted. \nPossible problem could be duplicate entry');
                            }
                        });
                    }
                }
            }, {
                text: 'Close',
                handler: function() {
                    Ext.getCmp('studentFormWindow').close()
                }
            }]
        })]
    }).show();
}