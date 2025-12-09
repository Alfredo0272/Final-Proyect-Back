import { Pub } from '../../entities/pub.model';
import { BeerMongoRepo } from '../../repos/beer/beer.mongo.repo';
import { PubMongoRepo } from '../../repos/pub/pub.mongo.repo';
import { HttpError } from '../../types/http.error';
import { PubController } from './pub.controller';
import { Request, Response, NextFunction } from 'express';

describe('Given PubController class', () => {
  let controller: PubController;
  let mockRequest: Request;
  let mockResponse: Response;
  let mockNext: NextFunction;
  let mockRepo: jest.Mocked<PubMongoRepo>;

  const validPubId = '507f191e810c19729de860ea';
  const validBeerId = '507f191e810c19729de860eb';

  beforeAll(() => {
    mockRequest = {
      params: { id: validBeerId },
      file: { path: 'validPath' },
      body: { id: validPubId } as unknown as Pub,
    } as unknown as Request;

    mockResponse = {
      json: jest.fn(),
      status: jest.fn(),
      statusMessage: '',
    } as unknown as Response;

    mockNext = jest.fn();
  });

  const mockImgData = { url: 'validImageUrl' };
  const mockResult = {
    id: validPubId,
    name: 'Pub Name',
    logo: mockImgData,
  };

  const mockBeer = { id: validBeerId, pubs: [] };
  const mockPub = { id: validPubId, beers: [], taps: 2 };
  const mockUpdatedPub = { id: validPubId, beers: [mockBeer] };

  beforeEach(() => {
    mockRepo = {
      getAll: jest.fn().mockResolvedValue([{}]),
      getById: jest.fn().mockResolvedValue(mockPub),
      create: jest.fn().mockResolvedValue({}),
      createPub: jest.fn().mockResolvedValue(mockResult),
      addBeerToTap: jest.fn().mockResolvedValue(mockUpdatedPub),
      removeBeerFromTap: jest.fn().mockResolvedValue(mockPub),
    } as unknown as jest.Mocked<PubMongoRepo>;

    controller = new PubController(mockRepo);
    controller.cloudinaryService = {
      uploadImage: jest.fn().mockResolvedValue(mockImgData),
    };
  });

  describe('When we instantiate it without errors', () => {
    test('should create a new pub when given valid input data and a valid image file', async () => {
      await controller.createPub(mockRequest, mockResponse, mockNext);

      expect(mockRepo.create).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.statusMessage).toBe('Created');
      expect(mockResponse.json).toHaveBeenCalledWith({});
    });

    test('should successfully add a beer to a pub with available taps', async () => {
      const mockBeerRepo = {
        getById: jest.fn().mockResolvedValue(mockBeer),
        update: jest.fn().mockResolvedValue(mockBeer),
      } as unknown as jest.Mocked<BeerMongoRepo>;

      controller.beerRepo = mockBeerRepo;

      await controller.addPubBeer(mockRequest, mockResponse, mockNext);

      expect(mockRepo.getById).toHaveBeenCalledWith(validPubId);
      expect(mockBeerRepo.getById).toHaveBeenCalledWith(validBeerId);

      expect(mockRepo.addBeerToTap).toHaveBeenCalledWith(mockBeer, validPubId);

      expect(mockBeerRepo.update).toHaveBeenCalledWith(
        validBeerId,
        expect.objectContaining({
          id: validBeerId,
          pubs: expect.any(Array),
        })
      );

      expect(mockResponse.json).toHaveBeenCalledWith(mockUpdatedPub);
    });

    test('should successfully remove a beer from a pub', async () => {
      const mockBeerRepo = {
        getById: jest.fn().mockResolvedValue(mockBeer),
        update: jest.fn().mockResolvedValue(mockBeer),
      } as unknown as jest.Mocked<BeerMongoRepo>;

      const mockRepo2 = {
        getById: jest.fn().mockResolvedValue(mockUpdatedPub),
        removeBeerFromTap: jest.fn().mockResolvedValue(mockPub),
      } as unknown as jest.Mocked<PubMongoRepo>;

      const controller2 = new PubController(mockRepo2);
      controller2.beerRepo = mockBeerRepo;

      await controller2.removePubBeer(mockRequest, mockResponse, mockNext);

      expect(mockRepo2.getById).toHaveBeenCalledWith(validPubId);
      expect(mockBeerRepo.getById).toHaveBeenCalledWith(validBeerId);
      expect(mockRepo2.removeBeerFromTap).toHaveBeenCalledWith(
        mockBeer,
        validPubId
      );

      expect(mockBeerRepo.update).toHaveBeenCalled();
    });
  });

  describe('When we instantiate it with errors', () => {
    test('should throw HttpError when pub not found', async () => {
      const repoError = {
        getById: jest.fn().mockResolvedValue(null),
      } as unknown as PubMongoRepo;

      const mockBeerRepo = {
        getById: jest.fn().mockResolvedValue(mockBeer),
      } as unknown as BeerMongoRepo;

      const controllerFail = new PubController(repoError);
      controllerFail.beerRepo = mockBeerRepo;

      await controllerFail.addPubBeer(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        new HttpError(404, 'Not Found', 'Pub not found')
      );
    });

    test('should throw 404 if update is not possible', async () => {
      const repoError = {
        getById: jest.fn().mockResolvedValue(mockPub),
        addBeerToTap: jest.fn().mockResolvedValue(null),
      } as unknown as PubMongoRepo;

      const mockBeerRepo = {
        getById: jest.fn().mockResolvedValue(mockBeer),
        update: jest.fn(),
      } as unknown as BeerMongoRepo;

      const controllerFail = new PubController(repoError);
      controllerFail.beerRepo = mockBeerRepo;

      await controllerFail.addPubBeer(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        new HttpError(404, 'Not Found', 'Update not possible')
      );
    });
  });
});
