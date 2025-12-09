import { PubModel } from './pub.mongo.model.js';
import { Types } from 'mongoose';

describe('Given PubModel', () => {
  test('should transform returned object correctly in toJSON method', () => {
    const document = new PubModel({
      logo: { publicId: 'img', size: 100, format: 'png', url: 'test.com' },
      direction: 'Calle Mayor',
      name: 'Pub Test',
      owner: 'John Doe',
      taps: 4,
      beers: [new Types.ObjectId()],
    });

    const returnedObject = document.toJSON();

    expect(returnedObject._id).toBeUndefined();
    expect(returnedObject.__v).toBeUndefined();
    expect(returnedObject.id).toBeDefined();
    expect(typeof returnedObject.id).toBe('string');
    expect(returnedObject.name).toBe('Pub Test');
    expect(Array.isArray(returnedObject.beers)).toBe(true);
  });
});
