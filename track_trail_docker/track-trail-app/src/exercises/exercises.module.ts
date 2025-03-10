import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilsModule } from '../utils/utils.module';
import { ExercisesController } from './exercises.controller';
import { Exercise } from './exercises.entity';
import { ExercisesService } from './exercises.service';
import { RoutineModule } from 'src/routine/routine.module';
import { RoutineExercisesModule } from 'src/rutina_ejercicios/routine_exercises.module';
import { RoutineExercises } from 'src/rutina_ejercicios/routine_exercises.entity'; 
import { Routine } from 'src/routine/routine.entity'; 
import { User } from 'src/users/users.entity';
import { Progress } from 'src/progress/progress.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Exercise, RoutineExercises, Routine,User, Progress]), 
    UtilsModule,
  ],
  controllers: [ExercisesController],
  providers: [ExercisesService],
  exports: [ExercisesService],
})
export class ExercisesModule {}
