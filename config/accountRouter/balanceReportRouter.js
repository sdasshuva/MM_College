const async = require('async')
const Op = Sequelize.Op
module.exports = function() {};

function getBalanceIncomeList(db, callback) {
    var currentDate = new Date();
    var CM = currentDate.getMonth();
    var CY = currentDate.getFullYear();
    var FD = new Date(CY, CM, 1);
    var LD = new Date(CY, CM + 1, 1);
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
            o.current_balance = 0
            db.voucher_item.findAll({
                where: {
                    account_head: o.id
                },
                include: [{
                    model: db.voucher,
                    where: {
                        date: {
                            [Op.between]: [FD, LD]
                        }
                    }
                    // where: [['MONTH(date)=? AND YEAR(date)=?', CM, CY]]
                }]
            }).then(rData2 => {
                async.each(rData2, function(vi, cb_vi) {
                    o.current_balance += vi.amount
                    cb_vi()
                }, e => {
                    returnData.push(o)
                    cb_ah()
                })
            }).catch(e => {
                returnData.push(o)
                cb_ah()
            })
        }, e => {
            returnData.sort(function(a, b) {
                if (a.id < b.id) return -1;
                if (a.id > b.id) return 1;
                return 0;
            });
            callback(returnData)
        })
    }).catch(e => {
        callback([]);
    })
}

function getBalanceExpenceList(db, callback) {
    var currentDate = new Date();
    var CM = currentDate.getMonth();
    var CY = currentDate.getFullYear();
    var FD = new Date(CY, CM, 1);
    var LD = new Date(CY, CM + 1, 1);
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
            o.current_balance = 0
            db.voucher_item.findAll({
                where: {
                    account_head: o.id
                },
                include: [{
                    model: db.voucher,
                    where: {
                        date: {
                            [Op.between]: [FD, LD]
                        }
                    }
                    // where: [['MONTH(date)=? AND YEAR(date)=?', CM, CY]]
                }]
            }).then(rData2 => {
                async.each(rData2, function(vi, cb_vi) {
                    console.log(JSON.parse(JSON.stringify(vi)))
                    o.current_balance += vi.amount
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

    app.get('/getBalanceIncomeList', function (req, res) {
        getBalanceIncomeList(db, function (d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    });

    app.get('/getBalanceExpenceList', function (req, res) {
        getBalanceExpenceList(db, function (d) {
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