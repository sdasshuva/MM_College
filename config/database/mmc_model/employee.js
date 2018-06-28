Sequelize = require('sequelize');

module.exports = function(sequelize){
    return sequelize.define('Employee_Table', {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        email: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: null,
        },
        card_no: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: null,
        },
        designation: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: null,
            references: {
              model: "designation",
              key:   "id"
            }
        },
        department: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: null,
            references: {
              model: "department",
              key:   "id"
            }
        },
        section: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: null,
            references: {
              model: "section",
              key:   "id"
            }
        }
        
    },{
        tableName: 'employee',
        underscored: true,
        hierarchy: true
    });
};