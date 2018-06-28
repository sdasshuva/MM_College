var Sequelize = require('sequelize');
var myLogFunc = function(msg, a) {
    // console.log(msg)
    // console.log(a)
}

function connect() {
    var dbName = 'mm_college';
    var dbUser = (process.env.PWD.toUpperCase().indexOf("DROPBOX") != -1) ? 'root' : 'root';
    var dbPass = (process.env.PWD.toUpperCase().indexOf("DROPBOX") != -1) ? '1234' : 'Bi99#Bo559@mysql';
    var sequelize = new Sequelize(dbName, dbUser, dbPass, {
        host: 'localhost',
        dialect: 'mysql',
        timezone: '+06:00',
        dialectOptions: {
            useUTC: false, //for reading from database
            dateStrings: true,
            typeCast: function(field, next) { // for reading from database
                if (field.type === 'DATETIME') {
                    return field.string()
                }
                return next()
            },
        },
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        },
        logging: (process.env.PWD.toUpperCase().indexOf("DROPBOX")!=-1)?myLogFunc:false,
        operatorsAliases: false
    });

    sequelize.authenticate().then(function(err) {
        if (!err) {
            console.log('Connection has been established successfully.')
        } else {
            console.log('Unable to connect to the database:', err)
        }
    })

    /////*******************#####  RIPS MODELER FILE INCLUDING STARTS  *#####****************/////

    this.account_type = require(__dirname + '/mmc_model/account_type.js')(sequelize);
    this.blood_group = require(__dirname + '/mmc_model/blood_group.js')(sequelize);
    this.religion = require(__dirname + '/mmc_model/religion.js')(sequelize);
    this.gender = require(__dirname + '/mmc_model/gender.js')(sequelize);
    this.class = require(__dirname + '/mmc_model/class.js')(sequelize);
    this.designation = require(__dirname + '/mmc_model/designation.js')(sequelize);
    this.department = require(__dirname + '/mmc_model/department.js')(sequelize);
    this.role = require(__dirname + '/mmc_model/role.js')(sequelize);
    this.section = require(__dirname + '/mmc_model/section.js')(sequelize);
    this.salary_type = require(__dirname + '/mmc_model/salary_type.js')(sequelize);
    this.account_head = require(__dirname + '/mmc_model/account_head.js')(sequelize);
    this.employee = require(__dirname + '/mmc_model/employee.js')(sequelize);
    this.navigation = require(__dirname + '/mmc_model/navigation.js')(sequelize);
    this.salary = require(__dirname + '/mmc_model/salary.js')(sequelize);
    this.user = require(__dirname + '/mmc_model/user.js')(sequelize);
    this.voucher = require(__dirname + '/mmc_model/voucher.js')(sequelize);
    this.voucher_item = require(__dirname + '/mmc_model/voucher_item.js')(sequelize);
    this.monthly_payment = require(__dirname + '/mmc_model/monthly_payment.js')(sequelize);
    this.navigation = require(__dirname + '/mmc_model/navigation.js')(sequelize);
    this.user_navigation = require(__dirname + '/mmc_model/user_navigation.js')(sequelize);
    this.student = require(__dirname + '/mmc_model/student.js')(sequelize);
    this.student_class = require(__dirname + '/mmc_model/student_class.js')(sequelize);

    /////*****************#####  RIPS MODELER FILE INCLUDING ENDS  *#####**************/////
    /////*******************#####   RELATIONSHIP WITH MODEL #####**********************/////

    this.account_head.belongsTo(this.account_head, {
        foreignKey: 'parent',
        as: 'Parent_Table'
    })
    this.account_head.belongsTo(this.account_type, {
        foreignKey: 'account_type'
    })

    this.employee.belongsTo(this.designation, {
        foreignKey: 'designation'
    })
    this.employee.belongsTo(this.department, {
        foreignKey: 'department'
    })
    this.employee.belongsTo(this.section, {
        foreignKey: 'section'
    })

    this.monthly_payment.belongsTo(this.employee, {
        foreignKey: 'employee'
    })

    this.navigation.belongsTo(this.navigation, {
        foreignKey: 'parent',
        as: 'Parent_Table'
    })

    this.salary.belongsTo(this.employee, {
        foreignKey: 'employee'
    })
    this.salary.belongsTo(this.salary_type, {
        foreignKey: 'type'
    })

    this.user.belongsTo(this.employee, {
        foreignKey: 'employee'
    })

    this.user_navigation.belongsTo(this.user, {
        foreignKey: 'user'
    })
    this.user_navigation.belongsTo(this.navigation, {
        foreignKey: 'navigation'
    })
    this.user_navigation.belongsTo(this.role, {
        foreignKey: 'role'
    })

    this.voucher.belongsTo(this.user, {
        foreignKey: 'user'
    })

    this.voucher_item.belongsTo(this.voucher, {
        foreignKey: 'voucher'
    })
    this.voucher_item.belongsTo(this.account_head, {
        foreignKey: 'account_head'
    })

    this.student.belongsTo(this.gender, {
        foreignKey: 'gender'
    })
    this.student.belongsTo(this.religion, {
        foreignKey: 'religion'
    })
    this.student.belongsTo(this.blood_group, {
        foreignKey: 'blood_group'
    })

    this.student_class.belongsTo(this.student, {
        foreignKey: 'student'
    })
    this.student_class.belongsTo(this.class, {
        foreignKey: 'class'
    })

    ////////////////%%%%#####  RIPS TABLE RELATIONSHIP ENDS  #####%%%%////////////////////
    if (process.env.PWD.toUpperCase().indexOf("DROPBOX") != -1) {
        sequelize.sync({
            force: false
        }).then(function(d) {
            if (!d) {
                console.log('An error occurred while creating the table:', d)
            } else {
                console.log('It worked!')
            }
        })
    }
}

module.exports.connect = connect;