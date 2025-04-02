import { IsBoolean, IsOptional, IsDate, IsString } from 'class-validator';
import { Exercise } from '../exercises/exercises.entity';

export class ProgressDTO {
  @IsOptional() 
  id_progress?: number; 

  @IsDate()
  date: Date;

  @IsString()
  @IsOptional() 
  notes?: string; 

  @IsBoolean()
  is_personal_record: boolean;

  exercise: Exercise;
}
