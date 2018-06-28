module.exports = function() {};

function getAccountType(db, callback) {
    db.account_type.findAll().then(datas => {
        callback(datas);
    }).catch(e => {
        callback([]);
    })
}

function getAccountHeadList(db, callback) {
    db.account_head.findAll({
        include: [{
            model: db.account_head,
            as: 'Parent_Table'
        }, {
            model: db.account_type
        }]
    }).then(rData => {
        rData.sort(function(a, b) {
            if (a.id < b.id) return -1;
            if (a.id > b.id) return 1;
            return 0;
        });
        callback(rData);
    }).catch(e => {
        callback([]);
    })
}

function DestroyAccountHead(db, DATA, callback) {
    db.account_head.destroy({
        where: {
            id: DATA
        }
    }).then(function(state, account_head) {
        if (state == 1) {
            callback("success");
        } else {
            callback("error")
        }
    }).catch(e => {
        callback("error")
    })
}

function UpdateAccountHead(db, DATA, callback) {
    db.account_head.find({
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

function CreateAccountHead(db, DATA, callback) {
    db.account_head.create({
        name: DATA.name,
        account_type: DATA.account_type,
        parent: DATA.parent,
    }).then(function(r) {
        callback("success")
    }).catch(function(r) {
        callback("error")
    })
}

function routerInit(app, dbFull) {
    var db = dbFull.MM_College

    app.get('/getAccountType', function(req, res) {
        getAccountType(db, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    })

    app.get('/getAccountHeadList', function(req, res) {
        getAccountHeadList(db, function(d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    })
}

function socketInit(dbFull, socket) {
    var db = dbFull.MM_College
    socket.on('DestroyAccountHead', function(data) {
        DestroyAccountHead(db, data, function(r) {
            socket.emit("DestroyAccountHeadReturn", r)
        })
    })

    socket.on('UpdateAccountHead', function(data) {
        UpdateAccountHead(db, data, function(r) {
            socket.emit("UpdateAccountHeadReturn", r)
        })
    })

    socket.on('CreateAccountHead', function(data) {
        CreateAccountHead(db, data, function(r) {
            socket.emit("CreateAccountHeadReturn", r)
        })
    })
}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;