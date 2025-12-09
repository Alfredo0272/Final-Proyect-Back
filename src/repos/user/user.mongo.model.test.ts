import { UserModel } from './user.mongo.model.js';

describe('Given UserModel', () => {
  test('should transform returned object correctly in toJSON method', () => {
    const document = new UserModel({
      name: 'John Doe',
      password: 'password123',
      userName: 'johndoe',
      email: 'john.doe@example.com',
      age: 25,
      surname: 'Doe',
      role: 'User',
    });

    const returnedObject = document.toJSON();

    // 🔍 Comprobaciones correctas
    expect(returnedObject._id).toBeUndefined();
    expect(returnedObject.__v).toBeUndefined();
    expect(returnedObject.password).toBeUndefined();
    expect(returnedObject.id).toBeDefined();
    expect(typeof returnedObject.id).toBe('string');
    expect(returnedObject.name).toBe('John Doe');
  });
});
