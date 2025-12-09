import { Model, Schema, model } from 'mongoose';
import { User } from '../../entities/user.model.js';

export const userSchema = new Schema<User>({
  name: {
    type: String,
    required: true,
    unique: false,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
    unique: false,
  },
  surname: {
    type: String,
    required: true,
    unique: false,
  },
  role: {
    type: String,
    required: true,
    enum: ['Admin', 'User'],
    default: 'User',
  },
  probada: [{ type: Schema.Types.ObjectId, ref: 'Beer' }],
  visitado: [{ type: Schema.Types.ObjectId, ref: 'Pub' }],
});

userSchema.set('toJSON', {
  transform(_doc, returnedObject) {
    returnedObject.id = returnedObject._id.toString();
    delete (returnedObject as any)._id;
    delete (returnedObject as any).__v;
    delete (returnedObject as any).password;
  },
});

export const UserModel: Model<User> = model<User>('User', userSchema, 'user');
