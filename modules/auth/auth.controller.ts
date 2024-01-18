import * as express from "express";
import {Request, Response, NextFunction} from "express";
import * as passport from "passport";
import {RegisterDto} from "@/dto/auth/register.dto";
import {validationCheck} from "@/misc/functions/validation";
import {ErrorObject} from "@/misc/interfaces/errorObject";
import {AppDataSource} from "@/db/data-source";
import {User} from "@/entities/user.entity";
import {PersonalUpdateDto} from "@/dto/auth/personalUpdate.dto";
import {SecurityUpdateDto} from "@/dto/auth/securityUpdate.dto";

const router = express.Router()
const userRepository = AppDataSource.getRepository(User)

router.post("/register", async (req: Request, res: Response, next: NextFunction) => {
  const registerData = new RegisterDto()
  registerData.fullName = req.body.fullName
  registerData.email = req.body.email
  registerData.password = req.body.password
  registerData.confirmPassword = req.body.confirmPassword

  const dataCheck = await validationCheck<RegisterDto>(registerData) as RegisterDto

  if (!dataCheck.email) {
    return res.status(422).json({
      errors: (dataCheck as unknown as ErrorObject).errors
    });
  }

  const user = await userRepository.findOneBy({email: registerData.email});

  if (user?.email) {
    return res.status(422).json({
      errors: ["This email was already used by someone."]
    })
  }

  const insertData = await userRepository.save(userRepository.create({
    username: registerData.fullName.split(" ").join("") + "-" + registerData.email,
    fullName: registerData.fullName,
    email: registerData.email,
    password: registerData.password,
  }))

  res.json({
    isRegistered: true
  })
});

router.post(
  "/login",
  passport.authenticate("login", {session: false}),
  (req, res, next) => {
    res.json({token: req.user});
  }
);

router.get("/me", async (req: Request, res: Response, next: NextFunction) => {
  res.json(req.user)
});

router.patch("/personal", async (req: Request, res: Response, next: NextFunction) => {
  const personalUpdateData = new PersonalUpdateDto()
  personalUpdateData.fullName = req.body.fullName
  personalUpdateData.username = req.body.username
  personalUpdateData.birthday = req.body.birthday

  const dataCheck = await validationCheck<PersonalUpdateDto>(personalUpdateData) as PersonalUpdateDto

  if (!dataCheck.fullName) {
    return res.status(422).json({
      errors: (dataCheck as unknown as ErrorObject).errors
    });
  }

  const user = await userRepository.findOneBy({username: personalUpdateData.username});

  if (user?.username) {
    return res.status(422).json({
      errors: ["This username was already used by someone."]
    })
  }

  const updateData = await userRepository.update({
    id: Number(req.user.id)
  }, {
    fullName: personalUpdateData.fullName,
    username: personalUpdateData.username,
    birthday: personalUpdateData.birthday
  })

  res.json({
    isUpdated: true
  })
});

router.patch("/security", async (req: Request, res: Response, next: NextFunction) => {
  const securityUpdateData = new SecurityUpdateDto()
  securityUpdateData.password = req.body.password
  securityUpdateData.confirmPassword = req.body.confirmPassword

  const dataCheck = await validationCheck<SecurityUpdateDto>(securityUpdateData) as SecurityUpdateDto

  if (!dataCheck.password) {
    return res.status(422).json({
      errors: (dataCheck as unknown as ErrorObject).errors
    });
  }

  const user = await userRepository.findOneBy({ id: Number(req.user.id) })
  user.lastLoginDate = null
  user.password = securityUpdateData.password

  await userRepository.save(user)

  res.json({
    isUpdated: true
  })
});

export default router;
