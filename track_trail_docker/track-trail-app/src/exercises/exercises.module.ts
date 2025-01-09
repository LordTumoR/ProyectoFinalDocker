import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilsModule } from '../utils/utils.module';
import { ExercisesController } from './exercises.controller';
import { Exercise } from './exercises.entity';
import { ExercisesService } from './exercises.service';

@Module({
  imports: [TypeOrmModule.forFeature([Exercise]), UtilsModule],
  controllers: [ExercisesController],
  providers: [ExercisesService],
  exports: [ExercisesService],
})
export class ExercisesModule {}
