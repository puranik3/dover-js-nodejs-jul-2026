'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('users', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },

            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },

            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            password: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            role: {
                type: Sequelize.ENUM('admin', 'general'),
                allowNull: false,
                defaultValue: 'general',
            },

            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },

            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        // Drop table first
        await queryInterface.dropTable('users');

        // ENUM types must be dropped manually in PostgreSQL
        await queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS "enum_users_role";'
        );
    },
};