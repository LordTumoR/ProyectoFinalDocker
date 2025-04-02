import { Routine } from '../routine/routine.entity';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';

  
  @Entity('upload')
  export class UploadEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    path: string;
  
    @Column()
    name: string;
  
    @ManyToOne(
      () => Routine,
      (routine) => routine.uploads,
      {
        onDelete: 'CASCADE',
      },
    )
    @JoinColumn({ name: 'id_routine' })
    Routine: Routine; // Cambiado a Routine
  }