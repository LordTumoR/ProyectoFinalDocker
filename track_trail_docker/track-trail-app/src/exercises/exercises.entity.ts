import { Progress } from '../progress/progress.entity';
import { RoutineExercises } from '../rutina_ejercicios/routine_exercises.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Exercise {
  @PrimaryGeneratedColumn()
  id_exercises: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  images: string;

  @Column()
  dateTime: Date;

  @OneToMany(() => Progress, (progress) => progress.exercise, {
    cascade: true,
  })
  progress_records: Progress[];
  

  @OneToMany(() => RoutineExercises, (routineExercises) => routineExercises.ejercicios)
  routines_exercises: RoutineExercises[];

  @Column()
  repetitions: number;

  @Column()
  weight: number;

  @Column()
  muscleGroup: string;
  
  @Column()
  sets: number;


}
