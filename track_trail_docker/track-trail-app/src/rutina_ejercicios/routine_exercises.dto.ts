import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsInt,
  IsDate,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRoutineExercisesDto {
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  id_routine_exercise?: number;

  @ApiProperty({ example: '2023-01-01T08:00:00.000Z', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date_start?: Date;

  @ApiProperty({ example: '2023-01-01T09:00:00.000Z', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date_finish?: Date;

  @ApiProperty({ example: 123 })
  @IsInt()
  id_user: number;

  @ApiProperty({ example: 45 })
  @IsInt()
  id_routine: number;

  @ApiProperty({ example: 3, required: false })
  @IsOptional()
  @IsInt()
  id_exercise?: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional() 
  @IsBoolean()
  completado?: boolean;
}

export class UpdateRoutineExercisesDto {
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  id_routine_exercise?: number;

  @ApiProperty({ example: '2023-01-01T08:00:00.000Z', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date_start?: Date;

  @ApiProperty({ example: '2023-01-01T09:00:00.000Z', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date_finish?: Date;

  @ApiProperty({ example: 123, required: false })
  @IsOptional()
  @IsInt()
  id_user?: number;

  @ApiProperty({ example: 45, required: false })
  @IsOptional()
  @IsInt()
  id_routine?: number;

  @ApiProperty({ example: 3, required: false })
  @IsOptional()
  @IsInt()
  id_exercise?: number;

  @ApiProperty({ example: false, required: false })
  @IsOptional() 
  @IsBoolean()
  completado?: boolean;
}
