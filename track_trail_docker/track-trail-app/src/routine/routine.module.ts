import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilsModule } from '../utils/utils.module';
import { RoutineController } from './routine.controller';
import { Routine } from './routine.entity';
import { RoutineService } from './routine.service';
import { UsersModule } from 'src/users/users.module';
import { Exercise } from 'src/exercises/exercises.entity';
import { RoutineExercises } from 'src/rutina_ejercicios/routine_exercises.entity';
import { User } from 'src/users/users.entity';
import { Progress } from 'src/progress/progress.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Routine,Exercise, RoutineExercises,User, Progress]), UtilsModule, UsersModule],
  controllers: [RoutineController],
  providers: [RoutineService],
  exports: [RoutineService],
})
export class RoutineModule {}
