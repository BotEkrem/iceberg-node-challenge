import {IsEnum, IsNotEmpty, IsNumber, IsString} from "class-validator";
import {TimeRange} from "@/elastic/queries";

export class UserStatsDto {
  @IsEnum(TimeRange)
  @IsNotEmpty()
  range: TimeRange;

  @IsNumber()
  @IsNotEmpty()
  size: number;
}