import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from 'src/users/users.entity';
import { NutritionFood } from 'src/nutrition_food/nutritionfood.entity';

@Entity()
export class NutritionRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User, (user) => user.nutritionRecords, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => NutritionFood, (nutritionFood) => nutritionFood.nutritionRecord, { cascade: true })
  nutritionFoods: NutritionFood[];

  @Column({ type: 'date', nullable: true })
  date: Date | null;
}
