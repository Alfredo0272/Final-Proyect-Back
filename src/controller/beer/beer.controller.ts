import { NextFunction, Request, Response } from 'express';
import createDebug from 'debug';
import { Controller } from '../controller.js';
import { Beer } from '../../entities/beer.model.js';
import { UserMongoRepo } from '../../repos/user/user.mongo.repo.js';
import { BeerMongoRepo } from '../../repos/beer/beer.mongo.repo.js';
import { HttpError } from '../../types/http.error.js';

const debug = createDebug('W9Final:beers:controller');

export class BeerController extends Controller<Beer> {
  userRepo: UserMongoRepo;

  constructor(protected repo: BeerMongoRepo) {
    super(repo);
    this.userRepo = new UserMongoRepo();
    debug('Instantiated');
  }

  async createBeer(req: Request, res: Response, next: NextFunction) {
    try {
      const userID = req.params.id;

      const author = await this.userRepo.getById(userID);
      if (!author) {
        throw new HttpError(404, 'Not Found', 'User not found');
      }

      // Después validar archivo
      if (!req.file) {
        throw new HttpError(406, 'Not Acceptable', 'Invalid multer file');
      }

      req.body.author = author;

      const imgData = await this.cloudinaryService.uploadImage(req.file.path);
      req.body.beerImg = imgData;

      const result = await this.repo.create(req.body);

      res.status(201);
      res.statusMessage = 'Created';
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
