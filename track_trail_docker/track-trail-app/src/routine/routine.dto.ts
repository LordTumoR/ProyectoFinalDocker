import {
  IsString,
  IsOptional,
  IsInt,
  IsBoolean,
  Length,
} from 'class-validator';

export class CreateRoutineDto {
  @IsOptional()
  @IsInt()
  id_routine?: number;

  @IsString()
  @Length(1, 500)
  name: string;

  @IsString()
  @Length(1, 500)
  goal: string;

  @IsInt()
  duration: number;

  @IsBoolean()
  private_public: boolean;

  @IsString()
  @Length(1, 100)
  dificulty: string;

  @IsInt()
  @IsOptional()  
  id_user?: number;
}

export class UpdateRoutineDto {
  @IsOptional()
  @IsInt()
  id_routine?: number;

  @IsString()
  @IsOptional()
  @Length(1, 500)
  name?: string;

  @IsString()
  @IsOptional()
  @Length(1, 500)
  goal?: string;

  @IsInt()
  @IsOptional()
  duration?: number;

  @IsBoolean()
  @IsOptional()
  private_public?: boolean;

  @IsString()
  @IsOptional()
  @Length(1, 100)
  dificulty?: string;
}
