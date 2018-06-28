module.exports = function() {};

function getExpenceList(db, callback) {
    db.voucher_item.findAll({
        include: [{
            model: db.voucher,
            include: [{
                model: db.user
            }]
        }, {
            model: db.account_head,
            where: {
                account_type: 2
            },
            include: [{
                model: db.account_head,
                as: 'Parent_Table'
            }, {
                model: db.account_type
            }]
        }]
    }).then(rData => {
        callback(rData)
    })
}

function routerInit(app, dbFull) {
    var db = dbFull.MM_College

    app.get('/getExpenceList', function (req, res) {
        getExpenceList(db, function (d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });
}

function socketInit(dbFull, socket) {
    var db = dbFull.MM_College
}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;