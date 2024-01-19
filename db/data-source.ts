import {DataSource} from "typeorm";
import * as dotenv from "dotenv";

import {User} from "@/entities/user.entity";
import {Blog} from "@/entities/blog.entity";
import {Comment} from "@/entities/comment.entity";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT as unknown as number,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: true,
  entities: [
    User,
    Blog,
    Comment
  ],
})