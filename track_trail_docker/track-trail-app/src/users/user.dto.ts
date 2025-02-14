// user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsOptional,
  IsInt,
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

  @ApiProperty({ example: 70 })
  @IsInt()
  weight: number;

  @ApiProperty({ example: 'token-abc123' })
  @IsString()
  token: string;
  
  @ApiProperty({ example: '1990-01-01', required: false, description: 'Formato YYYY-MM-DD' })
  @IsString()
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'dateofbirth must be in format YYYY-MM-DD',
  })
  dateofbirth: string;
  
  @ApiProperty({ example: 'masculino' })
  @IsString()
  sex: string;
  
  @ApiProperty({ example: 175 })
  @IsInt()
  height: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(0)
  @Max(2)
  role: number;

  @ApiProperty({ example: 'https://asofgndfskpfodgn.com/avatar.jpg' })
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

  @ApiProperty({ example: 70, required: false })
  @IsInt()
  @IsOptional()
  weight?: number;

  @ApiProperty({ example: 'nuevo-token-abc123', required: false })
  @IsString()
  @IsOptional()
  token?: string;

  @ApiProperty({ example: '1990-01-01', required: false, description: 'Formato YYYY-MM-DD' })
  @IsString()
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'dateofbirth tiene que ser YYYY-MM-DD',
  })
  dateofbirth?: string;
  
  @ApiProperty({ example: 'masculino', required: false })
  @IsString()
  @IsOptional()
  sex?: string;
  
  @ApiProperty({ example: 175, required: false })
  @IsInt()
  @IsOptional()
  height?: number;

  @ApiProperty({ example: 1, required: false })
  @IsInt()
  @IsOptional()
  @Min(0)
  @Max(1)
  role?: number;

  @ApiProperty({ example: 'https://asofgndfskpfodgn.com/avatar-nuevo.jpg', required: false })
  @IsOptional()
  @IsString()
  avatar?: string;
}
