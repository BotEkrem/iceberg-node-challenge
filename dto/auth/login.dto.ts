import {IsNotEmpty, IsString, Matches} from "class-validator";

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  email: string

  @IsString()
  // Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
  @IsNotEmpty()
  password: string
}