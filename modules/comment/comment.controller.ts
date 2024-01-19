import * as express from "express";
import {Request, Response, NextFunction} from "express";

import {AppDataSource} from "@/db/data-source";
import {validationCheck} from "@/misc/functions/validation";
import {ErrorObject} from "@/misc/interfaces/errorObject";
import {Comment} from "@/entities/comment.entity";
import {CreateCommentDto} from "@/dto/comment/createComment.dto";

const router = express.Router()
const commentRepository = AppDataSource.getRepository(Comment)

router.get("/my-comments", async (req: Request, res: Response, next: NextFunction) => {
  const commentsData = await commentRepository.query(`
    SELECT *,
           comment.id          as id,
           comment.content     as content,
           comment."createdAt" as "createdAt",
           comment."updatedAt" as "updatedAt",
           comment."deletedAt" as "deletedAt",
           comment."creatorId" as "creatorId",
           b.content           as "blogContent"
    FROM comment
             LEFT JOIN blog b on b.id = comment."blogId" and b."deletedAt" is null
    WHERE comment."creatorId" = $1 and comment."deletedAt" is null
    ORDER BY comment."createdAt" DESC;
  `, [req.user.id])

  res.json(commentsData)
});

router.post("/create", async (req: Request, res: Response, next: NextFunction) => {
  const createCommentData = new CreateCommentDto()
  createCommentData.content = req.body.content
  createCommentData.blogId = req.body.blogId

  const dataCheck = await validationCheck<CreateCommentDto>(createCommentData) as CreateCommentDto

  if (!dataCheck.content) {
    return res.status(422).json({
      errors: (dataCheck as unknown as ErrorObject).errors
    });
  }

  const insertData = await commentRepository.query(`
    INSERT INTO comment(content, "creatorId", "blogId")
    values ($1, $2, $3)
  `, [createCommentData.content, req.user.id, createCommentData.blogId])

  res.json({
    success: true
  })
});

export default router;
