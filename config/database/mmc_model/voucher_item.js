Sequelize = require('sequelize');

module.exports = function(sequelize){
    return sequelize.define('Voucher_Item_Table', {
        voucher: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: "voucher",
              key:   "id"
            }
        },
        account_head: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: "account_head",
              key:   "id"
            }
        },
        narration: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: null
        },
        quantity: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        amount: {
            type: Sequelize.DOUBLE,
            allowNull: false,
            defaultValue: 0
        }
    },{
        tableName: 'voucher_item',
        underscored: true
    });
};