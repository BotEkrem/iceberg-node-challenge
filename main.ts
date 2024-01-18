// GLOBAL IMPORTS
import "reflect-metadata"
import * as passport from "passport";
import * as express from "express";
import {Express, Request, Response} from "express";
import * as dotenv from "dotenv";
import * as bodyParser from "body-parser";

// LOCAL IMPORTS
import {AppDataSource} from "@/db/data-source";
import {jwtSessionMiddleware} from "@/middlewares/jwtsession.middleware";
import passportStrategy from "@/strategy/passport.strategy";

import AuthController from "@/modules/auth/auth.controller";

dotenv.config();
passportStrategy(passport)

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json())
app.set('trust proxy', true);
app.use(jwtSessionMiddleware)

app.use("/auth", AuthController)

app.get("/", (req: Request, res: Response) => {
  res.send("Hello world 👋");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

async function main() {
  await AppDataSource.initialize()
}

main()