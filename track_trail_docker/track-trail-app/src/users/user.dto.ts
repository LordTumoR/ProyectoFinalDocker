import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsOptional,
  IsInt,
  IsNumber,
  Min,
  Max,
  Length,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  id_user?: number;

  @ApiProperty({ example: 'Juan' })
  @IsString()
  @Length(1, 500)
  name: string;

  @ApiProperty({ example: 'Pérez' })
  @IsString()
  @Length(1, 500)
  surname: string;

  @ApiProperty({ example: 'juan.perez@ejemplo.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 70.5 })
  @IsNumber()
  weight: number;

  @ApiProperty({ example: 'token-abc123' })
  @IsString()
  token: string;
  
  @ApiProperty({ example: '1990-01-01', required: false, description: 'Formato YYYY-MM-DD' })
  @IsOptional()
  dateofbirth: Date;
  
  @ApiProperty({ example: 'masculino' })
  @IsString()
  sex: string;
  
  @ApiProperty({ example: 175.2 })
  @IsNumber()
  height: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(0)
  @Max(2)
  role: number;

  @ApiProperty({ example: 'https://example.com/avatar.jpg' })
  @IsString()
  avatar: string;
}

export class UpdateUserDto {
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  id_user?: number;

  @ApiProperty({ example: 'Juan', required: false })
  @IsString()
  @IsOptional()
  @Length(1, 50)
  name?: string;

  @ApiProperty({ example: 'Pérez', required: false })
  @IsString()
  @IsOptional()
  @Length(1, 50)
  surname?: string;

  @ApiProperty({ example: 'juan.perez@ejemplo.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 70.5, required: false })
  @IsNumber()
  @IsOptional()
  weight?: number;

  @ApiProperty({ example: 'nuevo-token-abc123', required: false })
  @IsString()
  @IsOptional()
  token?: string;

  @ApiProperty({ example: '1990-01-01', required: false, description: 'Formato YYYY-MM-DD' })
  @IsOptional()
  dateofbirth?: Date;
  
  @ApiProperty({ example: 'masculino', required: false })
  @IsString()
  @IsOptional()
  sex?: string;
  
  @ApiProperty({ example: 175.2, required: false })
  @IsNumber()
  @IsOptional()
  height?: number;

  @ApiProperty({ example: 1, required: false })
  @IsInt()
  @IsOptional()
  @Min(0)
  @Max(1)
  role?: number;

  @ApiProperty({ example: 'https://example.com/avatar-nuevo.jpg', required: false })
  @IsOptional()
  @IsString()
  avatar?: string;
}