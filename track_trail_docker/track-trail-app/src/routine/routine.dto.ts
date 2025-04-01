import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsInt,
  IsBoolean,
  Length,
} from 'class-validator';

export class CreateRoutineDto {
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  id_routine?: number;

  @ApiProperty({ example: 'Entrenamiento Matutino' })
  @IsString()
  @Length(1, 500)
  name: string;

  @ApiProperty({ example: 'Aumentar la resistencia y la fuerza' })
  @IsString()
  @Length(1, 500)
  goal: string;

  @ApiProperty({ example: 60 })
  @IsInt()
  duration: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  private_public: boolean;

  @ApiProperty({ example: 'Intermedio' })
  @IsString()
  @Length(1, 100)
  dificulty: string;

  @ApiProperty({ example: '50%', required: false })
  @IsOptional()
  @IsString()
  progress?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  id_user?: number;
  
  @ApiProperty({ example: 'https://asofgndfskpfodgn.com/imagen.png', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 800)
  imageurl?: string;

  @ApiProperty({ example: false, required: false })
    @IsOptional()
    @IsBoolean()
    isFavorite?: boolean;
}

export class UpdateRoutineDto {
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  id_routine?: number;

  @ApiProperty({ example: 'Entrenamiento Vespertino', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 500)
  name?: string;

  @ApiProperty({ example: 'Desarrollar fuerza y flexibilidad', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 500)
  goal?: string;

  @ApiProperty({ example: 45, required: false })
  @IsOptional()
  @IsInt()
  duration?: number;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  private_public?: boolean;

  @ApiProperty({ example: 'Avanzado', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  dificulty?: string;

  @ApiProperty({ example: '50%', required: false })
  @IsOptional()
  @IsString()
  progress?: string;

  @ApiProperty({ example: 'https://asofgndfskpfodgn.com/imagen.png', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 800)
  imageurl?: string;

  @ApiProperty({ example: false, required: false })
    @IsOptional()
    @IsBoolean()
    isFavorite?: boolean;
}
