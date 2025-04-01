import { NutritionFood } from 'src/nutrition_food/nutritionfood.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Food {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  brand: string;

  @Column({ nullable: true })
  category: string;

  @Column('float', { nullable: true })
  calories: number; 

  @Column('float', { nullable: true })
  carbohydrates: number; 

  @Column('float', { nullable: true })
  protein: number;

  @Column('float', { nullable: true })
  fat: number; 

  @Column('float', { nullable: true })
  fiber: number; 

  @Column('float', { nullable: true })
  sugar: number; 

  @Column('float', { nullable: true })
  sodium: number;

  @Column('float', { nullable: true })
  cholesterol: number; 

  @Column({ nullable: true })
  mealtype: string;

  @Column()
  date: Date;
  
  @Column({ nullable: true })
  imageurl: string;

  @OneToMany(() => NutritionFood, (nutritionFood) => nutritionFood.food)
  nutritionFoods: NutritionFood[];
}
