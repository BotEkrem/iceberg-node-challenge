import {Strategy as LocalStrategy} from "passport-local";
import * as argon2 from "argon2";

import {AppDataSource} from "@/db/data-source";
import {User} from "@/entities/user.entity";
import {LoginDto} from "@/dto/auth/login.dto";
import {validationCheck} from "@/misc/functions/validation";
import {ErrorObject} from "@/misc/interfaces/errorObject";
import * as jwt from "jsonwebtoken";

export default function (passport) {
  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
      },
      async (req, takenEmail, takenPassword, done) => {
        try {
          const loginData = new LoginDto()
          loginData.email = takenEmail
          loginData.password = takenPassword

          const dataCheck = await validationCheck<LoginDto>(loginData) as LoginDto

          if (!dataCheck.email) {
            done((dataCheck as unknown as ErrorObject).errors, false);
          }

          const userRepository = AppDataSource.getRepository(User)

          const user = await userRepository.findOneBy({email: takenEmail});
          if (!user) return done(null, false);

          const isMatch = await argon2.verify(user.password, takenPassword);
          if (!isMatch) return done(null, false);

          user.lastLoginDate = new Date()
          user.ipAddress = req.ip
          const {password, previousPassword, ...data} = user
          await userRepository.update({id: user.id}, data)

          return done(null, jwt.sign({
            id: user.id,
            email: user.email
          }, process.env.JWT_SECRET as string, {expiresIn: "1h"}));
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );
  // REGISTER
};