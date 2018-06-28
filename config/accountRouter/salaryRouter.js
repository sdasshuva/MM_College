module.exports = function() {};

function getSalaryList(db, callback) {
    db.salary.findAll({
        include: [{
            model: db.employee,
            include: [{
                model: db.designation
            }, {
                model: db.department
            }, {
                model: db.section
            }]
        }, {
            model: db.salary_type
        }]
    }).then(rData => {
        callback(rData)
    })
}

function getSalaryType(db, callback) {
    db.salary_type.findAll({}).then(rData => {
        callback(rData)
    })
}

function DestroySalary(db, DATA, callback) {
    db.salary.destroy({
        where: {
            id: DATA
        }
    }).then(function(state, salary) {
        if (state == 1) {
            callback("success");

        } else {
            callback("error")
        }
    })
}

function UpdateSalary(db, DATA, callback) {
    db.salary.find({
        where: {
            id: DATA.id
        }
    }).then(u => {
        u.updateAttributes(DATA.data).then(s => {
            callback('success')
        }).catch(e => {
            callback('error')
        })
    }).catch(e => {
        callback('error')
    })
}

function CreateSalary(db, DATA, callback) {
    db.salary.create({
        type: DATA.salary_type,
        date: DATA.date,
        amount: DATA.amount,
        employee: DATA.employee,
    }).then(function(r) {
        callback("success")
    }).catch(function(r) {
        callback("error")
    })
}

function getEmployeeSalary(db, DATA, callback) {
    id = DATA;
    db.query("select salary.id, employee.card_no,employee.id as employeeId, employee.name as employee_name ,section.name as section_name, designation.name as designation_name ,salary.amount as salary_amount, salary.date as salary_date, salary_type.name as salary_type from salary, section, employee, designation, salary_type where employee.id = " + id + "&&salary.employee = employee.id && section.id = employee.section && designation.id =employee.designation && salary.type =salary_type.id ORDER BY employee.name;", {
        type: sequelize.QueryTypes.SELECT
    }).then(rData => {
        callback(rData);
    }).catch(function(r) {
        callback([])
    })
}

function getEmployeeSalary(db, DATA, callback) {
    id = DATA;
    db.query("select salary.id, employee.card_no,employee.id as employeeId, employee.name as employee_name ,section.name as section_name, designation.name as designation_name ,salary.amount as salary_amount, salary.date as salary_date, salary_type.name as salary_type from salary, section, employee, designation, salary_type where employee.id = " + id + "&&salary.employee = employee.id && section.id = employee.section && designation.id =employee.designation && salary.type =salary_type.id ORDER BY employee.name;", {
        type: sequelize.QueryTypes.SELECT
    }).then(rData => {
        callback(rData);
    }).catch(function(r) {
        callback([])
    })
}

function routerInit(app, dbFull) {
    var db = dbFull.MM_College

    app.get('/getSalaryList', function(req, res) {
        getSalaryList(db, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    })

    app.get('/getSalaryType', function(req, res) {
        getSalaryType(db, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    })

    app.get('/getEmployeeSalary/:EID', function(req, res) {
        var EID = req.params.EID;
        getEmployeeSalary(dbFull, EID, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });
}

function socketInit(dbFull, socket) {
    var db = dbFull.MM_College

    socket.on('DestroySalary', function(data) {
        DestroySalary(db, data, function(r) {
            socket.emit("DestroySalaryReturn", r)
        })
    })

    socket.on('UpdateSalary', function(data) {
        UpdateSalary(db, data, function(r) {
            socket.emit("UpdateSalaryReturn", r)
        })
    })

    socket.on('CreateSalary', function(data) {
        CreateSalary(db, data, function(r) {
            socket.emit("CreateSalaryReturn", r)
        })
    })

    socket.on('EmployeeSalaryList', function (data) {
        EmployeeSalaryList(db, data, function (r) {
            socket.emit("EmployeeSalaryListReturn", r)
        })
    })
}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;