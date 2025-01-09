import {
  IsString,
  IsOptional,
  IsInt,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRoutineExercisesDto {
  @IsOptional()
  @IsInt()
  id_routine_exercise?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date_start?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date_finish?: Date;

  @IsInt()
  id_user: number;

  @IsInt()
  id_routine: number;

  @IsOptional()
  @IsInt()
  id_exercise?: number; 
}

export class UpdateRoutineExercisesDto {
  @IsOptional()
  @IsInt()
  id_routine_exercise?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date_start?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date_finish?: Date;

  @IsOptional()
  @IsInt()
  id_user?: number;

  @IsOptional()
  @IsInt()
  id_routine?: number;

  @IsOptional()
  @IsInt()
  id_exercise?: number;  // Ahora es opcional
}
