import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilsModule } from '../utils/utils.module';
import { ExercisesController } from './exercises.controller';
import { Exercise } from './exercises.entity';
import { ExercisesService } from './exercises.service';
import { RoutineModule } from '../routine/routine.module';
import { RoutineExercisesModule } from '../rutina_ejercicios/routine_exercises.module';
import { RoutineExercises } from '../rutina_ejercicios/routine_exercises.entity'; 
import { Routine } from '../routine/routine.entity'; 
import { User } from '../users/users.entity';
import { Progress } from '../progress/progress.entity';

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
