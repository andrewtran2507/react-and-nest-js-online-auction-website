import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  public name: string;

  @IsString()
  @IsNotEmpty()
  public password: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  public email: string;
}
