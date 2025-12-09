import { Types } from 'mongoose';

export type UserLogin = {
  email: string;
  password: string;
};

export type User = UserLogin & {
  id: string;
  name: string;
  userName: string;
  age: number;
  surname: string;
  role: 'Admin' | 'User';
  probada: Types.ObjectId[];
  visitado: Types.ObjectId[];
};
