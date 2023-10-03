import { IsString, IsNumber, IsNotEmpty } from "class-validator";

export class CreateDepositDto {
  @IsString()
  @IsNotEmpty()
  public user_id: string;

  @IsNumber()
  @IsNotEmpty()
  public amount: number;
}
