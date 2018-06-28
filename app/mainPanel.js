Date.prototype.monthDays = function() {
    var d = new Date(this.getFullYear(), this.getMonth() + 1, 0);
    return d.getDate();
}

Ext.Loader.setConfig({
    enabled: true,
    disableCaching: true
});
Ext.require([
    'Ext.panel.Panel',
    'Ext.window.MessageBox',
    'Ext.chart.*'
]);
Ext.onReady(function() {
    Ext.create('Ext.container.Viewport', {
        layout: 'border',
        items: [navigation_panel, tab_panel, footer_panel]
    });
})

let site_url = window.location.href;

var changingImage = Ext.create('Ext.Img', {
    src: '/public/images/mmc_background.png',
    height: 25,
    width: 22,
    margins: '8 10 0 0'
});

function popFromArray(myArray, value) {
    var index = myArray.indexOf(value);
    if (index > -1) {
        myArray.splice(index, 1);
    }
}

var myRender = function(value, metaData, record, rowIndex, colIndex, store, view) {
    if (parseInt(value) == 1) {
        metaData.attr = 'style="background-color:#ffaaaa !important;"';
    }
    return value
};

var grossIncome;
var grossExpense;

var footer_panel = Ext.create('Ext.toolbar.Toolbar', {
    region: 'south',
    border: false,
    items: [{
        xtype: 'tbtext',
        text: '<b><i>Developed By M.A.K. Ripon (Email: ripon@fashionflashltd.com, Contact: +880 173 0056 531 )</i></b>'
    }, '->', {
        xtype: 'tbtext',
        text: '<b><i>©2018 Moin Uddin Memorial College. All rights reserved</i></b>'
    }]
});

var tab_panel = Ext.create('Ext.tab.Panel', {
    region: 'center',
    layout: 'border',
    bodyStyle: {
        color: '#000000',
        backgroundImage: 'url(/public/images/mmc_background.png)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '50% 90%',
        backgroundPosition: 'center center'
    },
    id: 'tab_panel',
    items: []
});

var navigation_panel = Ext.create('Ext.panel.Panel', {
    region: 'west',
    title: title,
    icon: '/public/images/mmc_background.png',
    width: 200,
    split: true,
    collapsible: true,
    collapsed: false,
    floatable: false,
    header: false,
    layout: 'accordion',
    layoutConfig: {
        titleCollapse: false,
        animate: true,
        activeOnTop: true
    },
    tbar: [Ext.create('Ext.Img', {
        src: '/public/icons/user.png',
        height: 30,
        width: 30,
        margins: '5 5 5 5'
    }), {
        xtype: 'tbtext',
        text: user.username
    }, {
        icon: '/public/icons/shut_down.png',
        iconCls: 'add',
        name: 'sign_out',
        tooltip: 'Sign Out',
        handler: function() {
            window.location.href = site_url + 'logout';
        }
    }],
    items: [accountNavigation(user)]
});