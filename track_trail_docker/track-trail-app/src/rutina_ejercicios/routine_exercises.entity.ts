import { Exercise } from '../exercises/exercises.entity';
import { Routine } from '../routine/routine.entity';
import { User } from '../users/users.entity';
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
  @Column({ default: false }) 
  completado: boolean;

  @ManyToOne(() => User, (user) => user.routines_exercises,)
  @JoinColumn({ name: 'id_user' })
  user: User;
  
  @ManyToOne(() => Routine, (Routine) => Routine.routines_exercises,{
    cascade: true,
    onDelete:'CASCADE',
  })
  @JoinColumn({ name: 'id_routine' })
  routines: Routine;
  @ManyToOne(() => Exercise, (exercise) => exercise.routines_exercises, { 
    cascade: true,
    onDelete:'CASCADE',
    nullable: true })
  @JoinColumn({ name: 'id_exercise' })
  ejercicios: Exercise;
}
