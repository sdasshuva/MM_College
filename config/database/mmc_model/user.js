Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('User_Table', {
        username: {
            type: Sequelize.STRING,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        employee: {
            type: Sequelize.INTEGER,
            references: {
                model: "employee",
                key: "id"
            }
        },
        is_online: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: 0,
        },
        last_login: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: null
        },
        last_logout: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: null
        }
    }, {
        tableName: 'user',
        underscored: true
    });
};