import * as express from "express";
import {Request, Response, NextFunction} from "express";
import {categoryRates, postsByTime, TimeRange, userStats} from "@/elastic/queries";
import {UserStatsDto} from "@/dto/elastic/userStats.dto";
import {validationCheck} from "@/misc/functions/validation";
import {ErrorObject} from "@/misc/interfaces/errorObject";

const router = express.Router()

router.get("/category-rates", async (req: Request, res: Response, next: NextFunction) => {
  const data = await categoryRates()
  res.send(data)
});

router.get("/user-stats", async (req: Request, res: Response, next: NextFunction) => {
  const data = await userStats()
  res.send(data)
});

router.get("/posts-by-time", async (req: Request, res: Response, next: NextFunction) => {
  const userStatsData = new UserStatsDto()
  userStatsData.range = req.query.range as TimeRange
  userStatsData.size = Number(req.query.size)

  const dataCheck = await validationCheck<UserStatsDto>(userStatsData) as UserStatsDto

  if (!dataCheck.range) {
    return res.status(422).json({
      errors: (dataCheck as unknown as ErrorObject).errors
    });
  }

  const data = await postsByTime(userStatsData.range, userStatsData.size)
  res.send(data)
});

export default router;
