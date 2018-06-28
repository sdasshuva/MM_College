function monthlyPaymentTab(UN) {
    if (Ext.getCmp('monthly_payment_tab')) {
        tab_panel.setActiveTab(Ext.getCmp("monthly_payment_tab"));
    } else {
        var new_tab = tab_panel.add({
            title: 'Monthly Payment',
            layout: 'fit',
            closable: true,
            autoScroll: false,
            id: 'monthly_payment_tab',
            items: [Ext.create('Ext.grid.Panel', {
                id: 'monthly_payment_grid',
                autoScroll: true,
                columnLines: true,
                loadMask: true,
                frame: true,
                store: {
                    proxy: {
                        type: 'ajax',
                        url: '/getMonthlyPaymentList'
                    },
                    autoLoad: true,
                    autoSync: false,
                    model: Ext.define('MONTHLY_PAYMENT_MODEL', {
                        extend: 'Ext.data.Model',
                        fields: [{
                            name: 'id',
                            type: 'int'
                        }, {
                            name: 'employee',
                            type: 'string',
                            mapping: 'Employee_Table.name'
                        }]
                    })
                },
                columns: [Ext.create('Ext.grid.RowNumberer', {
                    width: 50
                }), {
                    header: 'Employee',
                    dataIndex: 'employee',
                    listeners: {
                        beforerender: function(self, eOpts) {
                            if (UN.role < 2)
                                self.editor = false;
                        }
                    },
                    flex: 0.5,
                    editor: {
                        xtype: 'combo',
                        name: 'employee',
                        id: 'employee_combo',
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
                                url: '/getEmployeeList'
                            },
                            autoLoad: true,
                            autoSync: true
                        },
                    },
                }, {
                    header: 'Month',
                    dataIndex: 'month',
                    editor: 'datefield',
                    flex: 0.3,
                    xtype: 'datecolumn',
                    listeners: {
                        beforerender: function(self, eOpts) {
                            if (UN.role < 2)
                                self.editor = false;
                        }
                    },
                    format: 'M'
                }, {
                    header: 'Year',
                    dataIndex: 'year',
                    editor: 'datefield',
                    flex: 0.3,
                    xtype: 'datecolumn',
                    listeners: {
                        beforerender: function(self, eOpts) {
                            if (UN.role < 2)
                                self.editor = false;
                        }
                    },
                    format: 'Y'
                }, {
                    header: 'Present',
                    dataIndex: 'present',
                    flex: 0.3
                }, {
                    header: 'Absent',
                    dataIndex: 'absent',
                    editor: 'numberfield',
                    listeners: {
                        beforerender: function(self, eOpts) {
                            if (UN.role < 2)
                                self.editor = false;
                        }
                    },
                    flex: 0.3
                }, {
                    header: 'Holiday',
                    dataIndex: 'holiday',
                    editor: 'numberfield',
                    listeners: {
                        beforerender: function(self, eOpts) {
                            if (UN.role < 2)
                                self.editor = false;
                        }
                    },
                    flex: 0.3
                }, {
                    header: 'Weekend',
                    dataIndex: 'weekend',
                    editor: 'numberfield',
                    listeners: {
                        beforerender: function(self, eOpts) {
                            if (UN.role < 2)
                                self.editor = false;
                        }
                    },
                    flex: 0.3
                }, {
                    header: 'Leave',
                    dataIndex: 'leave',
                    editor: 'numberfield',
                    listeners: {
                        beforerender: function(self, eOpts) {
                            if (UN.role < 2)
                                self.editor = false;
                        }
                    },
                    flex: 0.3
                }, {
                    header: 'Salary',
                    dataIndex: 'salary',
                    editor: 'numberfield',
                    listeners: {
                        beforerender: function(self, eOpts) {
                            if (UN.role < 2)
                                self.editor = false;
                        }
                    },
                    flex: 0.3
                }, {
                    xtype: 'actioncolumn',
                    header: 'PRINT',
                    listeners: {
                        beforerender: function(self, eOpts) {
                            if (UN.role < 2)
                                self.editor = false;
                        }
                    },
                    flex: 0.3,
                    items: [{
                        icon: '/public/icons/print.png',
                        tooltip: 'PRINT',
                        handler: function(grid, rowIndex, colIndex) {
                            var rec = Ext.getCmp('monthly_payment_grid').getStore().getAt(rowIndex);
                            socket.emit('PrintMonthlyPayment', rec.data).on('PrintMonthlyPaymentReturn', function(message) {
                                if (message == "success") {
                                    if (Ext.getCmp('monthly_payment_grid')) {
                                        Ext.getCmp('monthly_payment_grid').getStore().load();
                                    }
                                    Ext.MessageBox.alert('Success', 'Click Here  <a href = "' + window.location + 'views/MonthlyPayment.pdf" target="_blank"> View Printed sheet</a>');
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
                                        socket.emit('DestroyMonthlyPayment', rec.id).on('DestroyMonthlyPaymentReturn', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('monthly_payment_grid')) {
                                                    Ext.getCmp('monthly_payment_grid').getStore().load();
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
                        socket.emit('UpdateMonthlyPayment', rec).on('UpdateMonthlyPaymentReturn', function(message) {
                            if (message == "success") {
                                if (Ext.getCmp('monthly_payment_grid')) {
                                    Ext.getCmp('monthly_payment_grid').getStore().load();
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
                    monthlyPaymentWindow();
                }
            }, {
                xtype: 'button',
                icon: '/public/icons/refresh.png',
                tooltip: 'Reload',
                border: 1,
                style: {
                    borderColor: 'blue',
                    borderStyle: 'solid'
                },
                handler: function() {
                    Ext.getCmp('monthly_payment_grid').getStore().load();
                }
            }]
        });
        tab_panel.setActiveTab(new_tab);
    }
}

function monthlyPaymentWindow() {
    return Ext.create('Ext.window.Window', {
        title: 'Add New Monthly Payment',
        modal: true,
        id: 'monthlyPaymentWindow',
        layout: 'fit',
        items: [Ext.create('Ext.form.Panel', {
            width: '35%',
            bodyPadding: 20,
            border: true,
            items: [Ext.create('Ext.form.field.Date', {
                name: 'month',
                width: 300,
                labelWidth: 80,
                fieldLabel: 'Select Month',
                filedAlign: 'top',
                allowBlank: true,
                editable: false,
                emptyText: 'Select Month',
                format: "M-Y",
                autoScroll: true,
                safeParse: function(value, format) {
                    var FDF = this.picker.value[0] + 1 + "/1/" + this.picker.value[1];
                    return new Date(FDF);
                },
                createPicker: function() {
                    var me = this,
                        format = Ext.String.format;
                    return new Ext.picker.Month({
                        pickerField: me,
                        ownerCt: me.ownerCt,
                        renderTo: document.body,
                        floating: true,
                        hidden: true,
                        focusOnShow: true,
                        showButtons: false,
                        minDate: me.minValue,
                        maxDate: me.maxValue,
                        disabledDatesRE: me.disabledDatesRE,
                        disabledDatesText: me.disabledDatesText,
                        disabledDays: me.disabledDays,
                        disabledDaysText: me.disabledDaysText,
                        format: me.format,
                        showToday: me.showToday,
                        startDay: me.startDay,
                        minText: format(me.minText, me.formatDate(me.minValue)),
                        maxText: format(me.maxText, me.formatDate(me.maxValue)),
                        listeners: {
                            scope: me,
                            select: me.onSelect
                        },
                        keyNavConfig: {
                            esc: function() {
                                me.collapse();
                            }
                        }
                    })
                }
            }), {
                xtype: 'numberfield',
                name: 'absent',
                fieldLabel: 'Absent',
                filedAlign: 'top',
                allowBlank: false,
                width: 300,
                labelWidth: 80,
                labelAlign: 'left',
                labelStyle: 'text-align:left;border solid 1px white;',
                labelSeparator: '',
                emptyText: 'Give Monthly Payment Absent...',
                labelClsExtra: 'some-class',
                fieldStyle: 'text-align: left;font-size: 12px;',
                autoScroll: true
            }, {
                xtype: 'numberfield',
                name: 'holiday',
                fieldLabel: 'Holiday',
                filedAlign: 'top',
                allowBlank: false,
                width: 300,
                labelWidth: 80,
                labelAlign: 'left',
                labelStyle: 'text-align:left;border solid 1px white;',
                labelSeparator: '',
                emptyText: 'Give Holiday...',
                labelClsExtra: 'some-class',
                fieldStyle: 'text-align: left;font-size: 12px;',
                autoScroll: true
            }, {
                xtype: 'numberfield',
                name: 'weekend',
                fieldLabel: 'Weekend',
                filedAlign: 'top',
                allowBlank: false,
                width: 300,
                labelWidth: 80,
                labelAlign: 'left',
                labelStyle: 'text-align:left;border solid 1px white;',
                labelSeparator: '',
                emptyText: 'Give Weekend...',
                labelClsExtra: 'some-class',
                fieldStyle: 'text-align: left;font-size: 12px;',
                autoScroll: true
            }, {
                xtype: 'numberfield',
                name: 'leave',
                fieldLabel: ' Leave',
                filedAlign: 'top',
                allowBlank: false,
                width: 300,
                labelWidth: 80,
                labelAlign: 'left',
                labelStyle: 'text-align:left;border solid 1px white;',
                labelSeparator: '',
                emptyText: 'Give Leave...',
                labelClsExtra: 'some-class',
                fieldStyle: 'text-align: left;font-size: 12px;',
                autoScroll: true
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
                },
                listeners: {
                    change: {
                        fn: function(combo, value) {
                            //console.log(value)
                        }
                    }
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
                    var panel = this.up('form')
                    var form = panel.getForm()
                    var values = form.getValues()
                    values.present = new Date(values.month).monthDays()-(parseInt(values.holiday)+parseInt(values.weekend)+parseInt(values.leave)+parseInt(values.absent))
                    values.year = new Date(values.month).getFullYear()
                    values.month = new Date(values.month).getMonth()+1
                    for (var key in values) {
                        if (values[key] === '') {
                            values[key] = null;
                        }
                    }
                    if (form.isValid()) {
                        socket.emit('CreateMonthlyPayment', values).on('CreateMonthlyPaymentReturn', function(message) {
                            if (message == "success") {
                                if (Ext.getCmp('monthly_payment_grid')) {
                                    Ext.getCmp('monthly_payment_grid').getStore().load();
                                }
                                Ext.MessageBox.alert('Success', 'Successfully data inserted');
                                Ext.getCmp('monthlyPaymentWindow').close()
                            } else if (message == "error") {
                                Ext.MessageBox.alert('Error', 'Data not inserted. \nPossible problem could be duplicate entry');
                            }
                        });
                    }
                }
            }, {
                text: 'Close',
                handler: function() {
                    Ext.getCmp('monthlyPaymentWindow').close()
                }
            }]
        })]
    }).show();
}