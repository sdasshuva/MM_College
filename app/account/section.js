function sectionTab(UN) {
    if (Ext.getCmp('section_tab')) {
        tab_panel.setActiveTab(Ext.getCmp("section_tab"));
    } else {
        var new_tab = tab_panel.add({
            title: 'Section',
            id: 'section_tab',
            layout: 'fit',
            closable: true,
            autoScroll: false,
            items: [Ext.create('Ext.grid.Panel', {
                id: 'section_grid',
                autoScroll: true,
                columnLines: true,
                loadMask: true,
                frame: true,
                store: {
                    proxy: {
                        type: 'ajax',
                        url: '/getSectionList',
                    },
                    autoLoad: true,
                    autoSync: false,
                    model: Ext.define('SECTION_MODEL', {
                        extend: 'Ext.data.Model',
                        fields: [{
                            name: 'id',
                            type: 'int'
                        }, {
                            name: 'name',
                            type: 'string'
                        }]
                    })
                },
                columns: [Ext.create('Ext.grid.RowNumberer', {
                    width: 50
                }), {
                    header: 'SECTION',
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
                                        socket.emit('DestroySection', rec.id).on('DestroySectionReturn', function(message) {
                                            if (message == "success") {
                                                if (Ext.getCmp('section_grid')) {
                                                    Ext.getCmp('section_grid').getStore().load();
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
                        socket.emit('UpdateSection', rec).on('UpdateSectionReturn', function(message) {
                            if (message == "success") {
                                if (Ext.getCmp('section_grid')) {
                                    Ext.getCmp('section_grid').getStore().load();
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
                    sectionFormWindow();
                }
            },{
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
                    Ext.getCmp('section_grid').getStore().load();
                }
            }]
        });
        tab_panel.setActiveTab(new_tab);
    }
}

function sectionFormWindow() {
    return Ext.create('Ext.window.Window', {
        title: 'Add New Section',
        modal: true,
        id: 'sectionFormWindow',
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
                emptyText: 'Give Section Name...',
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
                        socket.emit('CreateSection', values).on('CreateSectionReturn', function(message) {
                            if (message == "success") {
                                if (Ext.getCmp('section_grid')) {
                                    Ext.getCmp('section_grid').getStore().load();
                                }
                                Ext.MessageBox.alert('Success', 'Successfully data inserted')
                                Ext.getCmp('sectionFormWindow').close()
                            } else if (message == "error") {
                                Ext.MessageBox.alert('Error', 'Data not inserted. \nPossible problem could be duplicate entry');
                            }
                        })
                    }
                }
            }, {
                text: 'Close',
                handler: function() {
                    Ext.getCmp('sectionFormWindow').close()
                }
            }]
        })]
    }).show();
}