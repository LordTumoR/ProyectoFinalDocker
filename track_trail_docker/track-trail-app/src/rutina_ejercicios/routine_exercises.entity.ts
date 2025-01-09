import { Exercise } from 'src/exercises/exercises.entity';
import { routine } from 'src/routine/routine.entity';
import { User } from 'src/users/users.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class RoutineExercises {
  @PrimaryGeneratedColumn()
  id_routine_exercise: number;

  @Column({ nullable: true })
  date_start: Date;

  @Column({ nullable: true })
  date_finish: Date;

  @ManyToOne(() => User, (user) => user.routines_exercises,)
  @JoinColumn({ name: 'id_user' })
  user: User;
  
  @ManyToOne(() => routine, (routine) => routine.routines_exercises,{
    cascade: true,
    onDelete:'CASCADE',
  })
  @JoinColumn({ name: 'id_routine' })
  routines: routine;
  @ManyToOne(() => Exercise, (exercise) => exercise.routines_exercises, { 
    cascade: true,
    onDelete:'CASCADE',
    nullable: true })
  @JoinColumn({ name: 'id_exercise' })
  ejercicios: Exercise;
}
