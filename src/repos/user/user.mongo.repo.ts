import createDebug from 'debug';
import { UserRepository } from './user.repo.js';
import { User, UserLogin } from '../../entities/user.model.js';
import { Beer } from '../../entities/beer.model.js';
import { Pub } from '../../entities/pub.model.js';
import { UserModel } from './user.mongo.model.js';
import { HttpError } from '../../types/http.error.js';
import { Auth } from '../../services/auth.js';

const debug = createDebug('W9Final:Users:mongo:repo');

export class UserMongoRepo implements UserRepository<User, Beer, Pub> {
  constructor() {
    debug('Instantiated');
  }

  async login(loginUser: UserLogin): Promise<User> {
    const result = await UserModel.findOne({ email: loginUser.email })
      .populate('probada')
      .populate('visitado')
      .exec();
    if (!result || !(await Auth.compare(loginUser.password, result.password)))
      throw new HttpError(
        401,
        'No se puede hacer login con Token',
        'Unauthorized'
      );
    return result;
  }

  async create(newItem: Omit<User, 'id'>): Promise<User> {
    newItem.password = await Auth.hash(newItem.password);
    const result: User = await UserModel.create(newItem);
    return result;
  }

  async getAll(): Promise<User[]> {
    const result = await UserModel.find()
      .populate('probada', '-beer')
      .populate('visitado', '-pub')
      .exec();
    if (!result)
      throw new HttpError(404, 'Not Found', 'getAll method not possible');
    return result;
  }

  async getById(id: string): Promise<User> {
    const data = await UserModel.findById(id)
      .populate('probada', '-beer')
      .populate('visitado', '-pub')
      .exec();
    if (!data) {
      throw new HttpError(404, 'Not Found', 'User not found in file system', {
        cause: 'Trying findById',
      });
    }

    return data;
  }

  async search({
    key,
    value,
  }: {
    key: keyof User;
    value: any;
  }): Promise<User[]> {
    const result = await UserModel.find({ [key]: value })
      .populate(
        'probada ',
        {
          beer: 0,
        },
        'visitado',
        {
          pub: 0,
        }
      )
      .exec();

    return result;
  }

  async update(id: string, newData: Partial<User>): Promise<User> {
    const data = await UserModel.findByIdAndUpdate(id, newData, {
      new: true,
    })
      .populate('probada')
      .populate('visitado')
      .exec();
    if (!data)
      throw new HttpError(404, 'Not Found', 'User not found in file system', {
        cause: 'Trying findByIdAndUpdate',
      });
    return data;
  }

  async delete(id: string): Promise<void> {
    const result = await UserModel.findByIdAndDelete(id)
      .populate('probada')
      .populate('visitado')
      .exec();
    if (!result) {
      throw new HttpError(404, 'Not Found', 'Delete not possible');
    }
  }

  async addBeer(beer: Beer, userId: string): Promise<User> {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $push: { probada: beer } },
      { new: true }
    ).exec();
    if (!updatedUser) {
      throw new HttpError(404, 'Not Found in mongo repo', 'User not found');
    }

    return updatedUser;
  }

  async addPub(pub: Pub, userId: string): Promise<User> {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $push: { visitado: pub } },
      { new: true }
    ).exec();

    if (!updatedUser) {
      throw new HttpError(
        404,
        'Not Found in mongo repo',
        'Update not possible'
      );
    }

    return updatedUser;
  }

  async removeBeer(beer: Beer, userId: string): Promise<User> {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $pull: { probada: beer.id } },
      { new: true }
    ).exec();

    if (!updatedUser) {
      throw new HttpError(404, 'Not Found', 'Update not possible');
    }

    return updatedUser;
  }

  async removePub(pub: Pub, userId: string): Promise<User> {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $pull: { visitado: pub.id } },
      { new: true }
    ).exec();

    if (!updatedUser) {
      throw new HttpError(404, 'Not Found', 'Update not possible');
    }

    return updatedUser;
  }
}
