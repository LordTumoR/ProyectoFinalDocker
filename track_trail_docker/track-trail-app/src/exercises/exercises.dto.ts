import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsInt,
  Length,
  IsDate,
  IsNumber,
} from 'class-validator';

export class CreateExerciseDto {
  @ApiProperty({ example: null })
  @IsOptional()
  @IsInt()
  id_exercises?: number;

  @ApiProperty({ example: 'Push-up' })
  @IsString()
  @Length(1, 40)
  name: string;

  @ApiProperty({
    example: 'Un ejercicio clásico que trabaja el pecho y los brazos.',
  })
  @IsString()
  @Length(1, 1000)
  description: string;

  @ApiProperty({
    example: 'https://asofgndfskpfodgn.com/images/pushup.png',
  })
  @IsString()
  images: string;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
  })
  @IsDate()
  dateTime: Date;

  @ApiProperty({
    example: '10',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  repetitions?: number;

  @ApiProperty({
    example: '10',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  weight?: number;
  @ApiProperty({
    example: '10',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  sets?: number;
  @ApiProperty({ example: 'Biceps' })
  @IsString()
  @Length(1, 40)
  muscleGroup: string;
}

export class UpdateExerciseDto {
  @ApiProperty({ example: null, required: false })
  @IsOptional()
  @IsInt()
  id_exercises?: number;

  @ApiProperty({ example: 'Push-up avanzado', required: false })
  @IsString()
  @IsOptional()
  @Length(1, 500)
  name?: string;

  @ApiProperty({
    example:
      'Una versión avanzada del push-up para incrementar la dificultad del ejercicio.',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(1, 1000)
  description?: string;

  @ApiProperty({
    example: 'https://asofgndfskpfodgn.com/images/pushup-advanced.png',
    required: false,
  })
  @IsString()
  @IsOptional()
  images?: string;

  @ApiProperty({
    example: '2023-01-02T00:00:00.000Z',
    required: false,
  })
  @IsDate()
  @IsOptional()
  dateTime?: Date;

  @ApiProperty({
    example: '10',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  repetitions?: number;

  @ApiProperty({
    example: '10',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  weight?: number;

  @ApiProperty({ example: 'Biceps' })
  @IsString()
  @IsOptional()
  @Length(1, 40)
  muscleGroup: string;
  @ApiProperty({
    example: '10',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  sets?: number;
}
