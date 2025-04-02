import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
import { Food } from '../food/food.entity';
import { NutritionRecord } from './nutrition_record.entity';
import { NutritionRecordController } from './nutrition_record.controller';
import { NutritionRecordService } from './nutrition_record.service';
import { NutritionFood } from '../nutrition_food/nutritionfood.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([NutritionRecord, User, Food, NutritionFood]),
  ],
  controllers: [NutritionRecordController],
  providers: [NutritionRecordService],
  exports: [NutritionRecordService],
})
export class NutritionRecordModule {}
