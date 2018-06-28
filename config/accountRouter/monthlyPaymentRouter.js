module.exports = function() {};

function getMonthlyPaymentList(db, callback) {
    db.monthly_payment.findAll({
        include: [{
            model: db.employee,
            include: [{
                model: db.designation
            }, {
                model: db.department
            }, {
                model: db.section
            }]
        }]
    }).then(rData => {
        callback(rData)
    })
}

function DestroyMonthlyPayment(db, DATA, callback) {
    db.monthly_payment.destroy({
        where: {
            id: DATA
        }
    }).then(function(state, monthly_payment) {
        if (state == 1) {
            callback("success");

        } else {
            callback("error")
        }
    })
}

function UpdateMonthlyPayment(db, DATA, callback) {
    db.monthly_payment.find({
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

function CreateMonthlyPayment(db, DATA, callback) {
    db.monthly_payment.create(DATA).then(function(r) {
        callback("success")
    }).catch(function(r) {
        callback("error")
    })
}

function PrintMonthlyPayment(db, DATA, callback) {
    db.query("select employee.id, employee.name, designation.name AS Designation, employee.card_no, monthly_payment.present,monthly_payment.month AS Month,monthly_payment.year AS Year, monthly_payment.absent, monthly_payment.salary*.6 as Basic, monthly_payment.salary*.2 AS HouseRent, monthly_payment.salary*.1 AS Medical, monthly_payment.salary*.1 AS Convayance, monthly_payment.salary AS Gross_Salary,monthly_payment.salary AS NetPayment from monthly_payment, employee, designation where monthly_payment.employee = employee.id && monthly_payment.year = " + DATA.year + " && monthly_payment.month= " + DATA.month + " && employee.designation = designation.id;", {
        type: db.QueryTypes.SELECT
    }).then(salarys => {
        var length = Object.keys(salarys).length;
        if (length == 1) {
            var rDate = new Date(salarys[0].DATE);
            var mysqlDate = rDate.getUTCFullYear() + '-' +
                ('00' + (rDate.getUTCMonth() + 1)).slice(-2) + '-' +
                ('00' + rDate.getUTCDate()).slice(-2) + ' ' +
                ('00' + rDate.getUTCHours()).slice(-2) + ':' +
                ('00' + rDate.getUTCMinutes()).slice(-2) + ':' +
                ('00' + rDate.getUTCSeconds()).slice(-2);

            var month = rDate.getMonth() + 1;
            var year = rDate.getFullYear();
            var d = new Date(year, month, 0);
            var totalDay = d.getDate();
            var salaryMeta = JSON.parse(JSON.stringify(salarys, null, 4));
            var salary = salaryMeta.Current_Salary;

            var htmlStart = '<!DOCTYPE html>\n' +
                '<html>\n' +
                '<head>\n' +
                ' <title>Leave Application</title>\n' +
                ' <style type="text/css">\n' +
                '  /*table { \n' +
                '     border-collapse: collapse;\n' +
                '  }\n' +
                '\n' +
                '  td {\n' +
                '      padding: 5px; \n' +
                '      border: .5x solid black; \n' +
                '      \n' +
                '  }*/\n' +
                '\n' +
                '  #p2{\n' +
                '    font-size: 12px;\n' +
                '       padding-left: 41%;\n' +
                '  }\n' +
                '\n' +
                '  #p3{\n' +
                '       font-size: 10px;\n' +
                '       padding-left: 40%;\n' +
                '       margin-top: -16PX;\n' +
                '  }\n' +
                '\n' +
                '  table {\n' +
                '      border-collapse: collapse;\n' +
                '      width: 100%;\n' +
                '\n' +
                '      border: 1px solid black;\n' +
                '   } \n' +
                '\n' +
                '   td {\n' +
                '        \n' +
                '        border: 1px solid black;\n' +
                '     font-size: 5px;\n' +
                '   }\n' +
                '\n' +
                '\n' +
                '\n' +
                '\n' +
                '  \n' +
                ' </style>\n' +
                '</head>\n' +
                '<body >\n' +
                '\n' +
                ' \n' +
                ' \n' +
                '   <P id=\'p2\' >MOINUDDIN MEMORIAL COLLEGE</P>\n' +
                '   <P id=\'p3\' >SALARY & ALLOWANCE STATEMENTR</P> <br>\n' +
                ' \n' +
                '\n' +
                '\n' +
                '\n' +
                ' <table >\n' +
                '     \n' +
                '  <tr>\n' +
                '   <td rowspan="2"> #</td>\n' +
                '         <td rowspan="2"> FP ID</td>\n' +
                '         <td rowspan="2"> EMPLOYEE NAME</td>\n' +
                '         <td rowspan="2"> DESIGNATION</td>\n' +
                '         <td rowspan="2"> JOIN DATE</td>\n' +
                '         <td rowspan="2"> CARD</td>\n' +
                '         <td rowspan="2"> T.D</td>\n' +
                '         <td rowspan="2"> P.D</td>\n' +
                '         <td rowspan="2"> A.D</td>\n' +
                '         <td rowspan="2"> BASIC</td>\n' +
                '         <td colspan="3" >ALLOWANCES</td>\n' +
                '         <td rowspan="2"> GROSS SALARY </td>\n' +
                '         <td rowspan="2"> NET PAYABLE </td>\n' +
                '         <td rowspan="2"> PAY MODE</td>\n' +
                '         <td rowspan="2"> ..SIGNATURE..</td>\n' +
                '     </tr>\n' +
                '     <tr>\n' +
                '      \n' +
                '         <td >House Rent</td>\n' +
                '         <td >Medical</td>\n' +
                '         <td >Conveyance</td>\n' +
                '\n' +
                '         \n' +
                '         \n' +
                '     </tr>\n' +
                '     \n' +
                '     <tr>\n' +
                '      <td>\'\' </td>\n' +
                '      <td>' + salarys[0].id + '</td>\n' +
                '      <td>' + salarys[0].name + ' </td>\n' +
                '      <td>' + salarys[0].Designation + ' </td>\n' +
                '      <td>' + salarys[0].Month + '-' + salarys[0].Year + ' </td>\n' +
                '      <td>' + salarys[0].card_no + ' </td>\n' +
                '      <td>' + totalDay + '</td>\n' +
                '      <td>' + salarys[0].present + '</td>\n' +
                '      <td>' + salarys[0].absent + '</td>\n' +
                '         <td>' + salarys[0].Basic + ' </td>\n' +
                '         <td >' + salarys[0].HouseRent + '</td>\n' +
                '         <td >' + salarys[0].Medical + '</td>\n' +
                '         <td>' + salarys[0].Convayance + '</td>\n' +
                '         <td>' + salarys[0].Gross_Salary + '</td>\n' +
                '         <td>' + salarys[0].NetPayment + '</td>\n' +
                '         <td></td>\n' +
                '         <td></td>\n' +
                '     </tr>\n' +
                '\n' +
                '     \n' +
                ' </table><br>\n' +
                '\n' +
                ' \n' +
                '</body>\n' +
                '</html>';
            var options = {
                format: 'A4',
                orientation: 'landscape'
            };
            pdf.create(htmlStart, options).toFile('./views/MonthlyPayment.pdf', function(err, res) {
                if (err) return console.log(err);
                console.log(res); // { filename: '/app/businesscard.pdf' }
                callback('success');
            });
        } else if (length > 1) {
            var htmlStart = '<!DOCTYPE html>\n' +
                '<html>\n' +
                '<head>\n' +
                ' <title>Leave Application</title>\n' +
                ' <style type="text/css">\n' +
                '  /*table { \n' +
                '     border-collapse: collapse;\n' +
                '  }\n' +
                '\n' +
                '  td {\n' +
                '      padding: 5px; \n' +
                '      border: .5x solid black; \n' +
                '      \n' +
                '  }*/\n' +
                '\n' +
                '  #p2{\n' +
                '    font-size: 12px;\n' +
                '       padding-left: 41%;\n' +
                '  }\n' +
                '\n' +
                '  #p3{\n' +
                '       font-size: 10px;\n' +
                '       padding-left: 40%;\n' +
                '       margin-top: -16PX;\n' +
                '  }\n' +
                '\n' +
                '  table {\n' +
                '      border-collapse: collapse;\n' +
                '      width: 100%;\n' +
                '\n' +
                '      border: 1px solid black;\n' +
                '   } \n' +
                '\n' +
                '   td {\n' +
                '        \n' +
                '        border: 1px solid black;\n' +
                '     font-size: 5px;\n' +
                '   }\n' +
                '\n' +
                '\n' +
                '\n' +
                '\n' +
                '  \n' +
                ' </style>\n' +
                '</head>\n' +
                '<body >\n' +
                '\n' +
                ' \n' +
                ' \n' +
                '   <P id=\'p2\' >MOINUDDIN MEMORIAL COLLEGE</P>\n' +
                '   <P id=\'p3\' >SALARY & ALLOWANCE STATEMENTR</P> <br>\n' +
                ' \n' +
                '\n' +
                '\n' +
                '\n' +
                ' <table >\n' +
                '     \n' +
                '  <tr>\n' +
                '   <td rowspan="2"> #</td>\n' +
                '         <td rowspan="2"> FP ID</td>\n' +
                '         <td rowspan="2"> EMPLOYEE NAME</td>\n' +
                '         <td rowspan="2"> DESIGNATION</td>\n' +
                '         <td rowspan="2"> JOIN DATE</td>\n' +
                '         <td rowspan="2"> CARD</td>\n' +
                '         <td rowspan="2"> T.D</td>\n' +
                '         <td rowspan="2"> P.D</td>\n' +
                '         <td rowspan="2"> A.D</td>\n' +
                '         <td rowspan="2"> BASIC</td>\n' +
                '         <td colspan="3" >ALLOWANCES</td>\n' +
                '         <td rowspan="2"> GROSS SALARY </td>\n' +
                '         <td rowspan="2"> NET PAYABLE </td>\n' +
                '         <td rowspan="2"> PAY MODE</td>\n' +
                '         <td rowspan="2"> ..SIGNATURE..</td>\n' +
                '     </tr>\n' +
                '     <tr>\n' +
                '      \n' +
                '         <td >House Rent</td>\n' +
                '         <td >Medical</td>\n' +
                '         <td >Conveyance</td>\n' +
                '\n' +
                '         \n' +
                '         \n' +
                '     </tr>\n' +
                '     \n';

            var htmlEnd = ' </table><br>\n' +
                '\n' +
                ' \n' +
                '</body>\n' +
                '</html>';

            var htmlWF = '';

            for (var i = 0; i < Object.keys(salarys).length; i++) {

                var rDate = new Date(salarys[0].DATE);
                // console.log(rDate);
                var mysqlDate = rDate.getUTCFullYear() + '-' +
                    ('00' + (rDate.getUTCMonth() + 1)).slice(-2) + '-' +
                    ('00' + rDate.getUTCDate()).slice(-2) + ' ' +
                    ('00' + rDate.getUTCHours()).slice(-2) + ':' +
                    ('00' + rDate.getUTCMinutes()).slice(-2) + ':' +
                    ('00' + rDate.getUTCSeconds()).slice(-2);

                var month = rDate.getMonth() + 1;
                console.log(month);
                var year = rDate.getFullYear();
                console.log(year);
                var d = new Date(year, month, 0);
                var totalDay = d.getDate();


                var htmlData = htmlWF.concat('<tr>\n' +
                    '      <td>\'\' </td>\n' +
                    '      <td>' + salarys[i].id + '</td>\n' +
                    '      <td>' + salarys[i].name + ' </td>\n' +
                    '      <td>' + salarys[i].Designation + ' </td>\n' +
                    '      <td>' + salarys[i].Month + '-' + salarys[i].Year + ' </td>\n' +
                    '      <td>' + salarys[i].card_no + ' </td>\n' +
                    '      <td>' + totalDay + '</td>\n' +
                    '      <td>' + salarys[i].present + '</td>\n' +
                    '      <td>' + salarys[i].absent + '</td>\n' +
                    '         <td>' + salarys[i].Basic + ' </td>\n' +
                    '         <td >' + salarys[i].HouseRent + '</td>\n' +
                    '         <td >' + salarys[i].Medical + '</td>\n' +
                    '         <td>' + salarys[i].Convayance + '</td>\n' +
                    '         <td>' + salarys[i].Gross_Salary + '</td>\n' +
                    '         <td>' + salarys[i].NetPayment + '</td>\n' +
                    '         <td></td>\n' +
                    '         <td></td>\n' +
                    '     </tr>\n');
                htmlWF = htmlData;

            }
            var htmlMeta = htmlStart.concat(htmlWF);
            var htmlComplete = htmlMeta.concat(htmlEnd)

            var options = {
                format: 'A4',
                orientation: 'landscape'

            };
            pdf.create(htmlComplete, options).toFile('./views/MonthlyPayment.pdf', function(err, res) {
                if (err) return console.log(err);
                console.log(res); // { filename: '/app/businesscard.pdf' }
                callback('success');
            });
        }
    })
}

function routerInit(app, dbFull) {
    var db = dbFull.MM_College

    app.get('/getMonthlyPaymentList', function(req, res) {
        getMonthlyPaymentList(db, function(d) {
            res.setHeader('Content-Type', 'application/json')
            res.send(d)
        })
    })
}

function socketInit(dbFull, socket) {
    var db = dbFull.MM_College

    socket.on('DestroyMonthlyPayment', function(data) {
        DestroyMonthlyPayment(db, data, function(r) {
            socket.emit("DestroyMonthlyPaymentReturn", r)
        })
    })

    socket.on('UpdateMonthlyPayment', function(data) {
        UpdateMonthlyPayment(db, data, function(r) {
            socket.emit("UpdateMonthlyPaymentReturn", r)
        })
    })

    socket.on('PrintMonthlyPayment', function(data) {
        PrintMonthlyPayment(dbFull, data, function(r) {
            socket.emit("PrintMonthlyPaymentReturn", r)
        })
    })

    socket.on('CreateMonthlyPayment', function(data) {
        CreateMonthlyPayment(db, data, function(r) {
            socket.emit("CreateMonthlyPaymentReturn", r)
        })
    })
}

module.exports.routerInit = routerInit;
module.exports.socketInit = socketInit;