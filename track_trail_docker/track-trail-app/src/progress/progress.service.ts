import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Progress } from './progress.entity';
import { Exercise } from 'src/exercises/exercises.entity';
import { RoutineExercises } from 'src/rutina_ejercicios/routine_exercises.entity';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(Progress)
    private readonly progressRepository: Repository<Progress>,
    @InjectRepository(Exercise)
    private readonly exerciseRepository: Repository<Exercise>,
    @InjectRepository(RoutineExercises)
    private readonly routineExercisesRepository: Repository<RoutineExercises>,
  ) {}

  async getWeightProgress(muscleGroup: string) {
    const maxWeightExercise = await this.exerciseRepository
      .createQueryBuilder('exercise')
      .where('exercise.muscleGroup = :muscleGroup', { muscleGroup })
      .orderBy('exercise.weight', 'DESC')
      .select(['exercise.weight', 'exercise.name'])
      .getOne();
  
    return maxWeightExercise || { message: 'No hay registros de peso para este grupo muscular' };
  }
  
  
  async getRepetitionProgress(muscleGroup: string) {
    const maxRepsData = await this.exerciseRepository
      .createQueryBuilder('exercise')
      .where('exercise.muscleGroup = :muscleGroup', { muscleGroup })
      .orderBy('exercise.repetitions', 'DESC')
      .addOrderBy('exercise.weight', 'DESC')
      .select(['exercise.repetitions', 'exercise.weight'])
      .getOne();
  
    if (!maxRepsData) {
      return { message: 'No hay registros de repeticiones para este grupo muscular' };
    }
  
    const maxRepsExercises = await this.exerciseRepository.find({
      where: {
        muscleGroup,
        repetitions: maxRepsData.repetitions,
        weight: maxRepsData.weight,
      },
      select: ['name', 'repetitions', 'weight'],
    });
  
    const exerciseNames = maxRepsExercises.map((ex) => `"${ex.name}"`).join(', ');
  
    return {
      message: `Los ejercicios con más repeticiones en ${muscleGroup} son: ${exerciseNames}`,
      maxRepetitions: maxRepsData.repetitions,
      weight: maxRepsData.weight,
    };
  }
  
  async getTrainingStreak(userId: number): Promise<number> {
    const trainingDates = await this.routineExercisesRepository
      .createQueryBuilder('re')
      .select('DATE(re.date_start)', 'training_date')
      .addSelect('SUM(CASE WHEN re.completado = 1 THEN 1 ELSE 0 END)', 'completed_count')  
      .where('re.id_user = :userId', { userId })
      .groupBy('training_date')
      .orderBy('training_date', 'DESC')
      .getRawMany();
  
    // Convertimos a fechas únicas
    const uniqueDates = [...new Set(trainingDates.map(d => d.training_date))]
      .map(d => new Date(d));
  
    let streak = 0;
  
    for (let i = 0; i < uniqueDates.length - 1; i++) {
      const diff = (uniqueDates[i].getTime() - uniqueDates[i + 1].getTime()) / (1000 * 60 * 60 * 24);
      const dayData = trainingDates.find(d => d.training_date === uniqueDates[i].toISOString().split('T')[0]);
  
      if (!dayData) continue; // Si no hay datos para ese día, pasamos al siguiente
  
      if (diff === 1 && dayData.completed_count > 0) {
        streak++;
      } else if (dayData.completed_count === 0) {
        break;
      } else {
        break;
      }
    }
  
    return streak + (uniqueDates.length > 0 ? 1 : 0);
  }
  
  

  async getPersonalRecords() {
    const maxExercise = await this.exerciseRepository
      .createQueryBuilder('e')
      .select('e.name', 'exerciseName')
      .addSelect('MAX(e.weight)', 'maxWeight')
      .getRawOne();  
  
    if (maxExercise) {
      return {
        exerciseName: maxExercise.exerciseName,
        weight: maxExercise.maxWeight
      };
    }
  
    return null;  
  }
}