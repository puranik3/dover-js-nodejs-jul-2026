import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../init';
import IWorkshop, { ITime, ILocation, IModes } from '../../models/IWorkshop';
// import Session from './Session';

// Describe the attributes for creation (id is auto-generated)
type WorkshopCreationAttributes = Optional<IWorkshop, 'id'>;

class Workshop extends Model<IWorkshop, WorkshopCreationAttributes> implements IWorkshop {
    public id!: number;
    public name!: string;
    public category!: IWorkshop['category'];
    public description!: string;
    public startDate!: Date;
    public endDate!: Date;
    public startTime!: ITime;
    public endTime!: ITime;
    public location!: ILocation;
    public modes!: IModes;
    public imageUrl!: string;
    public speakers!: string[];

    // timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

/**
 * In PostgreSQL with Sequelize, we still store related information together
 * inside a single table row when it makes sense.
 * For example, we store nested objects like time, location, and modes as JSONB columns,
 * and speakers as a text array, while keeping the main Workshop in the "workshops" table.
 */

// --- Helper validators (kept in this file to avoid repetition) ---
const validateTime = (fieldName: 'startTime' | 'endTime', value: unknown) => {
    if (typeof value !== 'object' || value === null) {
        throw new Error(`${fieldName} must be an object`);
    }

    const v = value as Partial<ITime>;

    if (!Number.isInteger(v.hours) || (v.hours as number) < 0 || (v.hours as number) > 23) {
        throw new Error(`${fieldName}.hours must be an integer between 0 and 23`);
    }

    if (!Number.isInteger(v.minutes) || (v.minutes as number) < 0 || (v.minutes as number) > 59) {
        throw new Error(`${fieldName}.minutes must be an integer between 0 and 59`);
    }
};

const validateLocation = (value: unknown) => {
    if (typeof value !== 'object' || value === null) {
        throw new Error('location must be an object');
    }

    const v = value as Partial<ILocation>;

    if (typeof v.address !== 'string' || v.address.trim().length === 0) {
        throw new Error('location.address must be a non-empty string');
    }

    if (typeof v.city !== 'string' || v.city.trim().length === 0) {
        throw new Error('location.city must be a non-empty string');
    }

    if (typeof v.state !== 'string' || v.state.trim().length === 0) {
        throw new Error('location.state must be a non-empty string');
    }
};

const validateModes = (value: unknown) => {
    if (typeof value !== 'object' || value === null) {
        throw new Error('modes must be an object');
    }

    const v = value as Partial<IModes>;

    if (typeof v.inPerson !== 'boolean') {
        throw new Error('modes.inPerson must be a boolean');
    }

    if (typeof v.online !== 'boolean') {
        throw new Error('modes.online must be a boolean');
    }
};

Workshop.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isString(value: unknown) {
                    if (typeof value !== 'string') {
                        throw new Error('Value must be a string');
                    }
                },
            },
        },
        category: {
            type: DataTypes.ENUM('frontend', 'backend', 'database', 'devops', 'language', 'mobile'),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },

        startTime: {
            type: DataTypes.JSONB, // stores ITime as JSON
            allowNull: false,
            validate: {
                isValidTime(value: unknown) {
                    validateTime('startTime', value);
                },
            },
        },

        endTime: {
            type: DataTypes.JSONB, // stores ITime as JSON
            allowNull: false,
            validate: {
                isValidTime(value: unknown) {
                    validateTime('endTime', value);
                },
            },
        },

        location: {
            type: DataTypes.JSONB, // stores ILocation as JSON
            allowNull: false,
            validate: {
                isValidLocation(value: unknown) {
                    validateLocation(value);
                },
            },
        },

        modes: {
            type: DataTypes.JSONB, // stores IModes as JSON
            allowNull: false,
            validate: {
                isValidModes(value: unknown) {
                    validateModes(value);
                },
            },
        },

        imageUrl: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        speakers: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'workshops',
        modelName: 'Workshop',
    }
);

export default Workshop;
