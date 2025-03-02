import { RoutineExercises } from 'src/rutina_ejercicios/routine_exercises.entity';
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

  @OneToMany(() => RoutineExercises, (routineExercises) => routineExercises.ejercicios)
  routines_exercises: RoutineExercises[];

  @Column()
  repetitions: number;

  @Column()
  weigth: number;

}
