// user.dto.ts
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
  @IsOptional()
  @IsInt()
  id_user?: number;

  @IsString()
  @Length(1, 500)
  name: string;

  @IsString()
  @Length(1, 500)
  surname: string;

  @IsString()
  password: string;

  @IsEmail()
  email: string;

  @IsInt()
  weight: number;
  
  @IsString()
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'dateofbirth must be in format YYYY-MM-DD',
  })
  dateofbirth: string;
  
  @IsString()
  sex: string;
  
  @IsInt()
  height: number;

  @IsInt()
  @Min(0)
  @Max(2)
  role: number;

  @IsString()
  avatar: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsInt()
  id_user?: number;

  @IsString()
  @IsOptional()
  @Length(1, 50)
  name?: string;

  @IsString()
  @IsOptional()
  @Length(1, 50)
  surname?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsInt()
  @IsOptional()
  weight?: number;
  
  @IsString()
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'dateofbirth tiene que ser YYYY-MM-DD',
  })
  dateofbirth?: string;
  
  @IsString()
  @IsOptional()
  sex?: string;
  
  @IsInt()
  @IsOptional()
  height?: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  @Max(1)
  role?: number;

  @IsOptional()
  @IsString()
  avatar: string;

}
