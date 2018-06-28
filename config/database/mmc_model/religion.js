Sequelize = require('sequelize');

module.exports = function(sequelize){
    return sequelize.define('Religion_Table', {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        }
    },{
        tableName: 'religion',
        underscored: true
    });
};