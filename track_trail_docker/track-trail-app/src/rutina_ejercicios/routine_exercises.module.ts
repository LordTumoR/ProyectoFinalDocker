import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilsModule } from '../utils/utils.module';
import { RoutineExercisesController } from './routine_exercises.controller';
import { RoutineExercises } from './routine_exercises.entity';
import { RoutineExercisesService } from './routine_exercises.service';

@Module({
  imports: [TypeOrmModule.forFeature([RoutineExercises]), UtilsModule],
  controllers: [RoutineExercisesController],
  providers: [RoutineExercisesService],
  exports: [RoutineExercisesService],
})
export class RoutineExercisesModule {}
