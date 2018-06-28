Sequelize = require('sequelize');

module.exports = function(sequelize){
    return sequelize.define('Designation_Table', {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        }
    },{
        tableName: 'designation',
        underscored: true
    });
};