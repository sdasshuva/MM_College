const async = require('async')
module.exports = function() {};

function getIncExpIncomeStatement(db, callback) {
    var returnData = [];
    db.account_head.findAll({
        where: {
            account_type: 1
        }
    }).then(rData => {
        async.each(rData, function(ah, cb_ah) {
            var o = {};
            o.id = ah.id
            o.name = ah.name
            o.amount = 0
            db.voucher_item.findAll({
                where: {
                    account_head: o.id
                }
            }).then(rData2 => {
                async.each(rData2, function(vi, cb_vi) {
                    o.amount += vi.amount
                    cb_vi()
                }, function(err) {
                    returnData.push(o)
                    cb_ah()
                })
            })
        }, function(err) {
            returnData.sort(function(a, b) {
                if (a.id < b.id) return -1;
                if (a.id > b.id) return 1;
                return 0;
            });
            callback(returnData)
        })
    })
}

function getIncExpExpenceStatement(db, callback) {
    var returnData = [];
    db.account_head.findAll({
        where: {
            account_type: 2
        }
    }).then(rData => {
        async.each(rData, function(ah, cb_ah) {
            var o = {};
            o.id = ah.id
            o.name = ah.name
            o.amount = 0
            db.voucher_item.findAll({
                where: {
                    account_head: o.id
                }
            }).then(rData2 => {
                async.each(rData2, function(vi, cb_vi) {
                    o.amount += vi.amount
                    cb_vi()
                }, function(err) {
                    returnData.push(o)
                    cb_ah()
                })
            })
        }, function(err) {
            returnData.sort(function(a, b) {
                if (a.id < b.id) return -1;
                if (a.id > b.id) return 1;
                return 0;
            });
            callback(returnData)
        })
    })
}

function routerInit(app, dbFull) {
    var db = dbFull.MM_College

    app.get('/getIncExpExpenceStatement', function (req, res) {
        getIncExpExpenceStatement(db, function (d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/getIncExpIncomeStatement', function (req, res) {
        getIncExpIncomeStatement(db, function (d) {
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