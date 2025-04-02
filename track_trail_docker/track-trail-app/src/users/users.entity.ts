import { NutritionRecord } from '../nutrition_record/nutrition_record.entity';
import { Routine } from '../routine/routine.entity';
import { RoutineExercises } from '../rutina_ejercicios/routine_exercises.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id_user: number;

  @Column({ nullable: true }) 
  name: string;

  @Column({ nullable: true }) 
  surname: string;

  @Column({ unique: true })
  email: string;

  @Column('double', { nullable: true }) 
  weight: number;
  
  @Column('double', { nullable: true }) 
  height: number;
  

  @Column({ nullable: true })  
  token: string;

  @Column({ type: 'date', nullable: true }) 
dateofbirth: Date;


  @Column({ nullable: true })  
  sex: string;

  @Column({ default: 0 })
  role: number;

  @Column({ nullable: true }) 
  avatar: string;

  @OneToMany(() => Routine, (routine) => routine.user)
  routines: Routine[];

  @OneToMany(() => RoutineExercises, (routineExercises) => routineExercises.user,{
    cascade: true,
    onDelete:'CASCADE',
  })
  routines_exercises: RoutineExercises[];

  @OneToMany(() => NutritionRecord, (nutritionRecord) => nutritionRecord.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  nutritionRecords: NutritionRecord[]; 
  
}
