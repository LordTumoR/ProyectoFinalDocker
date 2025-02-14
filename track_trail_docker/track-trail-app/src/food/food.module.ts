import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Food } from 'src/food/food.entity';
import { UsersModule } from 'src/users/users.module';
import { UtilsModule } from 'src/utils/utils.module';
import { FoodController } from './food.controller';
import { FoodService } from './food.service';


@Module({
  imports: [TypeOrmModule.forFeature([Food]),UtilsModule ,UsersModule],
  controllers: [FoodController],
  providers: [FoodService],
  exports: [FoodService],
})
export class FoodModule {}
