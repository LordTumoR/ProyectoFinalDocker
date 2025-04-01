import { IsDate } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsInt,
  IsNumber,
  Min,
  Length,
} from 'class-validator';

export class CreateFoodDto {
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  id?: number;

  @ApiProperty({ example: 'Manzana', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'La Huerta', required: false })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiProperty({ example: 'Fruta', required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ example: 95 })
  @IsNumber()
  @Min(0)
  calories: number;

  @ApiProperty({ example: 25 })
  @IsNumber()
  @Min(0)
  carbohydrates: number;

  @ApiProperty({ example: 0.5 })
  @IsNumber()
  @Min(0)
  proteins: number;

  @ApiProperty({ example: 0.3 })
  @IsNumber()
  @Min(0)
  fats: number;

  @ApiProperty({ example: 4.4, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  fiber?: number;

  @ApiProperty({ example: 19, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  sugar?: number;

  @ApiProperty({ example: 2, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  sodium?: number;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  cholesterol?: number;

  @ApiProperty({ example: 'Desayuno', required: false })
  @IsOptional()
  @IsString()
  mealtype?: string;

  @ApiProperty({
      example: '2023-01-01T00:00:00.000Z',
    })
    @IsDate()
    dateTime: Date;

  @ApiProperty({ example: 'https://asofgndfskpfodgn.com/imagen.png', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 800)
  imageurl?: string;
}

export class UpdateFoodDto {
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  id?: number;

  @ApiProperty({ example: 'Manzana', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 500)
  name?: string;

  @ApiProperty({ example: 'La Huerta', required: false })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiProperty({ example: 'Fruta', required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ example: 95, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  calories?: number;

  @ApiProperty({ example: 25, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  carbohydrates?: number;

  @ApiProperty({ example: 0.5, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  proteins?: number;

  @ApiProperty({ example: 0.3, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  fats?: number;

  @ApiProperty({ example: 4.4, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  fiber?: number;

  @ApiProperty({ example: 19, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  sugar?: number;

  @ApiProperty({ example: 2, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  sodium?: number;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  cholesterol?: number;
  
  @ApiProperty({ example: 'Desayuno', required: false })
  @IsOptional()
  @IsString()
  mealtype?: string;

  @ApiProperty({
      example: '2023-01-01T00:00:00.000Z',
    })
    @IsDate()
    dateTime: Date;

    @ApiProperty({ example: 'https://asofgndfskpfodgn.com/imagen.png', required: false })
    @IsOptional()
    @IsString()
    @Length(1, 800)
    imageurl?: string;
}
