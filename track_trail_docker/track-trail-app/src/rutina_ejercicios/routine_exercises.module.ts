import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilsModule } from '../utils/utils.module';
import { RoutineExercisesController } from './routine_exercises.controller';
import { RoutineExercises } from './routine_exercises.entity';
import { RoutineExercisesService } from './routine_exercises.service';
import { UsersModule } from 'src/users/users.module';
import { RoutineModule } from 'src/routine/routine.module';


@Module({
  imports: [TypeOrmModule.forFeature([RoutineExercises]), UtilsModule,UsersModule,RoutineModule, ],
  controllers: [RoutineExercisesController],
  providers: [RoutineExercisesService],
  exports: [RoutineExercisesService],
})
export class RoutineExercisesModule {}