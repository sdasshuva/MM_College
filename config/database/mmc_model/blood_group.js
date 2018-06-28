Sequelize = require('sequelize');

module.exports = function(sequelize){
    return sequelize.define('Blood_Group_Table', {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        }
    },{
        tableName: 'blood_group',
        underscored: true
    });
};