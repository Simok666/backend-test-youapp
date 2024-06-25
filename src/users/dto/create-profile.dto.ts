import {
  IsNotEmpty,
  IsString,
  IsDate,
  IsNumber,
  IsOptional,
  IsEnum,
} from 'class-validator';

export class CreateProfileDto {
  @IsOptional()
  @IsString()
  image: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(['male', 'female', 'other'])
  gender: string;

  @IsNotEmpty()
  @IsDate()
  birthday: Date;

  @IsNotEmpty()
  @IsString()
  horoscope: string;

  @IsOptional()
  @IsNumber()
  height: number;

  @IsOptional()
  @IsNumber()
  weight: number;
}
