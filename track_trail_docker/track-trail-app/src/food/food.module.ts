import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Food } from '../food/food.entity';
import { UsersModule } from '../users/users.module';
import { UtilsModule } from '../utils/utils.module';
import { FoodController } from './food.controller';
import { FoodService } from './food.service';


@Module({
  imports: [TypeOrmModule.forFeature([Food]),UtilsModule ,UsersModule],
  controllers: [FoodController],
  providers: [FoodService],
  exports: [FoodService],
})
export class FoodModule {}
