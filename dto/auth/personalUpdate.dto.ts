import {IsDateString, IsNotEmpty, IsString} from "class-validator";

export class PersonalUpdateDto {
  @IsString()
  @IsNotEmpty()
  fullName: string

  @IsString()
  @IsNotEmpty()
  username: string

  @IsDateString()
  @IsNotEmpty()
  birthday: Date
}