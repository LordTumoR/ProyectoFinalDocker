import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UtilsService } from '../utils/utils.service';
import { CreateRoutineExercisesDto, UpdateRoutineExercisesDto } from './routine_exercises.dto';
import { RoutineExercises } from './routine_exercises.entity';

@Injectable()
export class RoutineExercisesService {
  constructor(
    private readonly utilsService: UtilsService,
    @InjectRepository(RoutineExercises)
    private readonly routineExercisesRepository: Repository<RoutineExercises>,
  ) {}

  async getAllRoutineExercises(xml?: string): Promise<RoutineExercises[] | string> {
    const routineExercises = await this.routineExercisesRepository.find({
      relations: ['user', 'routines', 'ejercicios'],
    });
    if (xml === 'true') {
      const jsonformatted = JSON.stringify({
        routineExercises,
      });
      return this.utilsService.convertJSONtoXML(jsonformatted);
    } else {
      return routineExercises;
    }
  }

  async createRoutineExercise(createRoutineExercisesDto: CreateRoutineExercisesDto): Promise<RoutineExercises> {
    const routineExercise = this.routineExercisesRepository.create({
      date_start: createRoutineExercisesDto.date_start,
      date_finish: createRoutineExercisesDto.date_finish,
      user: { id_user: createRoutineExercisesDto.id_user },
      routines: { id_routine: createRoutineExercisesDto.id_routine },
      ejercicios: { id_exercises: createRoutineExercisesDto.id_exercise }
    });
    return this.routineExercisesRepository.save(routineExercise);
  }

  async getRoutineExercise(id_routine_exercise: number, xml?: string): Promise<RoutineExercises | string | null> {
    const routineExercise = await this.routineExercisesRepository.findOne({
      where: { id_routine_exercise },
      relations: ['user', 'routines', 'ejercicios'],
    });

    if (routineExercise != null) {
      if (xml === 'true') {
        const jsonformatted = JSON.stringify(routineExercise);
        return this.utilsService.convertJSONtoXML(jsonformatted);
      } else {
        return routineExercise;
      }
    } else {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  async updateRoutineExercise(updateRoutineExercisesDto: UpdateRoutineExercisesDto): Promise<RoutineExercises> {
    const routineExercise = await this.routineExercisesRepository.findOne({
      where: { id_routine_exercise: updateRoutineExercisesDto.id_routine_exercise },
      relations: ['user', 'routines', 'ejercicios'],
    });

    if (!routineExercise) {
      throw new HttpException('Routine Exercise not found', HttpStatus.NOT_FOUND);
    }

    if (updateRoutineExercisesDto.id_user) {
      routineExercise.user = { id_user: updateRoutineExercisesDto.id_user } as any;
    }
    if (updateRoutineExercisesDto.id_routine) {
      routineExercise.routines = { id_routine: updateRoutineExercisesDto.id_routine } as any;
    }
    if (updateRoutineExercisesDto.id_exercise) {
      routineExercise.ejercicios = { id_exercises: updateRoutineExercisesDto.id_exercise } as any;
    }
    if (updateRoutineExercisesDto.date_start) {
      routineExercise.date_start = updateRoutineExercisesDto.date_start;
    }
    if (updateRoutineExercisesDto.date_finish) {
      routineExercise.date_finish = updateRoutineExercisesDto.date_finish;
    }

    return this.routineExercisesRepository.save(routineExercise);
  }

  async deleteRoutineExercise(id_routine_exercise: number): Promise<void> {
    const result = await this.routineExercisesRepository.delete(id_routine_exercise);
    if (result.affected === 0) {
      throw new HttpException('Routine Exercise not found', HttpStatus.NOT_FOUND);
    }
  }
}
