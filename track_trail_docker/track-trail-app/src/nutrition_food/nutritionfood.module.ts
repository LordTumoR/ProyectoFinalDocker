import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NutritionFood } from './nutritionfood.entity';
import { NutritionFoodController } from './nutritionfood.controller';
import { NutritionFoodService } from './nutritionfood.service';
import { NutritionRecord } from 'src/nutrition record/nutrition_record.entity';
import { Food } from 'src/food/food.entity';
import { User } from 'src/users/users.entity';
import { NutritionRecordModule } from 'src/nutrition record/nutrition_record.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([NutritionFood, NutritionRecord, Food,User]),
    NutritionRecordModule,UsersModule
  ],
  controllers: [NutritionFoodController],
  providers: [NutritionFoodService],
  exports: [NutritionFoodService],
})
export class NutritionFoodModule {}
