import { IsString, IsNumber, IsNotEmpty } from "class-validator";

export class CreateBidDto {
  @IsString()
  @IsNotEmpty()
  public user_id: string;

  @IsString()
  @IsNotEmpty()
  public auction_id: string;

  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsNumber()
  @IsNotEmpty()
  public price: number;

  // @IsNumber()
  // @IsNotEmpty()
  // public status: number;
}
