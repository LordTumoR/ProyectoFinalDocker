import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UtilsModule } from '../utils/utils.module';
import { User } from './users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [UtilsModule, TypeOrmModule.forFeature([User])],
  exports: [TypeOrmModule,UsersService],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
