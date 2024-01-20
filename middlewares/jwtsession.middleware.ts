import {NextFunction, Request, Response} from "express";
import * as jwt from "jsonwebtoken";

import {User} from "@/types/express";
import {User as UserEntity} from "@/entities/user.entity";
import {AppDataSource} from "@/db/data-source";

export const whiteListedEndpoints = [
  "/auth/login",
  "/auth/register"
]

const userRepository = AppDataSource.getRepository(UserEntity)

export async function jwtSessionMiddleware(req: Request, res: Response, next: NextFunction) {
  if (whiteListedEndpoints.includes(req.path)) return next()

  const authArray = req.headers.authorization?.split(" ") as any[] || [""]

  if (authArray[0] !== "Bearer" || authArray[3]) {
    return res.status(401).json({
      "message": "Unauthorized"
    })
  } else {
    const decodedData = await jwtVerification(req.headers.authorization?.split(" ")[1] as string, req.ip).catch((e) => {
      res.status(401).json({
        "message": "Unauthorized"
      })
    })

    req.user = decodedData as User
    if (decodedData) return next()
  }
}

export async function jwtVerification(jwtHash: string, ip: string): Promise<jwt.JwtPayload> {
  return new Promise(async (resolve, reject) => {
    try {
      const data = jwt.verify(jwtHash, process.env.JWT_SECRET as string) as jwt.JwtPayload
      const userData = await userRepository.findOneBy({ id: data.id })
      if (userData && userData.lastLoginDate && ip === userData.ipAddress) {
        resolve(data)
      } else {
        reject("NotValid")
      }
    } catch (err) {
      reject(err)
    }
  })
}