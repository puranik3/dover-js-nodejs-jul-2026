import 'sequelize';

declare module 'sequelize' {
    interface ValidationError {
        status?: number;
        type?: string;
    }

    interface UniqueConstraintError {
        status?: number;
        type?: string;
    }

    interface DatabaseError {
        status?: number;
        type?: string;
    }

    interface ForeignKeyConstraintError {
        status?: number;
        type?: string;
    }
}
