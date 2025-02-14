import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadController } from './upload.controller';
import { UploadEntity } from './upload.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { UploadService } from './upload.services';
import { Routine } from 'src/routine/routine.entity';
import { RoutineModule } from 'src/routine/routine.module';
import { RoutineService } from 'src/routine/routine.service';
import { UtilsService } from 'src/utils/utils.service';
import { UtilsModule } from 'src/utils/utils.module';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
@Module({
  imports: [
    UsersModule,
    UtilsModule,
    RoutineModule,
    TypeOrmModule.forFeature([UploadEntity, Routine]),
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