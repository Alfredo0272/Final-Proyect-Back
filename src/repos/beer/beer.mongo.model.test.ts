import mongoose from 'mongoose';
import { BeerModel } from './beer.mongo.model.js';

describe('Given BeerModel', () => {
  test('should transform _id into id and remove _id and __v', () => {
    const document = new BeerModel({
      name: 'IPA',
      brewer: 'Craft Brewery',
      style: 'India Pale Ale',
      alcohol: '7%',
      author: new mongoose.Types.ObjectId(),
      pubs: [],
      beerImg: {
        publicId: 'public123',
        size: 1234,
        format: 'jpg',
        url: 'http://example.com/image.jpg',
      },
    });

    const json = document.toJSON();

    expect(json.id).toBeDefined();
    expect(json._id).toBeUndefined();
    expect(json.__v).toBeUndefined();

    expect(json.name).toBe('IPA');
    expect(json.brewer).toBe('Craft Brewery');
  });
});
