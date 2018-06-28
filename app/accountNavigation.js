function accountNavigation(user) {
    return Ext.create('Ext.tree.Panel', {
        title: title,
        icon: '/public/icons/form.png',
        collapsible: true,
        collapsed: false,
        animate: true,
        rootVisible: false,
        autoScroll: true,
        border: false,
        store: {
            proxy: {
                type: 'ajax',
                api: {
                    read: '/getNavigationTree/' + user.id
                },
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    idProperty: 'id',
                },
            },
            root: {
                expanded: true,
                loaded: true,
            },
            autoLoad: true
        },
        listeners: {
            itemclick: function(s, r) {
                switch (r.data.text) {
                    case "Student List":
                        studentTab(r.data.menuData);
                        break;
                    case "Designation List":
                        designationTab(r.data.menuData);
                        break;
                    case "Department List":
                        departmentTab(r.data.menuData);
                        break;
                    case "Section List":
                        sectionTab(r.data.menuData);
                        break;
                    case "Employee List":
                        employeeTab(r.data.menuData);
                        break;
                    case "Salary List":
                        salaryTab(r.data.menuData);
                        break;
                    case "User List":
                        userTab(r.data.menuData);
                        break;
                    case "Monthly Payment List":
                        monthlyPaymentTab(r.data.menuData);
                        break;
                    case "Voucher List":
                        voucherTab(r.data.menuData);
                        break;
                    case "Navigation List":
                        navigationTab(r.data.menuData);
                        break;
                    case "Account Head List":
                        accountHeadTab(r.data.menuData);
                        break;
                    case "Expense Report":
                        expenceReportTab(r.data.menuData);
                        break;
                    case "Income Report":
                        incomeReportTab(r.data.menuData);
                        break;
                    case "Inc & Exp Statement":
                        incExpStatementTab(r.data.menuData);
                        break;
                    case "Balance Report":
                        balaneReportTab(r.data.menuData);
                        break;
                }
            }
        }
    });
}