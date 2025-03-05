import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Progress } from './progress.entity';
import { Exercise } from 'src/exercises/exercises.entity';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(Progress)
    private readonly progressRepository: Repository<Progress>,
    @InjectRepository(Exercise)
    private readonly exerciseRepository: Repository<Exercise>,
  ) {}

  async getWeightProgress(exerciseId: number) {
    return this.progressRepository.find({
      where: { exercise: { id_exercises: exerciseId } },
      order: { date: 'ASC' },
    });
  }

  async getRepetitionProgress(exerciseId: number) {
    return this.progressRepository.find({
      where: { exercise: { id_exercises: exerciseId } },
      order: { date: 'ASC' },
    });
  }

  async getWorkoutHistory() {
    return this.progressRepository.find({ order: { date: 'DESC' } });
  }

  async getPersonalRecords() {
    return this.progressRepository.find({ where: { is_personal_record: true } });
  }

  async getStreakCount(userId: number): Promise<number> {
    const progressRecords = await this.progressRepository.find({ order: { date: 'DESC' } });
    let streak = 0;
    let lastDate = null;

    for (const record of progressRecords) {
      if (!lastDate || (lastDate.getTime() - record.date.getTime()) / (1000 * 60 * 60 * 24) === 1) {
        streak++;
      } else {
        break;
      }
      lastDate = record.date;
    }
    return streak;
  }

  async getProgressSummary() {
    return this.progressRepository.find();
  }
}
