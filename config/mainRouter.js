function mainRouter(app, db, io) {
    
    /////////////////////////////// ACCOUNT ROUTER STARTS ////////////////////////////////

    const userRouter = require(__dirname+'/accountRouter/userRouter.js')
    const salaryRouter = require(__dirname+'/accountRouter/salaryRouter.js')
    const studentRouter = require(__dirname+'/accountRouter/studentRouter.js')
    const sectionRouter = require(__dirname+'/accountRouter/sectionRouter.js')
    const voucherRouter = require(__dirname+'/accountRouter/voucherRouter.js')
    const employeeRouter = require(__dirname+'/accountRouter/employeeRouter.js')
    const navigationRouter = require(__dirname+'/accountRouter/navigationRouter.js')
    const departmentRouter = require(__dirname+'/accountRouter/departmentRouter.js')
    const designationRouter = require(__dirname+'/accountRouter/designationRouter.js')
    const accountHeadRouter = require(__dirname+'/accountRouter/accountHeadRouter.js')
    const incomeReportRouter = require(__dirname+'/accountRouter/incomeReportRouter.js')
    const expenceReportRouter = require(__dirname+'/accountRouter/expenceReportRouter.js')
    const balanceReportRouter = require(__dirname+'/accountRouter/balanceReportRouter.js')
    const monthlyPaymentRouter = require(__dirname+'/accountRouter/monthlyPaymentRouter.js')
    const incExpStatementRouter = require(__dirname+'/accountRouter/incExpStatementRouter.js')

    userRouter.routerInit(app,db)
    salaryRouter.routerInit(app,db)
    studentRouter.routerInit(app,db)
    sectionRouter.routerInit(app,db)
    voucherRouter.routerInit(app,db)
    employeeRouter.routerInit(app,db)
    navigationRouter.routerInit(app,db)
    departmentRouter.routerInit(app,db)
    designationRouter.routerInit(app,db)
    accountHeadRouter.routerInit(app,db)
    incomeReportRouter.routerInit(app,db)
    expenceReportRouter.routerInit(app,db)
    balanceReportRouter.routerInit(app,db)
    monthlyPaymentRouter.routerInit(app,db)
    incExpStatementRouter.routerInit(app,db)

    io.on('connection', function(s) {
        userRouter.socketInit(db,s)
        salaryRouter.socketInit(db,s)
        studentRouter.socketInit(db,s)
        sectionRouter.socketInit(db,s)
        voucherRouter.socketInit(db,s)
        employeeRouter.socketInit(db,s)
        navigationRouter.socketInit(db,s)
        departmentRouter.socketInit(db,s)
        designationRouter.socketInit(db,s)
        accountHeadRouter.socketInit(db,s)
        incomeReportRouter.socketInit(db,s)
        expenceReportRouter.socketInit(db,s)
        balanceReportRouter.socketInit(db,s)
        monthlyPaymentRouter.socketInit(db,s)
        incExpStatementRouter.socketInit(db,s)
    })

    /////////////////////////////// ACCOUNT ROUTER ENDS ////////////////////////////////

}

module.exports.mainRouter = mainRouter;