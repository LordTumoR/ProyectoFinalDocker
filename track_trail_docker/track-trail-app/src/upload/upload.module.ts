import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadController } from './upload.controller';
import { UploadEntity } from './upload.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { UploadService } from './upload.services';
import { Routine } from '../routine/routine.entity';
import { RoutineModule } from '../routine/routine.module';
import { RoutineService } from '../routine/routine.service';
import { UtilsService } from '../utils/utils.service';
import { UtilsModule } from '../utils/utils.module';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { Exercise } from '../exercises/exercises.entity';
import { RoutineExercises } from '../rutina_ejercicios/routine_exercises.entity';
import { Progress } from '../progress/progress.entity';
@Module({
  imports: [
    UsersModule,
    UtilsModule,
    RoutineModule,
    TypeOrmModule.forFeature([UploadEntity, Routine, Exercise,RoutineExercises,Progress]), 
    ServeStaticModule.forRoot({
      rootPath: path.resolve('./src/upload/img'),
      serveRoot: '/upload',
    }),
  ],
  exports: [TypeOrmModule],
  controllers: [UploadController],
  providers: [UploadService, RoutineService, UtilsService,UsersService],
})
export class UploadModule {}