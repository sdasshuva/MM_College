module.exports = function() {};

function getStudentList(db, callback) {
    db.student.findAll({
        include: [{
            model: db.gender
        },{
            model: db.religion
        },{
            model: db.blood_group
        }]
    }).then(rData => {
        callback(rData)
    }).catch(e => {
        callback([])
    })
}

function getGenderList(db, callback) {
    db.gender.findAll().then(rData => {
        callback(rData)
    }).catch(e => {
        callback([])
    })
}

function getReligionList(db, callback) {
    db.religion.findAll().then(rData => {
        callback(rData)
    }).catch(e => {
        callback([])
    })
}

function getBloodGroupList(db, callback) {
    db.blood_group.findAll().then(rData => {
        callback(rData)
    }).catch(e => {
        callback([])
    })
}

function DestroyStudent(db, DATA, callback) {
    db.student.destroy({
        where: {
            id: DATA
        }
    }).then(function(state, employee) {
        if (state == 1) {
            callback("success");

        } else {
            callback("error")
        }
    })
}

function UpdateStudent(db, DATA, callback) {
    db.student.find({
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

function CreateStudent(db, DATA, callback) {
    db.student.create({
        name: DATA.name,
        card_no: DATA.card_no,
        date_of_birth: DATA.date_of_birth,
        gender: DATA.gender,
        religion: DATA.religion,
        blood_group: DATA.blood_group,
        contact_no: DATA.contact_no,
        phone_no: DATA.phone_no
    }).then(function(r) {
        callback("success")
    }).catch(function(r) {
        callback("error")
    })
}

function routerInit(app, dbFull) {
    var db = dbFull.MM_College

    app.get('/getStudentList', function (req, res) {
        getStudentList(db, function (d) {
            res.setHeader('Content-Type', 'application/json')
            res.send(d)
        })
    })

    app.get('/getGenderList', function (req, res) {
        getGenderList(db, function (d) {
            res.setHeader('Content-Type', 'application/json')
            res.send(d)
        })
    })

    app.get('/getReligionList', function (req, res) {
        getReligionList(db, function (d) {
            res.setHeader('Content-Type', 'application/json')
            res.send(d)
        })
    })

    app.get('/getBloodGroupList', function (req, res) {
        getBloodGroupList(db, function (d) {
            res.setHeader('Content-Type', 'application/json')
            res.send(d)
        })
    })
}

function socketInit(dbFull, socket) {
    var db = dbFull.MM_College

    socket.on('DestroyStudent', function (data) {
        DestroyStudent(db, data, function (r) {
            socket.emit("DestroyStudentReturn", r)
        });
    });

    socket.on('UpdateStudent', function (data) {
        UpdateStudent(db, data, function (r) {
            socket.emit("UpdateStudentReturn", r)
        });
    });

    socket.on('CreateStudent', function (data) {
        CreateStudent(db, data, function (r) {
            socket.emit("CreateStudentReturn", r)
        })
    })
}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;