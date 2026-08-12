import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../init';
import ISession, { Level } from '../../models/ISession';

// Describe attributes required during creation (id is auto-generated)
type SessionCreationAttributes = Optional<ISession, 'id' | 'upvoteCount'>;

class Session extends Model<ISession, SessionCreationAttributes> implements ISession {
    declare id: number;
    declare workshopId: number;
    declare sequenceId: number;
    declare name: string;
    declare speaker: string;
    declare duration: number;
    declare level: Level;
    declare abstract: string;
    declare upvoteCount: number;

    // timestamps
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

Session.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        workshopId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            // foreign key constraint will be added via migration
        },

        sequenceId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        speaker: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        duration: {
            type: DataTypes.FLOAT,
            allowNull: false, // assuming duration is in hours
            validate: {
                min: 0.25, // optional: 15 minutes as minimum
            },
        },

        level: {
            type: DataTypes.ENUM('Basic', 'Intermediate', 'Advanced'),
            allowNull: false,
        },

        abstract: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        upvoteCount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        tableName: 'sessions',
        modelName: 'Session',
    }
);

export default Session;
