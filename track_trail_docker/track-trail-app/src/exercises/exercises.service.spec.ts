import { Test, TestingModule } from '@nestjs/testing';
import { ExercisesService } from './exercises.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Exercise } from './exercises.entity';
import { HttpException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UtilsService } from '../utils/utils.service';

describe('ExercisesService', () => {
  let service: ExercisesService;
  let exercisesRepository: Repository<Exercise>;

  const mockExercise = { id_exercises: 1, name: 'Ejercicio 1', description: 'Descripción', duration: 30 };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExercisesService,
        UtilsService,
        {
          provide: getRepositoryToken(Exercise),
          useValue: {
            find: jest.fn().mockResolvedValue([mockExercise]),
            findOne: jest.fn().mockResolvedValue(mockExercise),
            findOneBy: jest.fn().mockResolvedValue(mockExercise),
            merge: jest.fn((exercise, updateDto) => Object.assign(exercise, updateDto)),
            save: jest.fn().mockResolvedValue(mockExercise),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
        {
          provide: 'RoutineRepository', // Usa el token correcto si es un repositorio TypeORM
          useValue: {},
        },
        {
          provide: 'RoutineExercisesRepository',
          useValue: {},
        },
        {
          provide: 'ProgressRepository',
          useValue: {},
        },
        {
          provide: 'UserRepository',
          useValue: {},
        },
      ],
    }).compile();
  
    service = module.get<ExercisesService>(ExercisesService);
    exercisesRepository = module.get(getRepositoryToken(Exercise));
  });
  

  it('debería obtener todos los ejercicios', async () => {
    const result = await service.getAllExercises();
    expect(result).toEqual([mockExercise]);
  });

  it('debería obtener un ejercicio por ID', async () => {
    const result = await service.getExercise(1);
    expect(result).toEqual(mockExercise);
  });

  it('debería lanzar una excepción si no se encuentra el ejercicio', async () => {
    (exercisesRepository.findOneBy as jest.Mock).mockResolvedValue(null);
    await expect(service.getExercise(999)).rejects.toThrow(HttpException);
  });

  it('debería actualizar un ejercicio', async () => {
    const updatedExercise = { id_exercises: 1, name: 'Ejercicio Actualizado', description: 'Nueva descripción', duration: 60 };
    (exercisesRepository.save as jest.Mock).mockResolvedValue(updatedExercise);
    const result = await service.updateExercise({ ...updatedExercise, muscleGroup: 'Piernas' });
    expect(result).toEqual(updatedExercise);
  });

  it('debería eliminar un ejercicio', async () => {
    await service.deleteExercise(1);
    expect(exercisesRepository.delete).toHaveBeenCalledWith(1);
  });
});
