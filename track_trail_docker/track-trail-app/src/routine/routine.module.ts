import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilsModule } from '../utils/utils.module';
import { RoutineController } from './routine.controller';
import { routine } from './routine.entity';
import { RoutineService } from './routine.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([routine]), UtilsModule, UsersModule],
  controllers: [RoutineController],
  providers: [RoutineService],
  exports: [RoutineService],
})
export class RoutineModule {}
