import { Test, TestingModule } from '@nestjs/testing';
import { NutritionFoodService } from './nutritionfood.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NutritionFood } from './nutritionfood.entity';
import { NutritionRecord } from '../nutrition_record/nutrition_record.entity';
import { Food } from '../food/food.entity';
import { HttpException } from '@nestjs/common';
import { User } from '../users/users.entity';
import { Repository } from 'typeorm';

describe('NutritionFoodService', () => {
  let service: NutritionFoodService;
  let nutritionFoodRepository: Repository<NutritionFood>;
  let nutritionRecordRepository: Repository<NutritionRecord>;
  let foodRepository: Repository<Food>;
  let userRepository: Repository<User>;

  const mockNutritionFood = {
    id: 1,
    food: { id: 1, name: 'Comida 1', calories: 100 },
    nutritionRecord: { id: 1, name: 'Registro 1' },
    amount: 200,
  };
  
  
  
  const mockNutritionRecord = { 
    id: 1, 
    name: 'Dieta 1',
    user: { id: 1 },
    nutritionFoods: []
  };
  
  const mockFood = { 
    id: 1, 
    name: 'Comida 1', 
    calories: 100,
    protein: 10,
    carbohydrates: 20,
    fat: 5
  };
  
  const mockUser = { 
    id_user: 1, 
    name: 'Usuario 1',
    nutritionRecords: []
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NutritionFoodService,
        {
          provide: getRepositoryToken(NutritionFood),
          useValue: {
            find: jest.fn().mockResolvedValue([mockNutritionFood]),
            findOne: jest.fn().mockImplementation((options) => 
              options.where.id === 1 ? Promise.resolve(mockNutritionFood) : Promise.resolve(null)
            ),
            create: jest.fn().mockImplementation((dto) => ({
              id: Math.floor(Math.random() * 1000),
              ...dto
            })),
            save: jest.fn().mockImplementation((nutritionFood) => Promise.resolve(nutritionFood)),
            remove: jest.fn().mockResolvedValue(mockNutritionFood),
          },
        },
        {
          provide: getRepositoryToken(NutritionRecord),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockNutritionRecord),
            create: jest.fn().mockImplementation((dto) => ({
              id: 1,
              ...dto,
              nutritionFoods: []
            })),
            save: jest.fn().mockImplementation((record) => Promise.resolve(record)),
          },
        },
        {
          provide: getRepositoryToken(Food),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockFood),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockUser),
          },
        },
      ],
    }).compile();

    service = module.get<NutritionFoodService>(NutritionFoodService);
    nutritionFoodRepository = module.get(getRepositoryToken(NutritionFood));
    nutritionRecordRepository = module.get(getRepositoryToken(NutritionRecord));
    foodRepository = module.get(getRepositoryToken(Food));
    userRepository = module.get(getRepositoryToken(User));
  });

  describe('getAllNutritionFoods', () => {
    it('debería obtener todos los alimentos de nutrición', async () => {
      const result = await service.getAllNutritionFoods();
      expect(result).toEqual([mockNutritionFood]);
      expect(nutritionFoodRepository.find).toHaveBeenCalled();
    });
  });

  describe('getNutritionFood', () => {
    

    it('debería lanzar una excepción HttpException si no se encuentra el alimento de nutrición', async () => {
      await expect(service.getNutritionFood(999)).rejects.toThrow(HttpException);
    });
  });

  describe('createNutritionRecord', () => {
    it('debería crear un nuevo registro nutricional con alimentos', async () => {
      const createDto = {
        nutritionFoods: [{ foodId: 1, amount: 200,nutritionRecordId: 1 }],
        user_id: 1,
        date: new Date(),
        name: 'Dieta 2',
        description: 'Descripción',
        imageurl: 'url_imagen',
      };

      const result = await service.createNutritionRecord(createDto);
      
      expect(result).toBeDefined();
      expect(nutritionRecordRepository.create).toHaveBeenCalled();
      expect(nutritionRecordRepository.save).toHaveBeenCalled();
      expect(nutritionFoodRepository.create).toHaveBeenCalled();
      expect(nutritionFoodRepository.save).toHaveBeenCalled();
    });
  });

  describe('updateNutritionFood', () => {
    it('debería actualizar un alimento de nutrición', async () => {
      const updateDto = {
        id: 1,
        nutritionRecordId: 1,
        foodId: 1,
        amount: 250,
      };

      const result = await service.updateNutritionFood(updateDto);
      expect(result).toBeDefined();
      expect(result.amount).toBe(250);
      expect(nutritionFoodRepository.save).toHaveBeenCalled();
    });
  });

  describe('deleteNutritionFood', () => {
    it('debería eliminar un alimento de nutrición', async () => {
      await service.deleteNutritionFood(1);
      expect(nutritionFoodRepository.remove).toHaveBeenCalled();
    });
  });
});