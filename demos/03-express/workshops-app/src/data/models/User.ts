import { DataTypes, Model, Optional } from 'sequelize';
import bcrypt from 'bcrypt';
import { sequelize } from '../init';
import IUser, { Role } from '../../models/IUser';

// Describe attributes required during creation (id is auto-generated, role can default)
type UserCreationAttributes = Optional<IUser, 'id' | 'role'>;

const emailPat = /^[A-Za-z0-9_\.]+@example\.com$/;
const passwordPat = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;

// IMPORTANT: Decides the "strength" of the salt
// Should not be too high (CPU-intensive) or too low (less secure)
const SALT_ROUNDS = 10;

class User extends Model<IUser, UserCreationAttributes> implements IUser {
    declare id: number;
    declare email: string;
    declare name: string;
    declare password: string;
    declare role: Role;

    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;

    // instance method
    async checkPassword(plainTextPassword: string): Promise<boolean> {
        return bcrypt.compare(plainTextPassword, this.password);
    }

    // Hide password when converting to JSON
    toJSON() {
        const values = { ...this.get() } as Partial<IUser>;
        delete values.password;
        return values;
    }
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isValidEmail(value: string) {
                    if (!emailPat.test(value)) {
                        throw new Error(
                            'Invalid email. Please make sure the email is an example.com email.'
                        );
                    }
                },
            },
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isValidPassword(value: string) {
                    if (!passwordPat.test(value)) {
                        throw new Error(
                            'Password must have at least 1 digit, 1 special character, and should be 8-16 characters in length.'
                        );
                    }
                },
            },
        },

        role: {
            type: DataTypes.ENUM('admin', 'general'),
            allowNull: false,
            defaultValue: 'general',
        },
    },
    {
        sequelize,
        tableName: 'users',
        modelName: 'User',

        defaultScope: {
            attributes: { exclude: ['password'] },
        },

        /**
         * Model hooks
         */
        hooks: {
            /**
             * Hash password before creating a user
             */
            beforeCreate: async (user: User) => {
                user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
            },

            /**
             * Hash password before updating if it was modified
             */
            beforeUpdate: async (user: User) => {
                if (user.changed('password')) {
                    user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
                }
            },
        },
    }
);

export default User;
