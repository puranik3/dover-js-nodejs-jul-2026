import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

let connectionStr;

if (process.env.DB_CONNECTION_STRING) {
    connectionStr = process.env.DB_CONNECTION_STRING;
} else {
    console.log('DB connection string not found in environment');
    process.exit(1);
}

// Create a Sequelize instance to manage the PostgreSQL connection
export const sequelize = new Sequelize(connectionStr, {
    logging: false, // disable SQL logging (optional)
});

// register models
import './models/Workshop';

const connect = async () => {
    try {
        await sequelize.authenticate();
        console.log('connected to the db');

        // Optional: sync models later when they are defined
        // await sequelize.sync();
    } catch (error: any) {
        console.log('unable to connect to the db : ' + error.message);
        process.exit(1);
    }
};

connect();
