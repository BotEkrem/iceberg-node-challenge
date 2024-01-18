import {IsNotEmpty, IsString, Matches} from "class-validator";
import {Match} from "@/misc/decorators/match.decorator";

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  fullName: string

  @IsString()
  @IsNotEmpty()
  email: string

  @IsString()
  // Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
  @IsNotEmpty()
  password: string

  @IsString()
  @Match('password', { message: "Passwords must be matched." })
  @IsNotEmpty()
  confirmPassword: string
}