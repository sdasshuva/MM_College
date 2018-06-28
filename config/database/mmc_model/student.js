Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Student_Table', {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        card_no: {
            type: Sequelize.STRING,
            allowNull: false
        },
        date_of_birth: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: null
        },
        gender: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: null,
            references: {
              model: "gender",
              key:   "id"
            }
        },
        religion: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: null,
            references: {
              model: "religion",
              key:   "id"
            }
        },
        blood_group: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: null,
            references: {
              model: "blood_group",
              key:   "id"
            }
        },
        contact_no: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: null
        },
        phone_no: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: null
        }
    }, {
        tableName: 'student',
        underscored: true
    });
};