import { Types } from 'mongoose';
import { Beer } from './beer.model';
import { Pub } from './pub.model';

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
  probada: (Types.ObjectId | Beer)[];
  visitado: (Types.ObjectId | Pub)[];
};
