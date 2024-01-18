import {IsNotEmpty, IsString, Matches} from "class-validator";

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  email: string

  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
  @IsNotEmpty()
  password: string
}