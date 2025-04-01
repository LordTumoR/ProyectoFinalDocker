import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { UtilsService } from '../utils/utils.service';
import { CreateRoutineDto, UpdateRoutineDto } from './routine.dto';
import { Routine } from './routine.entity';
import { User } from 'src/users/users.entity';
import { Exercise } from 'src/exercises/exercises.entity';
import { RoutineExercises } from 'src/rutina_ejercicios/routine_exercises.entity';
import { Progress } from 'src/progress/progress.entity';

@Injectable()
export class RoutineService {
  constructor(
    private readonly utilsService: UtilsService,
    @InjectRepository(Routine)
    private readonly routineRepository: Repository<Routine>,
    @InjectRepository(Exercise)
        private readonly exerciseRepository: Repository<Exercise>,
        @InjectRepository(RoutineExercises)
        private readonly routineExerciseRepository: Repository<RoutineExercises>, 
        @InjectRepository(Progress)
        private readonly progressRepository: Repository<Progress>, 
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>, 
  ) {}

  async getAllRoutines(xml?: string): Promise<Routine[] | string> {
    const routines = await this.routineRepository.find({
      relations: ['user','uploads'], 
    });
  
    if (xml === 'true') {
      const jsonformatted = JSON.stringify({
        routines,
      });
      return this.utilsService.convertJSONtoXML(jsonformatted);
    } else {
      return routines;
    }
  }
  

  async createRoutine(createRoutineDto: CreateRoutineDto): Promise<Routine> {
    console.log('Iniciando creación de rutina...');
    console.log('Datos recibidos:', createRoutineDto);

    const user = await this.usersRepository.findOne({
        where: { id_user: createRoutineDto.id_user },
    });

    if (!user) {
        console.error('Error: Usuario no encontrado');
        throw new Error('Usuario no encontrado');
    }

    console.log('Usuario encontrado:', user);

    // Crear la nueva rutina
    const newRoutine = this.routineRepository.create({
        ...createRoutineDto,
        user,
    });

    console.log('Nueva rutina creada (antes de guardar):', newRoutine);

    // Guardar la nueva rutina en la base de datos
    const savedRoutine = await this.routineRepository.save(newRoutine);

    console.log('Rutina guardada en la BD:', savedRoutine);

    // Buscar si ya existe una rutina idéntica pero de otro usuario
    const existingRoutine = await this.routineRepository.findOne({
        where: {
            name: savedRoutine.name,
            goal: savedRoutine.goal,
            duration: savedRoutine.duration,
            private_public: savedRoutine.private_public,
            dificulty: savedRoutine.dificulty,
            progress: savedRoutine.progress,
            imageurl: savedRoutine.imageurl
        }
    });

    if (existingRoutine) {
        console.log('Rutina idéntica encontrada con otro usuario:', existingRoutine);
        console.log(`Copiando ejercicios de la rutina original (${existingRoutine.id_routine}) a la nueva (${savedRoutine.id_routine})`);
        
        // Copiar los ejercicios de la rutina original a la nueva
        await this.copyRoutine(existingRoutine.id_routine, user.id_user, savedRoutine.id_routine);
    } else {
        console.log('No se encontró ninguna rutina idéntica de otro usuario.');
    }

    console.log('Finalizada la creación de rutina.');
    return savedRoutine;
}



  async getRoutine(id_routine: number, xml?: string): Promise<Routine | string | null> {
    const routine = await this.routineRepository.findOneBy({ id_routine });

    if (routine != null) {
      if (xml === 'true') {
        const jsonformatted = JSON.stringify(routine);
        return this.utilsService.convertJSONtoXML(jsonformatted);
      } else {
        return routine;
      }
    } else {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  async updateRoutine(updateRoutineDto: UpdateRoutineDto): Promise<Routine> {
    const routine = await this.routineRepository.findOne({
      where: { id_routine: updateRoutineDto.id_routine },
    });

    if (!routine) {
      throw new HttpException('Routine not found', HttpStatus.NOT_FOUND);
    }

    this.routineRepository.merge(routine, updateRoutineDto);
    return this.routineRepository.save(routine);
  }

  async deleteRoutine(id: number): Promise<boolean> {
    const result = await this.routineRepository.delete(id);
    return result.affected > 0; 
  }
  async vincularArchivo(idRoutine: number, fileId: number): Promise<void> {
    const routine = await this.routineRepository.findOne({
      where: { id_routine: idRoutine },
    });
    
    if (!routine) {
      throw new HttpException(
        `No se encontró una rutina con el ID: ${idRoutine}`,
        HttpStatus.NOT_FOUND,
      );
    }
  
    routine.progress = `Archivo vinculado: ${fileId}`;
    await this.routineRepository.save(routine);
  
    console.log(`Archivo con ID ${fileId} vinculado a la rutina con ID ${idRoutine}`);
  }
  async getRoutinesByUser(userId: number) {
    return this.routineRepository.find({
      where: { user: { id_user: userId } }, 
      relations: ['user'], 
    });
  }
  async copyRoutine(id_routine_original: number, id_user: number, id_routine_nueva: number) {
    console.log(`Iniciando copia de rutina...`);
    console.log(`ID Rutina Original: ${id_routine_original}, ID Usuario: ${id_user}, ID Nueva Rutina: ${id_routine_nueva}`);

    // 1. Obtener la rutina original con sus relaciones
    const existingRoutine = await this.routineRepository.findOne({
      where: { id_routine: id_routine_original },
      relations: ['routines_exercises', 'routines_exercises.ejercicios'],
    });
  
    if (!existingRoutine) {
      console.error('Rutina original no encontrada');
      throw new NotFoundException('Rutina original no encontrada');
    }

    console.log(`Rutina original encontrada: ${existingRoutine.id_routine}`);
  
    const existingExercises = existingRoutine.routines_exercises;
    console.log(`Total de ejercicios en la rutina original: ${existingExercises.length}`);
  
    // Mapeo para relacionar ejercicios originales con sus copias
    const exerciseMap = new Map<number, number>();
  
    for (const routineExercise of existingExercises) {
      console.log(`Procesando ejercicio con ID: ${routineExercise.ejercicios.id_exercises}`);
  
      // 2. Crear una copia del ejercicio original
      const newExercise = this.exerciseRepository.create({
        name: routineExercise.ejercicios.name,
        description: routineExercise.ejercicios.description,
        images: routineExercise.ejercicios.images,
        dateTime: routineExercise.ejercicios.dateTime,
        repetitions: routineExercise.ejercicios.repetitions,
        weight: routineExercise.ejercicios.weight,
        muscleGroup: routineExercise.ejercicios.muscleGroup,
        sets: routineExercise.ejercicios.sets,
      });
  
      const savedExercise = await this.exerciseRepository.save(newExercise);
      console.log(`Ejercicio copiado con nueva ID: ${savedExercise.id_exercises}`);
  
      // Guardamos la relación entre el ejercicio original y su copia
      exerciseMap.set(routineExercise.ejercicios.id_exercises, savedExercise.id_exercises);
  
      // 3. Crear la relación en routine_exercises con los nuevos IDs
      console.log(`Creando nueva relación en routine_exercises`);
      const newRoutineExercise = this.routineExerciseRepository.create({
        date_start: routineExercise.date_start,
        date_finish: routineExercise.date_finish,
        completado: routineExercise.completado,
        routines: { id_routine: id_routine_nueva }, // Nueva rutina
        user: { id_user },
        ejercicios: { id_exercises: savedExercise.id_exercises }, // Nuevo ejercicio
      });
  
      const savedRoutineExercise = await this.routineExerciseRepository.save(newRoutineExercise);
      console.log(`Relación creada con ID: ${savedRoutineExercise.id_routine_exercise}`);
    }
  
    console.log(`Copia de rutina finalizada correctamente.`);
}
  
}
