Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Monthly_Payment_Table', {
        employee: {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: 'uniqueMonthlyPayment',
            references: {
              model: "employee",
              key:   "id"
            }
        },
        month: {
            type: Sequelize.INTEGER,
            unique: 'uniqueMonthlyPayment',
            allowNull: false
        },
        year: {
            type: Sequelize.INTEGER,
            unique: 'uniqueMonthlyPayment',
            allowNull: false
        },
        present: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        absent: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        holiday: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        weekend: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        leave: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        salary: {
            type: Sequelize.DOUBLE,
            allowNull: false,
            defaultValue: 0,
        },
        allowance: {
            type: Sequelize.DOUBLE,
            allowNull: false,
            defaultValue: 0,
        },
        area: {
            type: Sequelize.DOUBLE,
            allowNull: false,
            defaultValue: 0,
        }
    }, {
        tableName: 'monthly_payment',
        underscored: true
    });
};