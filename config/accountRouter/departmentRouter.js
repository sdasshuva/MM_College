module.exports = function() {};

function getDepartmentList(db, callback) {
    db.department.findAll().then(rData => {
        callback(rData);
    }).catch(e => {
        callback([])
    })
}

function UpdateDepartment(db, DATA, callback) {
    db.department.find({
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

function CreateDepartment(db, DATA, callback) {
    db.department.create({
        name: DATA.name
    }).then(function(r) {
        callback("success")
    }).catch(function(r) {
        callback("error")
    })
}

function DestroyDepartment(db, DATA, callback) {
    db.department.destroy({
        where: {
            id: DATA
        }
    }).then(function(state, department) {
        if (state == 1) {
            callback("success");

        } else {
            callback("error")
        }
    })
}

function routerInit(app, dbFull) {
    var db = dbFull.MM_College

    app.get('/getDepartmentList', function(req, res) {
        getDepartmentList(db, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });
}

function socketInit(dbFull, socket) {
    var db = dbFull.MM_College

    socket.on('UpdateDepartment', function(data) {
        UpdateDepartment(db, data, function(r) {
            socket.emit("UpdateDepartmentReturn", r)
        });
    });

    socket.on('CreateDepartment', function(data) {
        CreateDepartment(db, data, function(r) {
            socket.emit("CreateDepartmentReturn", r)
        });
    });

    socket.on('DestroyDepartment', function(data) {
        DestroyDepartment(db, data, function(r) {
            socket.emit("DestroyDepartmentReturn", r)
        });
    })
}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;