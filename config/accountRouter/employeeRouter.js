module.exports = function() {};

function getEmployeeList(db, callback) {
    db.employee.findAll({
        include: [{
            model: db.designation
        }, {
            model: db.department
        }, {
            model: db.section
        }]
    }).then(rData => {
        rData.sort(function(a, b) {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        });
        callback(rData);
    }).catch(e => {
        callback([]);
    })
}

function DestroyEmployee(db, DATA, callback) {
    db.employee.destroy({
        where: {
            id: DATA
        }
    }).then(function(state) {
        callback("success")
    }).catch(e => {
        callback("error")
    })
}

function UpdateEmployee(db, DATA, callback) {
    db.employee.find({
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

function CreateEmployee(db, DATA, callback) {
    db.employee.create({
        name: DATA.name,
        email: DATA.email,
        card_no: DATA.card_no,
        designation: DATA.designation,
        department: DATA.department,
        section: DATA.section,
    }).then(function(r) {
        callback("success")
    }).catch(function(r) {
        callback("error")
    })
}

function routerInit(app, dbFull) {
    var db = dbFull.MM_College
    
    app.get('/getEmployeeList', function (req, res) {
        getEmployeeList(db, function (d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });
}

function socketInit(dbFull, socket) {
    var db = dbFull.MM_College
    
    socket.on('CreateEmployee', function (data) {
        CreateEmployee(db, data, function (r) {
            socket.emit("CreateEmployeeReturn", r)
        });
    });

    socket.on('UpdateEmployee', function (data) {
        UpdateEmployee(db, data, function (r) {
            socket.emit("UpdateEmployeeReturn", r)
        });
    });

    socket.on('DestroyEmployee', function (data) {
        DestroyEmployee(db, data, function (r) {
            socket.emit("DestroyEmployeeReturn", r)
        });
    });
}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;