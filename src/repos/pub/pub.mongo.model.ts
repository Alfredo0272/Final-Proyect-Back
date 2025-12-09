import { Schema, model } from 'mongoose';
import { Pub } from '../../entities/pub.model.js';

export const pubSchema = new Schema<Pub>({
  logo: {
    publicId: String,
    size: Number,
    format: String,
    url: String,
  },
  direction: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  owner: {
    type: String,
    required: true,
    unique: true,
  },
  taps: {
    type: Number,
    required: true,
    unique: true,
  },
  beers: [{ type: Schema.Types.ObjectId, ref: 'Beer' }],
});

export const PubModel = model('Pub', pubSchema, 'pub');

pubSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(_doc, returnedObject) {
    returnedObject.id = returnedObject._id.toString();
    delete (returnedObject as any)._id;
    delete (returnedObject as any).__v;
  },
});
