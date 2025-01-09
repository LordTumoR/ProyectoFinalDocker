import { routine } from 'src/routine/routine.entity';
import { RoutineExercises } from 'src/rutina_ejercicios/routine_exercises.entity';
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

  @Column({ nullable: true })  
  password: string;

  @Column({ unique: true })
  email: string;

  @Column('int', { nullable: true }) 
  weight: number;

  @Column({ nullable: true }) 
  dateofbirth: string;

  @Column({ nullable: true })  
  sex: string;

  @Column('int', { nullable: true }) 
  height: number;

  @Column({ default: 0 })
  role: number;

  @Column({ nullable: true }) 
  avatar: string;

  @OneToMany(() => routine, (routine) => routine.user)
  routines: routine[];

  @OneToMany(() => RoutineExercises, (routineExercises) => routineExercises.user,{
    cascade: true,
    onDelete:'CASCADE',
  })
  routines_exercises: RoutineExercises[];
}
