import User from '../data/models/User';
import IUser from '../models/IUser';

const addUser = async (user: Omit<IUser, 'id'>) => {
    const insertedUser = await User.create(user);
    return insertedUser; // password is removed automatically by User.toJSON()
};

export { addUser };
