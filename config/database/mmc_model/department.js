Sequelize = require('sequelize');

module.exports = function(sequelize){
    return sequelize.define('Department_Table', {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        }
    },{
        tableName: 'department',
        underscored: true
    });
};