import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UtilsService } from '../utils/utils.service';
import { CreateExerciseDto, UpdateExerciseDto } from './exercises.dto';
import { Exercise } from './exercises.entity';
import { RoutineExercises } from 'src/rutina_ejercicios/routine_exercises.entity';
import { Routine } from 'src/routine/routine.entity';
import { User } from 'src/users/users.entity';
import { create } from 'domain';

@Injectable()
export class ExercisesService {
  constructor(
    private readonly utilsService: UtilsService,
    @InjectRepository(Exercise)
    private readonly exerciseRepository: Repository<Exercise>,
    @InjectRepository(Routine)
    private readonly routineRepository: Repository<Routine>,
    @InjectRepository(RoutineExercises)
    private readonly routineExerciseRepository: Repository<RoutineExercises>, 
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>, 
  ) {}

  async getAllExercises(xml?: string): Promise<Exercise[] | string> {
    const exercises = await this.exerciseRepository.find();
    if (xml === 'true') {
      const jsonformatted = JSON.stringify({
        exercises,
      });
      return this.utilsService.convertJSONtoXML(jsonformatted);
    } else {
      return exercises;
    }
  }async addExerciseToRoutine(
    routineId: number,
    createExerciseDto: CreateExerciseDto,
    userId: number,  
  ): Promise<RoutineExercises[]> {
    const routine = await this.routineRepository.findOne({ where: { id_routine: routineId } });
    if (!routine) {
      throw new Error('La rutina especificada no existe.');
    }
  
    const routineDuration = routine.duration;
    const startDate = new Date(createExerciseDto.dateTime);
    const dayOfWeek = startDate.getDay();
    const routineExercises: RoutineExercises[] = [];
  
    for (let i = 0; i < routineDuration; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
  
      if (currentDate.getDay() === dayOfWeek) {
        const exercise = this.exerciseRepository.create({
          name: createExerciseDto.name,
          description: createExerciseDto.description,
          images: createExerciseDto.images,
          dateTime: currentDate,
          repetitions: createExerciseDto.repetitions,
          weigth: createExerciseDto.weigth,
        });
  
        const savedExercise = await this.exerciseRepository.save(exercise);
  
        const user = await this.usersRepository.findOne({
          where: { id_user: userId },  
        });
        if (!user) {
          throw new Error('Usuario no encontrado');
        }
  
        const routineExercise = this.routineExerciseRepository.create({
          date_start: currentDate,
          date_finish: null,
          completado: false,
          user: user,  
          routines: routine,
          ejercicios: savedExercise,  
        });
  
        routineExercises.push(routineExercise);
      }
    }
  
    return this.routineExerciseRepository.save(routineExercises);
  }
  async getExercise(id_exercises: number, xml?: string): Promise<Exercise | string | null> {
    const exercise = await this.exerciseRepository.findOneBy({ id_exercises });

    if (exercise != null) {
      if (xml === 'true') {
        const jsonformatted = JSON.stringify(exercise);
        return this.utilsService.convertJSONtoXML(jsonformatted);
      } else {
        return exercise;
      }
    } else {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  async updateExercise(updateExerciseDto: UpdateExerciseDto): Promise<Exercise> {
    const exercise = await this.exerciseRepository.findOne({
      where: { id_exercises: updateExerciseDto.id_exercises },
    });

    if (!exercise) {
      throw new HttpException('Exercise not found', HttpStatus.NOT_FOUND);
    }

    this.exerciseRepository.merge(exercise, updateExerciseDto);
    return this.exerciseRepository.save(exercise);
  }

  async deleteExercise(id_exercises: number): Promise<void> {
    const result = await this.exerciseRepository.delete(id_exercises);
    if (result.affected === 0) {
      throw new HttpException('Exercise not found', HttpStatus.NOT_FOUND);
    }
  }
}
