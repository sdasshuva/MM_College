Sequelize = require('sequelize');

module.exports = function(sequelize){
    return sequelize.define('Class_Table', {
        code: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: 'uniqueClass'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: 'uniqueClass'
        }
    },{
        tableName: 'class',
        underscored: true
    });
};