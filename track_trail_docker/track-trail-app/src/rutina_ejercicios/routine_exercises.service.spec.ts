import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoutineExercisesService } from './routine_exercises.service';
import { RoutineExercises } from './routine_exercises.entity';
import { UtilsService } from '../utils/utils.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateRoutineExercisesDto, UpdateRoutineExercisesDto } from './routine_exercises.dto';

describe('RoutineExercisesService', () => {
  let service: RoutineExercisesService;
  let routineExercisesRepository: Repository<RoutineExercises>;
  let utilsService: UtilsService;

  // Mock data
  const mockRoutineExercise: RoutineExercises = {
    id_routine_exercise: 1,
    date_start: new Date('2023-01-01'),
    date_finish: new Date('2023-01-31'),
    completado: false,
    user: { id_user: 1 } as any,
    routines: { id_routine: 1 } as any,
    ejercicios: { id_exercises: 1 } as any,
  };

  const createDto: CreateRoutineExercisesDto = {
    date_start: new Date('2023-01-01'),
    date_finish: new Date('2023-01-31'),
    id_user: 1,
    id_routine: 1,
    id_exercise: 1,
  };

  const updateDto: UpdateRoutineExercisesDto = {
    id_routine_exercise: 1,
    completado: true,
    date_finish: new Date('2023-02-15'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoutineExercisesService,
        {
          provide: getRepositoryToken(RoutineExercises),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getCount: jest.fn(),
            })),
          },
        },
        {
          provide: UtilsService,
          useValue: {
            convertJSONtoXML: jest.fn().mockImplementation((json) => `<xml>${json}</xml>`),
          },
        },
      ],
    }).compile();

    service = module.get<RoutineExercisesService>(RoutineExercisesService);
    routineExercisesRepository = module.get<Repository<RoutineExercises>>(
      getRepositoryToken(RoutineExercises),
    );
    utilsService = module.get<UtilsService>(UtilsService);
  });

  describe('getAllRoutineExercises', () => {
    it('should return an array of routine exercises', async () => {
      jest.spyOn(routineExercisesRepository, 'find').mockResolvedValue([mockRoutineExercise]);
      const result = await service.getAllRoutineExercises();
      expect(result).toEqual([mockRoutineExercise]);
    });

    it('should return XML when xml="true"', async () => {
      jest.spyOn(routineExercisesRepository, 'find').mockResolvedValue([mockRoutineExercise]);
      const result = await service.getAllRoutineExercises('true');
      expect(result).toContain('<xml>');
    });
  });

  describe('createRoutineExercise', () => {
    it('should create a new routine exercise', async () => {
      jest.spyOn(routineExercisesRepository, 'create').mockReturnValue(mockRoutineExercise);
      jest.spyOn(routineExercisesRepository, 'save').mockResolvedValue(mockRoutineExercise);

      const result = await service.createRoutineExercise(createDto);
      expect(result).toEqual(mockRoutineExercise);
      expect(routineExercisesRepository.create).toHaveBeenCalledWith({
        date_start: createDto.date_start,
        date_finish: createDto.date_finish,
        user: { id_user: createDto.id_user },
        routines: { id_routine: createDto.id_routine },
        ejercicios: { id_exercises: createDto.id_exercise },
      });
    });
  });

  describe('getRoutineExercise', () => {
    it('should return a routine exercise by ID', async () => {
      jest.spyOn(routineExercisesRepository, 'findOne').mockResolvedValue(mockRoutineExercise);
      const result = await service.getRoutineExercise(1);
      expect(result).toEqual(mockRoutineExercise);
    });

    it('should throw HttpException when routine exercise not found', async () => {
      jest.spyOn(routineExercisesRepository, 'findOne').mockResolvedValue(null);
      await expect(service.getRoutineExercise(999)).rejects.toThrow(HttpException);
    });
  });

  describe('updateRoutineExercise', () => {
    it('should update a routine exercise', async () => {
      const updatedExercise = {
        ...mockRoutineExercise,
        completado: true,
        date_finish: new Date('2023-02-15'),
      };

      jest.spyOn(routineExercisesRepository, 'findOne').mockResolvedValue(mockRoutineExercise);
      jest.spyOn(routineExercisesRepository, 'save').mockResolvedValue(updatedExercise);

      const result = await service.updateRoutineExercise(updateDto);
      expect(result.completado).toBe(true);
      expect(result.date_finish).toEqual(new Date('2023-02-15'));
    });

    it('should throw HttpException when routine exercise not found', async () => {
      jest.spyOn(routineExercisesRepository, 'findOne').mockResolvedValue(null);
      await expect(service.updateRoutineExercise(updateDto)).rejects.toThrow(HttpException);
    });
  });

  describe('deleteRoutineExercise', () => {
    it('should delete a routine exercise', async () => {
      jest.spyOn(routineExercisesRepository, 'delete').mockResolvedValue({ affected: 1 } as any);
      await expect(service.deleteRoutineExercise(1)).resolves.not.toThrow();
    });

    it('should throw HttpException when routine exercise not found', async () => {
      jest.spyOn(routineExercisesRepository, 'delete').mockResolvedValue({ affected: 0 } as any);
      await expect(service.deleteRoutineExercise(999)).rejects.toThrow(HttpException);
    });
  });

  describe('calculateCompletionPercentage', () => {
    it('should calculate completion percentage', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getCount: jest.fn()
          .mockResolvedValueOnce(10) // totalExercises
          .mockResolvedValueOnce(7),  // completedExercises
      };

      jest.spyOn(routineExercisesRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      const result = await service.calculateCompletionPercentage(1);
      expect(result).toEqual({ percentage: 70 });
    });

    it('should return 0 when no exercises exist', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getCount: jest.fn()
          .mockResolvedValueOnce(0) // totalExercises
          .mockResolvedValueOnce(0), // completedExercises
      };

      jest.spyOn(routineExercisesRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      const result = await service.calculateCompletionPercentage(1);
      expect(result).toEqual({ percentage: 0 });
    });
  });
});