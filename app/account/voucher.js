var voucherProductArray = [];

function voucherTab(UN) {
    if (Ext.getCmp('voucher_tab')) {
        tab_panel.setActiveTab(Ext.getCmp("voucher_tab"));
    } else {
        var new_tab = tab_panel.add({
            title: 'Voucher',
            layout: 'fit',
            closable: true,
            autoScroll: false,
            id: 'voucher_tab',
            items: [Ext.create('Ext.grid.Panel', {
                id: 'voucher_grid',
                autoScroll: true,
                columnLines: true,
                loadMask: true,
                frame: true,
                store: {
                    proxy: {
                        type: 'ajax',
                        url: '/getVoucherList'
                    },
                    autoLoad: true,
                    autoSync: false,
                    model: Ext.define('VOUCHER_MODEL', {
                        extend: 'Ext.data.Model',
                        fields: [{
                            name: 'id',
                            type: 'int'
                        }, {
                            name: 'voucher_no',
                            type: 'string'
                        }, {
                            name: 'date',
                            type: 'date'
                        }, {
                            name: 'user',
                            type: 'string',
                            mapping: 'User_Table.username'
                        }]
                    })
                },
                columns: [Ext.create('Ext.grid.RowNumberer', {
                    width: 50
                }), {
                    header: 'DATE',
                    dataIndex: 'date',
                    flex: 1,
                    xtype: 'datecolumn',
                    editor: {
                        xtype: 'datefield',
                        allowBlank: false
                    }
                }, {
                    header: 'MANUAL VOUCHER NO',
                    dataIndex: 'voucher_no',
                    editor: 'textfield',
                    flex: 1
                }, {
                    header: 'USER',
                    dataIndex: 'user',
                    flex: 1
                }, {
                    xtype: 'actioncolumn',
                    header: 'PRINT',
                    flex: 0.3,
                    items: [{
                        icon: '/public/icons/print.png',
                        tooltip: 'PRINT',
                        handler: function(grid, rowIndex, colIndex) {
                            var rec = grid.getStore().getAt(rowIndex);
                            socket.emit('PrintVoucher', rec.id).on('PrintVoucherReturn', function(message) {
                                if (message == "success") {
                                    if (Ext.getCmp('voucher_grid')) {
                                        // Ext.getCmp('voucher_grid').getStore().load();
                                    }
                                    Ext.MessageBox.alert('Success', 'Click Here  <a href = "' + window.location + 'views/VoucherItem.pdf" target="_blank"> View Printed sheet</a>');
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
                                        socket.emit('DestroyVoucher', rec.id).on('DestroyVoucherReturn', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('voucher_grid')) {
                                                    Ext.getCmp('voucher_grid').getStore().load();
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
                        var id = rowIndex.record.id;
                        var field = rowIndex.field;
                        var value = rowIndex.value;
                        var rec = {
                            id,
                            field,
                            value
                        }
                        socket.emit('UpdateVoucher', rec).on('UpdateVoucherReturn', function(message) {
                            if (message == "success") {
                                if (Ext.getCmp('voucher_grid')) {
                                    Ext.getCmp('voucher_grid').getStore().load();
                                }
                                Ext.MessageBox.alert('Success', 'Successfully data inserted');
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
                id: 'voucherAddNew',
                text: 'Add New',
                tooltip: 'Add New',
                border: 1,
                style: {
                    borderColor: 'blue',
                    borderStyle: 'solid'
                },
                handler: function() {
                    voucherFormWindow(user.id);
                }
            }, {
                xtype: 'button',
                icon: '/public/icons/create.png',
                iconCls: 'add',
                name: 'reload',
                id: 'voucherTabReload',
                tooltip: 'Reload',
                border: 1,
                style: {
                    borderColor: 'blue',
                    borderStyle: 'solid'
                },
                handler: function() {
                    Ext.getCmp('voucher_grid').getStore().load();
                }
            }]
        });
        tab_panel.setActiveTab(new_tab);
    }
}

function voucherFormWindow(id) {
    var count = 0;
    return Ext.create('Ext.window.Window', {
        title: 'Add New Voucher',
        modal: true,
        id: 'voucherFormWindow',
        layout: 'fit',
        items: [Ext.create('Ext.form.Panel', {
            width: '35%',
            border: true,
            items: [{
                layout: {
                    type: 'vbox',
                    pack: 'start',
                    align: 'stretch'
                },
                items: [Ext.create('Ext.panel.Panel', {
                    id: 'voucherFormTop',
                    bodyPadding: 20,
                    border: false,
                    margin: '0 0 0 15',
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    items: [{
                        border: false,
                        layout: {
                            type: 'vbox',
                            pack: 'start',
                            align: 'stretch'
                        },
                        items: [{
                            xtype: 'textfield',
                            name: 'voucher_no',
                            fieldLabel: ' Manual No',
                            filedAlign: 'top',
                            allowBlank: false,
                            width: 300,
                            labelWidth: 80,
                            labelAlign: 'left',
                            labelStyle: 'text-align:left;border solid 1px white;',
                            labelSeparator: '',
                            emptyText: 'Give Manual Voucher No...',
                            labelClsExtra: 'some-class',
                            fieldStyle: 'text-align: left;font-size: 12px;',
                            autoScroll: true
                        }]
                    }, {
                        border: false,
                        margin: '0 0 0 35',
                        layout: {
                            type: 'vbox',
                            pack: 'start',
                            align: 'stretch'
                        },
                        items: [{
                            xtype: 'datefield',
                            fieldLabel: 'Date',
                            name: 'date',
                            filedAlign: 'top',
                            allowBlank: false,
                            width: 300,
                            labelWidth: 80,
                            labelAlign: 'right',
                            labelStyle: 'text-align:left;border solid 1px white;',
                            labelSeparator: '',
                            emptyText: 'Give Voucher Date...',
                            labelClsExtra: 'some-class',
                            fieldStyle: 'text-align: left;font-size: 12px;',
                            maxValue: new Date(),
                            autoScroll: true
                        }]
                    }]
                }), Ext.create('Ext.panel.Panel', {
                    id: 'voucherFormBottom',
                    border: false,
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    items: [Ext.create('Ext.panel.Panel', {
                        title: '<div style="text-align:center;">Account Head</div>',
                        id: 'voucherFormAccountHeadPanel',
                        flex: 1,
                        bodyPadding: 15,
                        items: [{
                            xtype: 'combo',
                            name: 'account_head_voucher_list',
                            //fieldLabel: 'Account Head',
                            allowBlank: false,
                            editable: false,
                            width: 150,
                            labelWidth: 50,
                            labelAlign: 'left',
                            labelSeparator: '',
                            emptyText: 'Select Account Head...',
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
                        }]
                    }), Ext.create('Ext.panel.Panel', {
                        title: '<div style="text-align:center;">Narration</div>',
                        id: 'voucherFormNarrationPanel',
                        flex: 1,
                        bodyPadding: 15,
                        items: [{
                            xtype: 'textfield',
                            name: 'narration_voucher_list',
                            //fieldLabel: ' Narration',
                            filedAlign: 'top',
                            allowBlank: false,
                            width: 150,
                            labelWidth: 50,
                            labelAlign: 'left',
                            labelStyle: 'text-align:left;border solid 1px white;',
                            labelSeparator: '',
                            emptyText: 'Give Narration...',
                            labelClsExtra: 'some-class',
                            fieldStyle: 'text-align: left;font-size: 12px;',
                            autoScroll: true
                        }]
                    }), Ext.create('Ext.panel.Panel', {
                        title: '<div style="text-align:center;">Quantity</div>',
                        id: 'voucherFormQuantityPanel',
                        flex: 1,
                        bodyPadding: 15,
                        items: [{
                            xtype: 'numberfield',
                            name: 'quantity_voucher_list',
                            //fieldLabel: ' Quantity',
                            filedAlign: 'top',
                            allowBlank: false,
                            width: 150,
                            labelWidth: 50,
                            labelAlign: 'left',
                            labelStyle: 'text-align:left;border solid 1px white;',
                            labelSeparator: '',
                            emptyText: 'Give Quantity...',
                            labelClsExtra: 'some-class',
                            fieldStyle: 'text-align: left;font-size: 12px;',
                            autoScroll: true
                        }]
                    }), Ext.create('Ext.panel.Panel', {
                        title: '<div style="text-align:center;">Amount</div>',
                        id: 'voucherFormAmountPanel',
                        flex: 1,
                        bodyPadding: 15,
                        items: [{
                            xtype: 'numberfield',
                            name: 'amount_voucher_list',
                            //fieldLabel: ' Amount',
                            filedAlign: 'top',
                            allowBlank: false,
                            width: 150,
                            labelWidth: 50,
                            labelAlign: 'left',
                            labelStyle: 'text-align:left;border solid 1px white;',
                            labelSeparator: '',
                            emptyText: 'Give Amount...',
                            labelClsExtra: 'some-class',
                            fieldStyle: 'text-align: left;font-size: 12px;',
                            autoScroll: true
                        }]
                    }), Ext.create('Ext.panel.Panel', {
                        title: '<div style="text-align:center;">Action</div>',
                        id: 'voucherFormAddButtonPanel',
                        flex: 0.5,
                        bodyPadding: 15,
                        layout: {
                            type: 'vbox'
                        },
                        items: [{
                            xtype: 'button',
                            style: "width:22px!important;" +
                                "height:22px!important;" +
                                "background-image: none;" +
                                "background-position: center center;" +
                                "background-size: contain !important;" +
                                "background-image: url('./public/icons/create.png') !important;" +
                                "background-color: #ffffff; " +
                                "border:none;" +
                                "background-repeat: no-repeat;",
                            margin: '0 0 5 0',
                            handler: function() {
                                count++;
                                voucherProductArray.push(count);
                                Ext.getCmp("voucherFormAccountHeadPanel").add(voucherAccountHeadComboItem(count));
                                Ext.getCmp("voucherFormNarrationPanel").add(voucherNarrationItem(count));
                                Ext.getCmp("voucherFormAmountPanel").add(voucherAmountItem(count));
                                Ext.getCmp("voucherFormQuantityPanel").add(voucherQuantityItem(count));
                                Ext.getCmp("voucherFormAddButtonPanel").add(voucherFormRemoveButton(count));
                            }
                        }]
                    })]
                })]
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
                        socket.emit('CreateVoucher', values).on('CreateVoucherReturn', function(message) {
                            if (message == "success") {
                                if (Ext.getCmp('voucher_grid')) {
                                    Ext.getCmp('voucher_grid').getStore().load();
                                }
                                Ext.MessageBox.alert('Success', 'Successfully data inserted')
                                Ext.getCmp('voucherFormWindow').close()
                            } else if (message == "error") {
                                Ext.MessageBox.alert('Error', 'Data not inserted. \nPossible problem could be duplicate entry');
                            }
                        })
                    }
                }
            }, {
                text: 'Close',
                handler: function() {
                    Ext.getCmp('voucherFormWindow').close()
                }
            }]
        })]
    }).show();
}

function voucherAccountHeadComboItem(id) {
    return Ext.create('Ext.form.ComboBox', {
        name: 'account_head',
        id: 'account_head_combo' + id,
        allowBlank: false,
        editable: false,
        width: 150,
        labelAlign: 'left',
        labelSeparator: '',
        emptyText: 'Select Account Head...',
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
    });
}

function voucherAmountItem(id) {
    return Ext.create('Ext.form.Number', {
        name: 'amount',
        id: 'voucher_item_amount' + id,
        filedAlign: 'top',
        allowBlank: false,
        width: 150,
        minValue: 0,
        labelAlign: 'left',
        labelStyle: 'text-align:left;border solid 1px white;',
        labelSeparator: '',
        emptyText: 'Give Amount...',
        labelClsExtra: 'some-class',
        fieldStyle: 'text-align: left;font-size: 12px;',
        autoScroll: true,
        autoScroll: true
    });
}

function voucherNarrationItem(id) {
    return Ext.create('Ext.form.Text', {
        name: 'narration',
        id: 'voucher_item_narration' + id,
        filedAlign: 'top',
        allowBlank: false,
        width: 150,
        //minValue:0,
        labelAlign: 'left',
        labelStyle: 'text-align:left;border solid 1px white;',
        labelSeparator: '',
        emptyText: 'Give Narration...',
        labelClsExtra: 'some-class',
        fieldStyle: 'text-align: left;font-size: 12px;',
        autoScroll: true,
        autoScroll: true
    });
}

function voucherQuantityItem(id) {
    return Ext.create('Ext.form.Number', {
        name: 'quantity',
        id: 'voucher_item_quantity' + id,
        filedAlign: 'top',
        allowBlank: false,
        width: 150,
        minValue: 0,
        labelAlign: 'left',
        labelStyle: 'text-align:left;border solid 1px white;',
        labelSeparator: '',
        emptyText: 'Give Quantity...',
        labelClsExtra: 'some-class',
        fieldStyle: 'text-align: left;font-size: 12px;',
        autoScroll: true,
        autoScroll: true
    });
}

function voucherFormRemoveButton(id) {
    return Ext.create('Ext.Button', {
        id: 'voucherFormRemoveButton' + id,
        margin: '0 0 5 0',
        style: "width:22px!important;" +
            "height:22px!important;" +
            "background-image: none;" +
            "background-position: center center;" +
            "background-size: contain !important;" +
            "background-image: url('./public/icons/close.png') !important;" +
            "background-color: #ffffff; " +
            "border:none;" +
            "background-repeat: no-repeat;",
        handler: function() {
            popFromArray(voucherProductArray, id);
            Ext.getCmp("voucherFormAccountHeadPanel").remove("account_head" + id, true);
            Ext.getCmp("voucherFormNarrationPanel").remove("voucher_item_narration" + id, true);
            Ext.getCmp("voucherFormAmountPanel").remove("voucher_item_amount" + id, true);
            Ext.getCmp("voucherFormQuantityPanel").remove("voucher_item_quantity" + id, true);
            Ext.getCmp("voucherFormAddButtonPanel").remove("voucherFormRemoveButton" + id, true);
        }
    });
}

function voucher_itemGrid() {
    return voucher_item_grid = Ext.create('Ext.grid.Panel', {
        id: 'voucher_item_grid',
        autoScroll: true,
        columnLines: true,
        loadMask: true,
        frame: true,
        store: {
            proxy: {
                type: 'ajax',
                url: '/voucher_item'
            },
            autoLoad: true,
            autoSync: false,
            model: Ext.define('VOUCHER_ITEM_MODEL', {
                extend: 'Ext.data.Model',
                fields: [{
                    name: 'id',
                    type: 'int'
                }, {
                    name: 'narration',
                    type: 'string'
                }, {
                    name: 'amount',
                    type: 'float'
                }, {
                    name: 'quantity',
                    type: 'float'
                }, {
                    name: 'voucher',
                    type: 'string',
                    mapping: 'Voucher_Table.voucher_no'
                }, {
                    name: 'account_head',
                    type: 'string',
                    mapping: 'Account_Head_Table.name'
                }]
            })
        },
        columns: [{
            header: 'SR#',
            dataIndex: 'id',
            flex: 0.3
        }, {
            header: 'Narration',
            dataIndex: 'narration',
            editor: 'textfield',
            flex: 1
        }, {
            header: 'Quantity',
            dataIndex: 'quantity',
            editor: 'textfield',
            flex: 1
        }, {
            header: 'Amount',
            dataIndex: 'amount',
            editor: 'textfield',
            flex: 1
        }, {
            header: 'Voucher',
            dataIndex: 'voucher',
            flex: 1,
            editor: {
                xtype: 'combo',
                name: 'voucher',
                id: 'voucher_combo',
                allowBlank: false,
                editable: false,
                width: 300,
                labelWidth: 80,
                labelAlign: 'left',
                labelSeparator: '',
                labelClsExtra: 'some-class',
                fieldStyle: 'text-align: left;font-size: 12px;',
                autoScroll: true,
                displayField: 'voucher_no',
                valueField: 'id',
                selectOnFocus: true,
                triggerAction: 'all',
                forceSelection: true,
                store: {
                    fields: ['id', 'voucher_no'],
                    proxy: {
                        type: 'ajax',
                        url: '/getVoucherList'
                    },
                    autoLoad: true,
                    autoSync: true
                },
            },
        }, {
            header: 'Account Head',
            dataIndex: 'account_head',
            flex: 1,
            editor: {
                xtype: 'combo',
                name: 'account_head',
                id: 'account_head_combo',
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
                                socket.emit('DestroyVoucherItem', rec.id).on('DestroyVoucherItemReturn', function(message) {
                                    if (message == "success") {
                                        if (Ext.getCmp('voucher_item_grid')) {
                                            Ext.getCmp('voucher_item_grid').getStore().load();
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
                var id = rowIndex.record.id;
                var field = rowIndex.field;
                var value = rowIndex.value;
                var rec = {
                    id,
                    field,
                    value
                }
                socket.emit('UpdateVoucherItem', rec).on('UpdateVoucherItemReturn', function(message) {
                    if (message == "success") {
                        if (Ext.getCmp('voucher_item_grid')) {
                            Ext.getCmp('voucher_item_grid').getStore().load();
                        }
                        Ext.MessageBox.alert('Success', 'Successfully data inserted');
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