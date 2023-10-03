import { IsNotEmpty, IsString, isBoolean } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  public name: string;
}
