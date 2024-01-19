// GLOBAL IMPORTS
import "reflect-metadata"
import * as passport from "passport";
import * as express from "express";
import * as dotenv from "dotenv";
import * as bodyParser from "body-parser";
import {Express, Request, Response} from "express";

// LOCAL IMPORTS
import {AppDataSource} from "@/db/data-source";
import {jwtSessionMiddleware} from "@/middlewares/jwtsession.middleware";
import passportStrategy from "@/strategy/passport.strategy";

import AuthController from "@/modules/auth/auth.controller";
import BlogController from "@/modules/blog/blog.controller";
import CommentController from "@/modules/comment/comment.controller";

dotenv.config();
passportStrategy(passport)

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json())
app.use(jwtSessionMiddleware)

app.use("/auth", AuthController)
app.use("/blog", BlogController)
app.use("/comment", CommentController)

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