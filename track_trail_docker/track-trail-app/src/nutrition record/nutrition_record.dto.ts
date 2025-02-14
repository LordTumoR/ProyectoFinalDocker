import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsDateString,
  Min,
  IsArray,
  ArrayMinSize,
  ValidateNested,
  IsNotEmpty,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer'; 
import { CreateNutritionFoodDto } from 'src/nutrition_food/nutritionfood.dto';

export class CreateNutritionRecordDto {
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  id?: number;

  @ApiProperty({ example: 'Registro de Nutrición', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Registro diario de alimentos consumidos', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 123 })
  @IsInt()
  user_id: number;

  @ApiProperty({
    example: [
      {
        id: 1,
        foodName: 'Manzana',
        quantity: 1,
        calories: 95,
      },
    ],
    isArray: true,
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateNutritionFoodDto)
  nutritionFoods: CreateNutritionFoodDto[];

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', required: false })
  @IsOptional()
  @IsDate()
  date?: Date;
}

export class UpdateNutritionRecordDto {
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  id?: number;

  @ApiProperty({ example: 'Registro actualizado', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Registro actualizado de alimentos', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 123, required: false })
  @IsOptional()
  @IsInt()
  user_id?: number;

  @ApiProperty({
    example: [
      {
        id: 1,
        foodName: 'Manzana',
        quantity: 1,
        calories: 95,
      },
    ],
    isArray: true,
    required: false,
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateNutritionFoodDto) 
  nutritionFoods?: CreateNutritionFoodDto[];

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', required: false })
  @IsOptional()
  @IsDate()
  date?: Date;
}
