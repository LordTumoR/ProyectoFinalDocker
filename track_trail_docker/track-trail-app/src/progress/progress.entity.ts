import { Exercise } from 'src/exercises/exercises.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';

@Entity()
export class Progress {
  @PrimaryGeneratedColumn()
  id_progress: number;

  @ManyToOne(() => Exercise, (exercise) => exercise.id_exercises, { eager: true })
  exercise: Exercise; 

  @CreateDateColumn()
  date: Date; 

  @Column({ nullable: true })
  notes: string; 

  @Column({ default: false })
  is_personal_record: boolean; 
}
