import { Test, TestingModule } from '@nestjs/testing';
import { NutritionRecordService } from './nutrition_record.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NutritionRecord } from './nutrition_record.entity';
import { User } from '../users/users.entity';
import { Food } from '../food/food.entity';
import { NutritionFood } from '../nutrition_food/nutritionfood.entity';
import { HttpException } from '@nestjs/common';

describe('NutritionRecordService', () => {
  let service: NutritionRecordService;
  let nutritionRecordRepository;
  let userRepository;
  let foodRepository;
  let nutritionFoodRepository;

  const mockNutritionRecord = { id: 1, name: 'Dieta 1', description: 'Descripción', date: new Date() };
  const mockUser = { id_user: 1, name: 'Usuario 1' };
  const mockFood = { id: 1, name: 'Comida 1', calories: 100 };
  const mockNutritionFood = { id: 1, food: mockFood, amount: 200 };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NutritionRecordService,
        {
          provide: getRepositoryToken(NutritionRecord),
          useValue: {
            find: jest.fn().mockResolvedValue([mockNutritionRecord]),
            findOne: jest.fn().mockResolvedValue(mockNutritionRecord),
            create: jest.fn().mockReturnValue(mockNutritionRecord),
            save: jest.fn().mockResolvedValue(mockNutritionRecord),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockUser),
          },
        },
        {
          provide: getRepositoryToken(Food),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockFood),
          },
        },
        {
          provide: getRepositoryToken(NutritionFood),
          useValue: {
            create: jest.fn().mockReturnValue(mockNutritionFood),
            save: jest.fn().mockResolvedValue(mockNutritionFood),
          },
        },
      ],
    }).compile();

    service = module.get<NutritionRecordService>(NutritionRecordService);
    nutritionRecordRepository = module.get(getRepositoryToken(NutritionRecord));
    userRepository = module.get(getRepositoryToken(User));
    foodRepository = module.get(getRepositoryToken(Food));
    nutritionFoodRepository = module.get(getRepositoryToken(NutritionFood));
  });

  it('debería obtener todos los registros de nutrición', async () => {
    const result = await service.getAllNutritionRecords();
    expect(result).toEqual([mockNutritionRecord]);
  });

  it('debería obtener un registro de nutrición por ID', async () => {
    const result = await service.getNutritionRecord(1);
    expect(result).toEqual(mockNutritionRecord);
  });

  it('debería lanzar una excepción si no se encuentra el registro de nutrición', async () => {
    nutritionRecordRepository.findOne.mockResolvedValue(null);
    await expect(service.getNutritionRecord(999)).rejects.toThrow(HttpException);
  });

  it('debería crear un nuevo registro de nutrición', async () => {
    const result = await service.createNutritionRecord({
      name: 'Dieta 2',
      user_id: 1,
      nutritionFoods: [{ foodId: 1, amount: 200, nutritionRecordId: 1 }] // Agregado para cumplir con el DTO
    });
    expect(result).toEqual(mockNutritionRecord);
  });

  it('debería agregar alimentos a un registro de nutrición', async () => {
    const result = await service.addFoodsToNutritionRecord(1, [{ foodId: 1, amount: 200, nutritionRecordId: 1 }]); // Agregado para cumplir con el DTO
    expect(result).toEqual(mockNutritionRecord);
  });

  it('debería actualizar un registro de nutrición', async () => {
    const result = await service.updateNutritionRecord({ id: 1, name: 'Dieta Actualizada' });
    expect(result).toEqual(mockNutritionRecord);
  });

  it('debería eliminar un registro de nutrición', async () => {
    await service.deleteNutritionRecord(1);
    expect(nutritionRecordRepository.delete).toHaveBeenCalledWith(1);
  });
});
