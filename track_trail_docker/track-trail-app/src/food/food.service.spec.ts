import { Test, TestingModule } from '@nestjs/testing';
import { FoodService } from './food.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Food } from './food.entity';
import { HttpException } from '@nestjs/common';
import { UtilsService } from '../utils/utils.service';

describe('FoodService', () => {
  let service: FoodService;
  let foodRepository;

  const mockFood = { 
    id: 1, 
    name: 'Comida 1', 
    calories: 100,
    protein: 10,
    carbohydrates: 20,
    fat: 5
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FoodService,
        UtilsService,
        {
          provide: getRepositoryToken(Food),
          useValue: {
            find: jest.fn().mockResolvedValue([mockFood]),
            findOne: jest.fn().mockResolvedValue(mockFood),
            create: jest.fn().mockReturnValue(mockFood),
            save: jest.fn().mockResolvedValue(mockFood),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
            merge: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FoodService>(FoodService);
    foodRepository = module.get(getRepositoryToken(Food));
  });

  it('debería obtener todos los alimentos', async () => {
    const result = await service.getAllFoods();
    expect(result).toEqual([mockFood]);
  });

  it('debería obtener un alimento por ID', async () => {
    const result = await service.getFood(1);
    expect(result).toEqual(mockFood);
  });

  it('debería lanzar una excepción si no se encuentra el alimento', async () => {
    foodRepository.findOne.mockResolvedValue(null);
    await expect(service.getFood(999)).rejects.toThrow(HttpException);
  });

  it('debería crear un nuevo alimento', async () => {
    const result = await service.createFood({
        name: 'Comida 2', calories: 200,
        carbohydrates: 0,
        proteins: 0,
        fats: 0,
        dateTime: undefined
    });
    expect(result).toEqual(mockFood);
  });

  it('debería actualizar un alimento', async () => {
    const result = await service.updateFood({
        id: 1, name: 'Comida Actualizada', calories: 150,
        dateTime: undefined
    });
    expect(result).toEqual(mockFood);
  });

  it('debería eliminar un alimento', async () => {
    await service.deleteFood(1);
    expect(foodRepository.delete).toHaveBeenCalledWith(1);
  });
});
