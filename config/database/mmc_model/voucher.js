Sequelize = require('sequelize');

module.exports = function(sequelize){
    return sequelize.define('Voucher_Table', {
        voucher_no: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: null,
        },
        date: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: null,
        },
        user: {
            type: Sequelize.INTEGER,
            references: {
              model: "user",
              key:   "id"
            }
        }
    },{
        tableName: 'voucher',
        underscored: true
    });
};