import { IsString, IsNumber, IsNotEmpty } from "class-validator";

export class CreateAuctionDto {
  @IsString()
  @IsNotEmpty()
  public user_id: string;

  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsNumber()
  @IsNotEmpty()
  public started_price: number;

  @IsNumber()
  @IsNotEmpty()
  public time_window: number;


  // @IsNumber()
  // @IsNotEmpty()
  // public status: number;
}
