import { RoutineExercises } from '../rutina_ejercicios/routine_exercises.entity';
import { UploadEntity } from '../upload/upload.entity';
import { User } from '../users/users.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Routine {
  @PrimaryGeneratedColumn()
  id_routine: number;

  @Column()
  name: string;

  @Column()
  goal: string;

  @Column()
  duration: number;

  @Column()
  private_public: boolean;

  @Column()
  dificulty: string;

  @Column()
  progress: string;
  
  @Column()
  imageurl: string;

  @Column({ default: false })
  isFavorite: boolean;

  @ManyToOne(() => User, (user) => user.routines,{
    cascade: true,
    onDelete:'CASCADE',
  })
  @JoinColumn({ name: 'id_user' })
  user: User;

  @OneToMany(() => RoutineExercises, (routineExercises) => routineExercises.routines)
  routines_exercises: RoutineExercises[];
  
  @OneToMany(() => UploadEntity, (upload) => upload.Routine)
  uploads: UploadEntity[];
}
