import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';

import { Food } from '../food/food.entity';
import { NutritionRecord } from '../nutrition_record/nutrition_record.entity';

@Entity()
export class NutritionFood {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => NutritionRecord, (nutritionRecord) => nutritionRecord.nutritionFoods, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'nutritionRecord_id' })
  nutritionRecord: NutritionRecord;

  @ManyToOne(() => Food, (food) => food.nutritionFoods, { eager: true })
  @JoinColumn({ name: 'food_id' })
  food: Food;

  @Column('float')
  amount: number;
}
