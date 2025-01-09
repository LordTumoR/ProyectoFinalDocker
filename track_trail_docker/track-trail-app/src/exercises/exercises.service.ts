import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UtilsService } from '../utils/utils.service';
import { CreateExerciseDto, UpdateExerciseDto } from './exercises.dto';
import { Exercise } from './exercises.entity';

@Injectable()
export class ExercisesService {
  constructor(
    private readonly utilsService: UtilsService,
    @InjectRepository(Exercise)
    private readonly exerciseRepository: Repository<Exercise>,
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
  }

  async createExercise(createExerciseDto: CreateExerciseDto): Promise<Exercise> {
    const exercise = this.exerciseRepository.create(createExerciseDto);
    return this.exerciseRepository.save(exercise);
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
