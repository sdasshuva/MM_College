Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Account_Head_Table', {
        account_type: {
            type: Sequelize.INTEGER,
            references: {
              model: "account_type",
              key:   "id"
            },
            allowNull: false,
            unique: 'uniqueAccountsHead'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: 'uniqueAccountsHead'
        },
        description: {
            type: Sequelize.STRING,
            allowNull: true
        },
        parent: {
            type: Sequelize.INTEGER,
            references: {
              model: "account_head",
              key:   "id"
            },
        },
    }, {
        tableName: 'account_head',
        underscored: true
    });
};