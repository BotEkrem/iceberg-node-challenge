import {Client} from "@elastic/elasticsearch";
import * as dotenv from "dotenv";
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
  await client.indices.delete({ index: 'user' })
  await client.indices.delete({ index: 'blog' })
  await client.indices.delete({ index: 'comment' })

  console.log("Successfully Completed.")
}

main()