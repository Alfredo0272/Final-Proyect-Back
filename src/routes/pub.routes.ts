import { Router as createRouter } from 'express';
import createDebug from 'debug';
import { PubMongoRepo } from '../repos/pub/pub.mongo.repo.js';
import { PubController } from '../controller/pub/pub.controller.js';
import { FileInterceptor } from '../middleware/file.interceptor.js';
import { AuthInterceptor } from '../middleware/auth.interceptor.js';

const debug = createDebug('W9Final:Pub:router');
export const pubRouter = createRouter();

debug('Starting');
const repo = new PubMongoRepo();
const controller = new PubController(repo);
const interceptor = new AuthInterceptor();
const fileInterceptor = new FileInterceptor();

pubRouter.post(
  '/create',
  interceptor.authorization.bind(interceptor),
  interceptor.isAdmin.bind(interceptor),
  fileInterceptor.singleFileStore('logo').bind(fileInterceptor),
  controller.createPub.bind(controller)
);

pubRouter.get(
  '/',
  fileInterceptor.singleFileStore('logo').bind(fileInterceptor),
  controller.getAll.bind(controller)
);

pubRouter.get(
  '/:id',
  fileInterceptor.singleFileStore('logo').bind(fileInterceptor),
  fileInterceptor.singleFileStore('beerImg').bind(fileInterceptor),
  controller.getById.bind(controller)
);

pubRouter.patch(
  '/addBeer/:id',
  interceptor.authorization.bind(interceptor),
  interceptor.isAdmin.bind(interceptor),
  controller.addPubBeer.bind(controller)
);

pubRouter.patch(
  '/delBeer/:id',
  interceptor.authorization.bind(interceptor),
  interceptor.isAdmin.bind(interceptor),
  controller.removePubBeer.bind(controller)
);
