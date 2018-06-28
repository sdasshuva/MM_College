module.exports = function() {};

function getSectionList(db, callback) {
    db.section.findAll().then(rData => {
        callback(rData)
    }).catch(e => {
        callback([])
    })
}

function DestroySection(db, DATA, callback) {
    db.section.destroy({
        where: {
            id: DATA
        }
    }).then(function(state, section) {
        if (state == 1) {
            callback("success");

        } else {
            callback("error")
        }
    })
}

function UpdateSection(db, DATA, callback) {
    db.section.find({
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

function CreateSection(db, DATA, callback) {
    db.section.create({
        name: DATA.name
    }).then(function(r) {
        callback("success")
    }).catch(function(r) {
        callback("error")
    })
}

function routerInit(app, dbFull) {
    var db = dbFull.MM_College

    app.get('/getSectionList', function (req, res) {
        getSectionList(db, function (d) {
            res.setHeader('Content-Type', 'application/json')
            res.send(d)
        })
    })
}

function socketInit(dbFull, socket) {
    var db = dbFull.MM_College

    socket.on('DestroySection', function (data) {
        DestroySection(db, data, function (r) {
            socket.emit("DestroySectionReturn", r)
        })
    })

    socket.on('UpdateSection', function (data) {
        UpdateSection(db, data, function (r) {
            socket.emit("UpdateSectionReturn", r)
        })
    })

    socket.on('CreateSection', function (data) {
        CreateSection(db, data, function (r) {
            socket.emit("CreateSectionReturn", r)
        })
    })
}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;