Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Salary_Table', {
        employee: {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: 'uniqueSalary',
            references: {
              model: "employee",
              key:   "id"
            }
        },
        date: {
            type: Sequelize.DATE,
            unique: 'uniqueSalary',
            allowNull: false
        },
        type: {
            type: Sequelize.STRING,
            unique: 'uniqueSalary',
            allowNull: false
        },
        amount: {
            type: Sequelize.DOUBLE,
            allowNull: false,
            defaultValue: 0,
        }
    }, {
        tableName: 'salary',
        underscored: true,
        // hierarchy: true
    });
};