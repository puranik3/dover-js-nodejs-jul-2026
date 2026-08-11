'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('workshops', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },

            name: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },

            category: {
                type: Sequelize.ENUM(
                    'frontend',
                    'backend',
                    'database',
                    'devops',
                    'language',
                    'mobile'
                ),
                allowNull: false,
            },

            description: {
                type: Sequelize.TEXT,
                allowNull: false,
            },

            startDate: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('NOW'),
            },

            endDate: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('NOW'),
            },

            startTime: {
                type: Sequelize.JSONB,
                allowNull: false,
            },

            endTime: {
                type: Sequelize.JSONB,
                allowNull: false,
            },

            location: {
                type: Sequelize.JSONB,
                allowNull: false,
            },

            modes: {
                type: Sequelize.JSONB,
                allowNull: false,
            },

            imageUrl: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            speakers: {
                type: Sequelize.ARRAY(Sequelize.STRING),
                allowNull: false,
            },

            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('NOW'),
            },

            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('NOW'),
            },
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('workshops');

        // IMPORTANT: ENUM types must be removed explicitly in PostgreSQL
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_workshops_category";');
    },
};
