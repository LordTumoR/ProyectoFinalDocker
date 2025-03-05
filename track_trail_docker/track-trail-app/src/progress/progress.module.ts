import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilsModule } from '../utils/utils.module';
import { Progress } from './progress.entity'; // La entidad Progress
import { Exercise } from 'src/exercises/exercises.entity';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([Progress, Exercise]), 
    UtilsModule,
  ],
  controllers: [ProgressController], 
  providers: [ProgressService], 
  exports: [ProgressService], 
})
export class ProgressModule {}
