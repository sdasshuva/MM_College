Sequelize = require('sequelize');

module.exports = function(sequelize) {
    return sequelize.define('Student_Class_Table', {
        student: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: null,
            unique: 'uniqueStudentClass',
            references: {
              model: "student",
              key:   "id"
            }
        },
        class: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: null,
            unique: 'uniqueStudentClass',
            references: {
              model: "class",
              key:   "id"
            }
        },
        year: {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: 'uniqueStudentClass'
        },
        start_date: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: null
        },
        end_date: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: null
        },
    }, {
        tableName: 'student_class',
        underscored: true
    });
};