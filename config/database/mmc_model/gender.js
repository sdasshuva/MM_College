Sequelize = require('sequelize');

module.exports = function(sequelize){
    return sequelize.define('Gender_Table', {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        }
    },{
        tableName: 'gender',
        underscored: true
    });
};