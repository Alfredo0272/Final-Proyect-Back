import { NextFunction, Request, Response } from 'express';
import createDebug from 'debug';
import { PubMongoRepo } from '../../repos/pub/pub.mongo.repo.js';
import { BeerMongoRepo } from '../../repos/beer/beer.mongo.repo.js';
import { Controller } from '../controller.js';
import { User } from '../../entities/user.model.js';
import { UserMongoRepo } from '../../repos/user/user.mongo.repo.js';
import { LoginResponse } from '../../types/login.response.js';
import { Auth } from '../../services/auth.js';
import { HttpError } from '../../types/http.error.js';

const debug = createDebug('W9Final:users:controller');

export class UsersController extends Controller<User> {
  beerRepo: BeerMongoRepo;
  pubRepo: PubMongoRepo;
  constructor(protected repo: UserMongoRepo) {
    super(repo);

    this.beerRepo = new BeerMongoRepo();
    this.pubRepo = new PubMongoRepo();
    debug('Instantiated');
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = req.body.userId
        ? await this.repo.getById(req.body.userId)
        : await this.repo.login(req.body);

      const data: LoginResponse = {
        user: result,
        token: Auth.signJWT({
          id: result.id,
          email: result.email,
          role: result.role,
        }),
      };
      res.status(202);
      res.statusMessage = 'Accepted';
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async addBeer(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.repo.getById(req.body.userId);
      const beer = await this.beerRepo.getById(req.params.id);
      console.log('controller', beer);
      if (!user) {
        throw new HttpError(404, 'Not Found', 'User not found');
      }

      if (!beer) {
        throw new HttpError(404, 'Not Found', 'Beer not found');
      }

      if (
        user.probada.find(
          (tastedBeer) => tastedBeer.id?.toString() === beer.id.toString()
        )
      ) {
        throw new HttpError(
          409,
          'Conflict',
          'Beer already in your tasted beers'
        );
      }

      const updatedUser = await this.repo.addBeer(beer, user.id);

      if (!updatedUser) {
        throw new HttpError(404, 'Not Found', 'Update not possible');
      }

      console.log('controller', updatedUser);

      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  async addPub(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.repo.getById(req.body.userId);
      const pub = await this.pubRepo.getById(req.params.id);
      if (!user) {
        throw new HttpError(404, 'Not Found', 'User not found');
      }

      if (!pub) {
        throw new HttpError(404, 'Not Found', 'Pub not found');
      }

      if (
        user.visitado.find(
          (visitedPub) => visitedPub.id?.toString() === pub.id.toString()
        )
      ) {
        throw new HttpError(
          409,
          'Conflict',
          'Pub already in your visited pubs'
        );
      }

      const updatedUser = await this.repo.addPub(pub, user.id);

      if (!updatedUser) {
        throw new HttpError(404, 'Not Found', 'Update not possible');
      }

      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  async removeBeer(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.repo.getById(req.body.userId);
      const beer = await this.beerRepo.getById(req.params.id);

      if (!user) {
        throw new HttpError(404, 'Not Found', 'User not found');
      }

      if (!beer) {
        throw new HttpError(404, 'Not Found', 'Beer not found');
      }

      if (
        !user.probada.find(
          (tastedBeer) => tastedBeer.id?.toString() === beer.id.toString()
        )
      ) {
        throw new HttpError(
          409,
          'Conflict',
          'Update not possible, Beer already erased'
        );
      }

      const result = await this.repo.removeBeer(await beer, user.id);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async removePub(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.repo.getById(req.body.userId);
      const pub = await this.pubRepo.getById(req.params.id);

      if (!user) {
        throw new HttpError(404, 'Not Found', 'User not found');
      }

      if (!pub) {
        throw new HttpError(404, 'Not Found', 'Pub not found');
      }

      if (
        !user.visitado.find(
          (visitedPub) => visitedPub.id?.toString() === pub.id.toString()
        )
      ) {
        throw new HttpError(
          404,
          'Pub Found',
          'Update not possible, Pub already erased'
        );
      }

      const result = await this.repo.removePub(pub, user.id);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
