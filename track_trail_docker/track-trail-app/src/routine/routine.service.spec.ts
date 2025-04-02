import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoutineService } from './routine.service';
import { Routine } from './routine.entity';
import { User } from '../users/users.entity';
import { Exercise } from '../exercises/exercises.entity';
import { RoutineExercises } from '../rutina_ejercicios/routine_exercises.entity';
import { UploadEntity } from '../upload/upload.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateRoutineDto, UpdateRoutineDto } from './routine.dto';
import { UtilsService } from '../utils/utils.service';
import { Progress } from '../progress/progress.entity';

describe('RoutineService', () => {
  let service: RoutineService;
  let routineRepository: Repository<Routine>;
  let exerciseRepository: Repository<Exercise>;
  let routineExerciseRepository: Repository<RoutineExercises>;
  let usersRepository: Repository<User>;
  let utilsService: UtilsService;
  let progressRepository: Repository<Progress>; // Añadido para el mock de Progress

  // Mock de datos COMPLETOS (basados en las entidades)
  const mockUser: User = {
    id_user: 1,
    name: 'Test User',
    surname: 'Surname',
    email: 'test@example.com',
    weight: 70,
    height: 175,
    token: 'token',
    dateofbirth: new Date('1990-01-01'),
    sex: 'Male',
    role: 0,
    avatar: 'avatar.jpg',
    routines: [],
    routines_exercises: [],
    nutritionRecords: [],
  };

  const mockExercise: Exercise = {
    id_exercises: 1,
    name: 'Push-up',
    description: 'Basic exercise',
    images: 'image.jpg',
    dateTime: new Date(),
    repetitions: 10,
    weight: 0,
    muscleGroup: 'Chest',
    sets: 3,
    progress_records: [],
    routines_exercises: [],
  };

  const mockRoutine: Routine = {
    id_routine: 1,
    name: 'Morning Routine',
    goal: 'Strength',
    duration: 30,
    private_public: true,
    dificulty: 'Medium',
    progress: 'In Progress',
    imageurl: 'routine.jpg',
    isFavorite: false,
    user: mockUser,
    routines_exercises: [],
    uploads: [],
  };

  const mockRoutineExercise: RoutineExercises = {
    id_routine_exercise: 1,
    date_start: new Date(),
    date_finish: new Date(),
    completado: false,
    routines: mockRoutine,
    user: mockUser,
    ejercicios: mockExercise,
  };

  // DTOs completos
  const createRoutineDto: CreateRoutineDto = {
    id_user: 1,
    name: 'Morning Routine',
    goal: 'Strength',
    duration: 30,
    private_public: true,
    dificulty: 'Medium',
    progress: 'In Progress',
    imageurl: 'routine.jpg',
  };

  const updateRoutineDto: UpdateRoutineDto = {
    id_routine: 1,
    name: 'Updated Routine',
    goal: 'Endurance',
    duration: 45,
    private_public: false,
    dificulty: 'Hard',
    progress: 'Completed',
    imageurl: 'updated.jpg',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoutineService,
        {
          provide: getRepositoryToken(Routine),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Exercise),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(RoutineExercises),
          useClass: Repository,
        },
        {
            provide: getRepositoryToken(Progress),  // ¡Añade esto!
            useClass: Repository,
          },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: UtilsService,
          useValue: {
            convertJSONtoXML: jest.fn().mockImplementation((json) => `<xml>${json}</xml>`),
          },
        },
      ],
    }).compile();

    service = module.get<RoutineService>(RoutineService);
    routineRepository = module.get<Repository<Routine>>(getRepositoryToken(Routine));
    exerciseRepository = module.get<Repository<Exercise>>(getRepositoryToken(Exercise));
    routineExerciseRepository = module.get<Repository<RoutineExercises>>(getRepositoryToken(RoutineExercises));
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    utilsService = module.get<UtilsService>(UtilsService);
  });

  // --------------------------------------------
  // Tests para getAllRoutines
  // --------------------------------------------
  describe('getAllRoutines', () => {
    it('debería retornar un array de rutinas con relaciones', async () => {
      const routineWithRelations = { 
        ...mockRoutine, 
        user: mockUser,
        uploads: [] 
      };
      jest.spyOn(routineRepository, 'find').mockResolvedValue([routineWithRelations]);

      const result = await service.getAllRoutines();
      expect(result).toEqual([routineWithRelations]);
      expect(routineRepository.find).toHaveBeenCalledWith({
        relations: ['user', 'uploads'],
      });
    });
  });

  // --------------------------------------------
  // Tests para createRoutine
  // --------------------------------------------
  describe('createRoutine', () => {
    it('debería crear una rutina y copiar ejercicios si existe una rutina idéntica', async () => {
      const identicalRoutine = { ...mockRoutine, id_routine: 2 };
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(routineRepository, 'create').mockReturnValue(mockRoutine);
      jest.spyOn(routineRepository, 'save').mockResolvedValue(mockRoutine);
      jest.spyOn(routineRepository, 'findOne').mockResolvedValue(identicalRoutine);
      jest.spyOn(service, 'copyRoutine').mockResolvedValue(undefined);

      const result = await service.createRoutine(createRoutineDto);
      expect(result).toEqual(mockRoutine);
      expect(service.copyRoutine).toHaveBeenCalledWith(2, 1, 1);
    });

    it('debería fallar si el usuario no existe', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null);
      await expect(service.createRoutine(createRoutineDto)).rejects.toThrow('Usuario no encontrado');
    });
  });

  // --------------------------------------------
  // Tests para getRoutine
  // --------------------------------------------
  describe('getRoutine', () => {
    it('debería retornar una rutina por ID', async () => {
      jest.spyOn(routineRepository, 'findOneBy').mockResolvedValue(mockRoutine);
      const result = await service.getRoutine(1);
      expect(result).toEqual(mockRoutine);
    });

    it('debería retornar XML si xml="true"', async () => {
      jest.spyOn(routineRepository, 'findOneBy').mockResolvedValue(mockRoutine);
      const result = await service.getRoutine(1, 'true');
      expect(result).toContain('<xml>');
    });
  });

  // --------------------------------------------
  // Tests para updateRoutine
  // --------------------------------------------
  describe('updateRoutine', () => {
    it('debería actualizar una rutina correctamente', async () => {
      const updatedRoutine = { ...mockRoutine, ...updateRoutineDto };
      jest.spyOn(routineRepository, 'findOne').mockResolvedValue(mockRoutine);
      jest.spyOn(routineRepository, 'save').mockResolvedValue(updatedRoutine);
      jest.spyOn(routineRepository, 'merge').mockReturnValue(mockRoutine); 
      const result = await service.updateRoutine(updateRoutineDto);
      expect(result.name).toBe('Updated Routine');
      expect(result.dificulty).toBe('Hard');
    });
  });

  // --------------------------------------------
  // Tests para deleteRoutine
  // --------------------------------------------
  describe('deleteRoutine', () => {
    it('debería eliminar una rutina y retornar true', async () => {
      jest.spyOn(routineRepository, 'delete').mockResolvedValue({ affected: 1 } as any);
      const result = await service.deleteRoutine(1);
      expect(result).toBe(true);
    });

    it('debería retornar false si la rutina no existe', async () => {
      jest.spyOn(routineRepository, 'delete').mockResolvedValue({ affected: 0 } as any);
      const result = await service.deleteRoutine(999);
      expect(result).toBe(false);
    });
  });

  // --------------------------------------------
  // Tests para getRoutinesByUser
  // --------------------------------------------
  describe('getRoutinesByUser', () => {
    it('debería retornar rutinas filtradas por usuario', async () => {
      jest.spyOn(routineRepository, 'find').mockResolvedValue([mockRoutine]);
      const result = await service.getRoutinesByUser(1);
      expect(result).toEqual([mockRoutine]);
      expect(routineRepository.find).toHaveBeenCalledWith({
        where: { user: { id_user: 1 } },
        relations: ['user'],
      });
    });
  });

  // --------------------------------------------
  // Tests para vincularArchivo
  // --------------------------------------------
  describe('vincularArchivo', () => {
    it('debería vincular un archivo a una rutina', async () => {
      jest.spyOn(routineRepository, 'findOne').mockResolvedValue(mockRoutine);
      jest.spyOn(routineRepository, 'save').mockResolvedValue({ ...mockRoutine, progress: 'Archivo vinculado: 123' });

      await service.vincularArchivo(1, 123);
      expect(routineRepository.save).toHaveBeenCalledWith({
        ...mockRoutine,
        progress: 'Archivo vinculado: 123',
      });
    });

    it('debería fallar si la rutina no existe', async () => {
      jest.spyOn(routineRepository, 'findOne').mockResolvedValue(null);
      await expect(service.vincularArchivo(999, 123)).rejects.toThrow(HttpException);
    });
  });
});