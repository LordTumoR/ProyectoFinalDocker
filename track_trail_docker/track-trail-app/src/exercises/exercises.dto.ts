import {
  IsString,
  IsOptional,
  IsInt,
  Length,
} from 'class-validator';

export class CreateExerciseDto {
  @IsOptional()
  @IsInt()
  id_exercises?: number;

  @IsString()
  @Length(1, 500)
  name: string;

  @IsString()
  @Length(1, 1000)
  description: string;

  @IsString()
  images: string;
}

export class UpdateExerciseDto {
  @IsOptional()
  @IsInt()
  id_exercises?: number;

  @IsString()
  @IsOptional()
  @Length(1, 500)
  name?: string;

  @IsString()
  @IsOptional()
  @Length(1, 1000)
  description?: string;

  @IsString()
  @IsOptional()
  images?: string;
}
