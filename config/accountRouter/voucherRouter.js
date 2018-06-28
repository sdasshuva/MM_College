module.exports = function() {}
const async = require('async')
const Op = Sequelize.Op

function getVoucherList(db, callback) {
    db.voucher.findAll({
        include: [{
            model: db.user
        }]
    }).then(rData => {
        callback(rData)
    })
}

function DestroyVoucher(db, DATA, callback) {
    db.voucher.destroy({
        where: {
            id: DATA
        }
    }).then(function(state, voucher) {
        if (state == 1) {
            callback("success");

        } else {
            callback("error")
        }
    })
}

function PrintVoucher(db, DATA, callback) {
    db.voucher.find({
        where: {
            id: [DATA],
        },
        include: [{
            model: db.user
        }]
    }).then(voucherDatas => {
        db.voucher_item.findAll({
            where: {
                voucher: [DATA]
            },
            include: [{
                model: db.voucher
            }, {
                model: db.account_head
            }]
        }).then(voucherItemDatas => {
            var fs = require('fs');
            var voucherData = JSON.parse(JSON.stringify(voucherDatas, null, 4));
            var voucherItemData = JSON.parse(JSON.stringify(voucherItemDatas, null, 4));
            callback(voucherItemData);
            var length = Object.keys(voucherItemDatas).length;

            var htmlStart = '<html>\n' +
                '<!DOCTYPE html>\n' +
                '<html>\n' +
                '<head>\n' +
                '<style>' +
                'body {' +
                'margin-top: 10%;' +
                'margin-right: 10%;' +
                'margin-left: 10%;' +
                'margin-bottom: 10%;' +
                'align: center;' +

                '}' +
                'table, th, td {' +
                'font-size: 60%;' +
                'border: 1px solid dimgrey;' +
                'border-collapse: collapse;' +
                '}' +
                'th, td {' +
                'padding: 3px;' +
                'line-height: 0.7;' +
                'align: center;' +
                '}' +
                'h1, h2, h3, h4, h5, h6 {' +
                'margin-bottom: 3%;' +
                'line-height: 0.5;' +
                'text-align: left;' +
                '}' +
                '#pageBody {' +
                // 'font-size: "50%";' +
                // 'padding: 0px 30px 0px 30px;' +
                'page-break-after: always;' +
                '}' +
                '#pageBody:last-child {' +
                'page-break-after: avoid;' +
                '}' +
                '</style>' +
                '</head>' +
                '<title></title>' +
                '</head>' +
                '<body>' +
                // '<img src="logo.png" alt="Mountain View">\n' +
                '<h4 style=" font-size:50%;line-height: 0.2; ">Voucher Details:  <span></span></h4>' +
                '<h6 style=" font-size:50%;line-height: 0.2; ">Manual Voucher No : ' + voucherData.voucher_no + '<span>' + '</span></h6>' +
                '<h6 style="font-size:50%;line-height: 0.2; " >Voucher Date : ' + voucherData.date + '<span>' + '</span></h6>' +
                '<h6 style="font-size:50%;line-height: 0.2;">Requistion User : ' + voucherData.User_Table.username + '<span>' + '</span></h6>' +
                // '<h6 style="font-size:50%;line-height: 0.2;">Requistion Purchase Order No :'+ voucherData.PO_NO_Table.name+'<span>' + '</span></h6>' +
                '<div id="page-wrap">' +
                '<table style="width:100%">' +
                '<tr>' +
                '<th>IP ID</th>' +
                '<th>Narration</th>' +
                '<th>Quantity</th>' +
                '<th>Amount</th>' +
                '<th>Account Head</th>' +
                '</tr>';

            var htmlEnd =
                '</table>' +
                '</div>' +
                '</body>' +
                '</html>';
            var htmlWF = '';
            if (length === 0) {
                console.log("there are no element in the json");
            } else if (length == 1) {
                fs.writeFile("./views/print.html", JSON.stringify(voucherItemData), function(err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log("The file was saved! from length 1 " + Object.keys(voucherItemData));
                });

                htmlWF = '<tr>' +
                    '<th>' + JSON.stringify(voucherItemData[0].id) + '</th>' +
                    '<th>' + JSON.stringify(voucherItemData[0].narration) + '</th>' +
                    '<th>' + JSON.stringify(voucherItemData[0].quantity) + '</th>' +
                    '<th>' + JSON.stringify(voucherItemData[0].amount) + '</th>' +
                    '<th>' + JSON.stringify(voucherItemData[0].Account_Head_Table.name) + '</th>' +
                    '</tr>';

                var htmlMeta = htmlStart.concat(htmlWF);
                var htmlComplete = htmlMeta.concat(htmlEnd);

                pdf.create(htmlComplete, options).toFile('./views/VoucherItem.pdf', function(err, res) {
                    if (err) return console.log(err);
                    // console.log(res); // { filename: '/app/businesscard.pdf' }
                    callback('success');
                });

            } else {

                var htmlWF = '';

                for (var i = 0; i < Object.keys(voucherItemData).length; i++) {
                    var htmlData = htmlWF.concat('<tr>' +
                        '<th>' + JSON.stringify(voucherItemData[i].id) + '</th>' +
                        '<th>' + JSON.stringify(voucherItemData[i].narration) + '</th>' +
                        '<th>' + JSON.stringify(voucherItemData[i].quantity) + '</th>' +
                        '<th>' + JSON.stringify(voucherItemData[i].amount) + '</th>' +
                        '<th>' + JSON.stringify(voucherItemData[i].Account_Head_Table.name) + '</th>' +
                        '</tr>');
                    htmlWF = htmlData;

                }
                var htmlMeta = htmlStart.concat(htmlWF);
                var htmlComplete = htmlMeta.concat(htmlEnd)


                fs.writeFile("./views/print.html", htmlComplete, function(err, lines) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log("The file was saved! length more than 1 & the length is " + length);
                    // cb(lines);
                });


                var options = {
                    format: 'A4',

                };
            }

            pdf.create(htmlComplete, options).toFile('./views/VoucherItem.pdf', function(err, res) {
                if (err) return console.log(err);
                // console.log(res); // { filename: '/app/businesscard.pdf' }
                callback('success');
            });
            // make the pdf copy downloadable.
        })
    })
}

function UpdateVoucher(db, DATA, callback) {
    var field = DATA.field;
    var value = DATA.value;
    var id = DATA.id;
    if (field == 'date') {
        db.voucher.find({
            where: {
                id: id
            }
        }).then(module => {
            module.updateAttributes({
                date: value,
            })
        });
    } else if (field == 'voucher_no') {
        db.voucher.find({
            where: {
                id: id
            }
        }).then(module => {
            module.updateAttributes({
                voucher_no: value,
            })
        });
    } else {
        db.voucher.find({
            where: {
                id: id
            }
        }).then(module => {
            module.updateAttributes({
                user: value,
            })
        });
    }
}

function CreateVoucher(db, DATA, callback, loginUserId) {
    db.voucher.create({
        date: DATA.date,
        voucher_no: DATA.voucher_no,
        user:DATA.user
    }).then(voucher => {
        if (DATA.account_head_voucher_list.length) {
            for (var i = 0; i < DATA.account_head_voucher_list.length; i++) {
                db.voucher_item.create({
                    voucher: voucher.id,
                    narration: DATA.narration_voucher_list[i],
                    quantity: DATA.quantity_voucher_list[i],
                    amount: DATA.amount_voucher_list[i],
                    account_head: DATA.account_head_voucher_list[i],
                })
            }
        } else {
            db.voucher_item.create({
                voucher: voucher.id,
                quantity: DATA.quantity_voucher_list,
                narration: DATA.narration_voucher_list,
                amount: DATA.amount_voucher_list,
                account_head: DATA.account_head_voucher_list,
            })
        }
    }).then(function(r) {
        callback("success")
    }).catch(function(r) {
        callback("error")
    })
}

function getVoucherItemList(db, callback) {
    db.voucher_item.findAll({
        include: [{
            model: db.voucher
        }, {
            model: db.account_head
        }]
    }).then(datas => {
        var data = JSON.parse(JSON.stringify(datas, null, 4));
        callback(data);
    })
}

function DestroyVoucherItem(db, DATA, callback) {
    db.voucher_item.destroy({
        where: {
            id: DATA
        }
    }).then(function(state, voucher_item) {
        if (state == 1) {
            callback("success");
        } else {
            callback("error")
        }
    })
}

function UpdateVoucherItem(db, DATA, callback) {
    var field = DATA.field;
    var value = DATA.value;
    var id = DATA.id;
    if (field == 'narration') {
        db.voucher_item.find({
            where: {
                id: id
            }
        }).then(module => {
            module.updateAttributes({
                narration: value,

            })
        });
    } else if (field == 'account_head') {
        db.voucher_item.find({
            where: {
                id: id
            }
        }).then(module => {
            module.updateAttributes({
                account_head: value,

            })
        });
    } else {
        db.voucher_item.find({
            where: {
                id: id
            }
        }).then(module => {
            module.updateAttributes({
                voucher: value,

            })
        })
    }
}

function routerInit(app, dbFull) {
    var db = dbFull.MM_College

    app.get('/getVoucherList', function (req, res) {
        getVoucherList(db, function (d) {
            res.setHeader('Content-Type', 'application/json')
            res.send(d)
        })
    })

    app.get('/getVoucherItemList', function (req, res) {
        getVoucherItemList(db, function (d) {
            res.setHeader('Content-Type', 'application/json');
            res.send(d);
        })
    })
}

function socketInit(dbFull, socket) {
    var db = dbFull.MM_College

    socket.on('PrintVoucher', function (data, res) {
        PrintVoucher(db, data, function (r) {
            socket.emit("PrintVoucherReturn", r)
        })
    })

    socket.on('DestroyVoucher', function (data) {
        DestroyVoucher(db, data, function (r) {
            socket.emit("DestroyVoucherReturn", r)
        })
    })

    socket.on('UpdateVoucher', function (data) {
        UpdateVoucher(db, data, function (r) {
            socket.emit("UpdateVoucherReturn", r)
        })
    })

    socket.on('CreateVoucher', function (data) {
        CreateVoucher(db, data, function (r) {
            socket.emit("CreateVoucherReturn", r)
        })
    })

    socket.on('DestroyVoucherItem', function (data) {
        DestroyVoucherItem(db, data, function (r) {
            socket.emit("DestroyVoucherItemReturn", r)
        })
    })

    socket.on('UpdateVoucherItem', function (data) {
        UpdateVoucherItem(db, data, function (r) {
            socket.emit("UpdateVoucherItemReturn", r)
        })
    })
}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;