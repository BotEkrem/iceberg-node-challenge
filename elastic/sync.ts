import {Client} from "@elastic/elasticsearch";
import * as dotenv from "dotenv";
import {AppDataSource} from "@/db/data-source";
import {User} from "@/entities/user.entity";
import {Blog} from "@/entities/blog.entity";
import {Comment} from "@/entities/comment.entity";

dotenv.config();

const client = new Client({
  node: process.env.ELASTIC_ENDPOINT,
  auth: {
    apiKey: {
      id: process.env.ELASTIC_API_ID,
      api_key: process.env.ELASTIC_API_KEY,
    }
  }
})

async function main() {
  await AppDataSource.initialize()

  const userRepository = AppDataSource.getRepository(User);
  const blogRepository = AppDataSource.getRepository(Blog);
  const commentRepository = AppDataSource.getRepository(Comment);

  await client.indices.create({index: 'user'})

  await client.indices.putMapping({
    index: 'user',
    properties: {
      id: {type: 'integer'},
      fullName: {type: 'text'},
      username: {type: 'text'},
      email: {type: 'text'},
      birthday: {type: 'date'},
      lastLoginDate: {type: 'date'},
      ipAddress: {type: 'text'},
      createdAt: {type: 'date'},
      updatedAt: {type: 'date'},
      deletedAt: {type: 'date'}
    }
  })

  await client.indices.create({index: 'blog'})

  await client.indices.putMapping({
    index: 'blog',
    properties: {
      id: {type: 'integer'},
      title: {type: 'text'},
      content: {type: 'text'},
      category: {type: 'keyword'},
      createdAt: {type: 'date'},
      updatedAt: {type: 'date'},
      deletedAt: {type: 'date'}
    }
  })

  await client.indices.create({index: 'comment'})

  await client.indices.putMapping({
    index: 'comment',
    properties: {
      id: {type: 'integer'},
      content: {type: 'text'},
      createdAt: {type: 'date'},
      updatedAt: {type: 'date'},
      deletedAt: {type: 'date'}
    }
  })

  const users = await userRepository.find()
  const blogs = await blogRepository.find({relations: ["creator"]})
  const comments = await commentRepository.find({relations: ["creator", "blog"]})


  for await (let user of users) {
    await client.index({
      index: "user",
      id: String(user.id),
      document: {
        ...user
      }
    })
  }

  for await (let blog of blogs) {
    await client.index({
      index: "blog",
      id: String(blog.id),
      document: {
        ...blog
      }
    })
  }

  for await (let comment of comments) {
    await client.index({
      index: "comment",
      id: String(comment.id),
      document: {
        ...comment
      }
    })
  }

  console.log("Successfully Completed.")
}

main()