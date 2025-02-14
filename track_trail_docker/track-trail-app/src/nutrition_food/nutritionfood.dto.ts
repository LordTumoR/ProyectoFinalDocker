import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateNutritionFoodDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  nutritionRecordId: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  foodId: number;

  @ApiProperty({ example: 150.5 })
  @IsNumber()
  @Min(0)
  amount: number;
}

export class UpdateNutritionFoodDto {
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  id?: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  nutritionRecordId?: number;

  @ApiProperty({ example: 2, required: false })
  @IsOptional()
  @IsInt()
  foodId?: number;

  @ApiProperty({ example: 150.5, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;
}
