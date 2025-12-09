import { Schema, model } from 'mongoose';
import { Beer } from '../../entities/beer.model.js';

export const beerSchema = new Schema<Beer>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  brewer: {
    type: String,
    required: true,
    unique: false,
  },
  style: {
    type: String,
    required: true,
    unique: false,
  },
  alcohol: {
    type: String,
    required: true,
    unique: false,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  pubs: [{ type: Schema.Types.ObjectId, ref: 'Pub' }],

  beerImg: {
    publicId: String,
    size: Number,
    format: String,
    url: String,
  },
});

export const BeerModel = model('Beer', beerSchema, 'beers');

beerSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(_doc, returnedObject) {
    returnedObject.id = returnedObject._id.toString();
    delete (returnedObject as any)._id;
    delete (returnedObject as any).__v;
  },
});
