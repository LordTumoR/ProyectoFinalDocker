import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilsModule } from '../utils/utils.module';
import { Progress } from './progress.entity'; // La entidad Progress
import { Exercise } from '../exercises/exercises.entity';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';
import { RoutineExercises } from '../rutina_ejercicios/routine_exercises.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([Progress, Exercise, RoutineExercises]), 
    UtilsModule,
  ],
  controllers: [ProgressController], 
  providers: [ProgressService], 
  exports: [ProgressService], 
})
export class ProgressModule {}
