Sequelize = require('sequelize');

module.exports = function(sequelize){
    return sequelize.define('Account_Type_Table', {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        }
    },{
        tableName: 'account_type',
        underscored: true
    });
};