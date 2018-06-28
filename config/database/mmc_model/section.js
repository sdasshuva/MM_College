Sequelize = require('sequelize');

module.exports = function(sequelize){
    return sequelize.define('Section_Table', {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        }
    },{
        tableName: 'section',
        underscored: true
    });
};