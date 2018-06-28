module.exports = function() {};

function getDesignationList(db, callback) {
    db.designation.findAll().then(rData => {
        callback(rData)
    }).catch(e => {
        callback([])
    })
}

function DestroyDesignation(db, DATA, callback) {
    db.designation.destroy({
        where: {
            id: DATA
        }
    }).then(function(state, designation) {
        if (state == 1) {
            callback("success");

        } else {
            callback("error")
        }
    })
}

function UpdateDesignation(db, DATA, callback) {
    db.designation.find({
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

function CreateDesignation(db, DATA, callback) {
    db.designation.create({
        name: DATA.name
    }).then(function(r) {
        callback("success")
    }).catch(function(r) {
        callback("error")
    })
}

function routerInit(app, dbFull) {
    var db = dbFull.MM_College

    app.get('/getDesignationList', function (req, res) {
        getDesignationList(db, function (d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });
}

function socketInit(dbFull, socket) {
    var db = dbFull.MM_College

    socket.on('CreateDesignation', function (data) {
        CreateDesignation(db, data, function (r) {
            socket.emit("CreateDesignationReturn", r)
        });
    });

    socket.on('UpdateDesignation', function (data) {
        UpdateDesignation(db, data, function (r) {
            socket.emit("UpdateDesignationReturn", r)
        });
    });

    socket.on('DestroyDesignation', function (data) {
        DestroyDesignation(db, data, function (r) {
            socket.emit("DestroyDesignationReturn", r)
        });
    });
}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;