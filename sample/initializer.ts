import {AppDataSource} from "@/db/data-source";
import {User} from "@/entities/user.entity";
import {Blog} from "@/entities/blog.entity";
import {Comment} from "@/entities/comment.entity";
import {CategoriesEnum} from "@/misc/enums/categories.enum";

async function main() {
  await AppDataSource.initialize()

  const userRepository = AppDataSource.getRepository(User);
  const blogRepository = AppDataSource.getRepository(Blog);
  const commentRepository = AppDataSource.getRepository(Comment);

  const allUsers = await userRepository.find()

  if (allUsers.length > 0) {
    throw new Error("You Must Delete All Users Before Running This Script.")
  }

  const allBlogs = await blogRepository.find()

  if (allBlogs.length > 0) {
    throw new Error("You Must Delete All Blogs Before Running This Script.")
  }

  const allComments = await commentRepository.find()

  if (allComments.length > 0) {
    throw new Error("You Must Delete All Comments Before Running This Script.")
  }

  for await (let item of [...Array(20)].map((v, i) => i + 1)) {
    const userData = await userRepository.save(userRepository.create({
      username: `Person${item}` + "-" + `person${item}@gmail.com`,
      fullName: `Person${item}`,
      email: `person${item}@gmail.com`,
      password: `Person${item}!`,
    }))

    const blogData1 = await blogRepository.save(blogRepository.create({
      title: `Blog ${item} by Person${item}`,
      content: `Blog Description ${item} by Person${item}`,
      category: get_random(Object.values(CategoriesEnum)),
      creator: { id: userData.id },
    }))

    const blogData2 = await blogRepository.save(blogRepository.create({
      title: `Blog ${item + 1} by Person${item}`,
      content: `Blog Description ${item + 1} by Person${item}`,
      category: get_random(Object.values(CategoriesEnum)),
      creator: { id: userData.id }
    }))
  }

  const users = await userRepository.find()
  const blogs = await blogRepository.find()

  for await (let item of [...Array(100)].map((v, i) => i + 1)) {
    await commentRepository.save(commentRepository.create({
      content: `Comment #${item}`,
      blog: { id: get_random(blogs).id },
      creator: { id: get_random(users).id }
    }))
  }

  console.log("Successfully completed.")
}

function get_random(list) {
  return list[Math.floor((Math.random() * list.length))];
}

main()
