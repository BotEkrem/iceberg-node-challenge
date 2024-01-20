import * as express from "express";

import {validationCheck} from "@/misc/functions/validation";
import {categoryRates, postsByTime, userStats, TimeRange} from "@/elastic/queries";
import {ErrorObject} from "@/misc/interfaces/errorObject";
import {Request, Response, NextFunction} from "express";
import {UserStatsDto} from "@/dto/elastic/userStats.dto";

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
