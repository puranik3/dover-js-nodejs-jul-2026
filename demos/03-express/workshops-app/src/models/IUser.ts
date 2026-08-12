type Role = 'admin' | 'general';

interface IUser {
    id: number;
    email: string;
    name: string;
    password: string;
    role: Role;
}

export { IUser as default, Role };
