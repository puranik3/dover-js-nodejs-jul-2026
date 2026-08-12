'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('sessions', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },

            workshopId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'workshops',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },

            sequenceId: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },

            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            speaker: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            duration: {
                type: Sequelize.FLOAT,
                allowNull: false,
            },

            level: {
                type: Sequelize.ENUM('Basic', 'Intermediate', 'Advanced'),
                allowNull: false,
            },

            abstract: {
                type: Sequelize.TEXT,
                allowNull: false,
            },

            upvoteCount: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
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

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('sessions');

        // Postgres keeps ENUM types around unless we drop them explicitly
        await queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS "enum_sessions_level";'
        );
    },
};