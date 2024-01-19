import * as express from "express";
import {Request, Response, NextFunction} from "express";

import {AppDataSource} from "@/db/data-source";
import {Blog} from "@/entities/blog.entity";
import {CreateBlogDto} from "@/dto/blog/createBlog.dto";
import {validationCheck} from "@/misc/functions/validation";
import {ErrorObject} from "@/misc/interfaces/errorObject";
import {CategoriesEnum} from "@/misc/enums/categories.enum";
import {UpdateBlogDto} from "@/dto/blog/updateBlog.dto";
import {Comment} from "@/entities/comment.entity";

const router = express.Router()
const blogRepository = AppDataSource.getRepository(Blog)
const commentRepository = AppDataSource.getRepository(Comment)

router.get("/all", async (req: Request, res: Response, next: NextFunction) => {
  const category = req.query.category as string || null
  const search = req.query.search as string || null

  const blogsData = await blogRepository.query(`
    SELECT 
           b.id                           as id,
           b.title                        as title,
           u.username                     as author,
           (select count(*) from comment c where "blogId" = b.id and c."deletedAt" is null) as "commentSize",
           b.category                     as category
    FROM blog b
           LEFT JOIN "user" u on u.id = b."creatorId" and u."deletedAt" is null
    WHERE b."deletedAt" is null
          ${category ? `AND lower(category) like lower('%${category}%')` : ""}
          ${search ? `AND lower(title) like lower('%${search}%')` : ""}
    ORDER BY b."createdAt" DESC;
  `)

  res.json(blogsData)
});

router.get("/my-blogs", async (req: Request, res: Response, next: NextFunction) => {
  const blogsData = await blogRepository.query(`
    SELECT * FROM blog
    WHERE "creatorId" = $1 AND "deletedAt" is null
    ORDER BY "createdAt" DESC;
  `, [req.user.id])

  res.json(blogsData)
});

router.get("/detail/:id", async (req: Request, res: Response, next: NextFunction) => {
  const blogsData = await blogRepository.query(`
    SELECT 
        *,
        (SELECT json_agg(
           json_build_object(
                   'creator', u.username,
                   'content', c.content,
                   'createdAt', c."createdAt"
           )
        )
        FROM comment c
           left join "user" u on u.id = c."creatorId" and u."deletedAt" is null
        where "blogId" = b.id and c."deletedAt" is null) as comments 
    FROM blog b 
    WHERE id = $1 AND "deletedAt" is null;
  `, [req.params.id])

  res.json(blogsData[0] || {})
});

router.get("/categories", async (req: Request, res: Response, next: NextFunction) => {
  res.json(Object.values(CategoriesEnum))
});

router.post("/create", async (req: Request, res: Response, next: NextFunction) => {
  const createBlogData = new CreateBlogDto()
  createBlogData.title = req.body.title
  createBlogData.content = req.body.content
  createBlogData.category = req.body.category

  const dataCheck = await validationCheck<CreateBlogDto>(createBlogData) as CreateBlogDto

  if (!dataCheck.title) {
    return res.status(422).json({
      errors: (dataCheck as unknown as ErrorObject).errors
    });
  }

  const insertData = await blogRepository.query(`
    INSERT INTO blog(title, content, category, "creatorId")
    values ($1, $2, $3, $4);
  `, [createBlogData.title, createBlogData.content, createBlogData.category, req.user.id])

  res.json({
    success: true
  })
});

router.patch("/update", async (req: Request, res: Response, next: NextFunction) => {
  const updateBlogData = new UpdateBlogDto()
  updateBlogData.title = req.body.title
  updateBlogData.content = req.body.content
  updateBlogData.blogId = req.body.blogId

  const dataCheck = await validationCheck<UpdateBlogDto>(updateBlogData) as UpdateBlogDto

  if (!dataCheck.title) {
    return res.status(422).json({
      errors: (dataCheck as unknown as ErrorObject).errors
    });
  }

  const updateData = await blogRepository.query(`
    UPDATE blog
    SET title = $1,
        content = $2
    WHERE
        id = $3 AND "creatorId" = $4;
  `, [updateBlogData.title, updateBlogData.content, updateBlogData.blogId, req.user.id])

  res.json({
    success: true
  })
});

router.delete("/delete/:id", async (req: Request, res: Response, next: NextFunction) => {
  await commentRepository.softDelete({blog: {id: Number(req.params.id)}})
  await blogRepository.softDelete({id: Number(req.params.id)})

  res.json({
    success: true
  })
});

export default router;
