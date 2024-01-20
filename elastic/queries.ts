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

export async function categoryRates() {
  const data = await client.search({
      "index": "blog",
      "size": 0,
      "aggs": {
        "categories": {
          "terms": {
            "field": "category",
            "size": 4
          },
        }
      }
    }
  )

  return (data["aggregations"]["categories"]["buckets"].map((v, i) => {
    return {...v, percentage: percentage(v.doc_count, data.hits.total["value"]).toFixed(2)}
  }))
}

export async function userStats() {
  const userData = await client.search({
      "index": "user",
      "size": 0
    }
  )

  const blogData = await client.search({
      "index": "blog",
      "size": 0,
      "aggs": {
        "users": {
          "terms": {
            "field": "creator.id",
            size: userData.hits.total["value"]
          }
        }
      }
    }
  )

  return {
    total: userData.hits.total["value"],
    bloggers: blogData.aggregations["users"]["buckets"].length,
    readers: userData.hits.total["value"] - blogData.aggregations["users"]["buckets"].length,
  }
}

export async function postsByTime(type: TimeRange, size: number) {
  const blogData = await client.search({
    index: 'blog',
    size: size,
    query: {
      range: {
        createdAt: {
          gte: `now-${type == TimeRange.WEEK ? "1w/w" : type == TimeRange.MONTH ? "1M/M" : "1y/y"}`,
        },
      },
    },
    sort: [
      {createdAt: {order: 'desc'}},
    ],
    aggs: {
      [type == TimeRange.WEEK ? "daily_counts" : type == TimeRange.MONTH ? "weekly_counts" : "monthly_counts"]: {
        date_histogram: {
          field: 'createdAt',
          calendar_interval: type == TimeRange.WEEK ? "day" : type == TimeRange.MONTH ? "week" : "month",
          format: type == TimeRange.WEEK ? 'yyyy-MM-dd' : type == TimeRange.MONTH ? "yyyy-MM | W" : "yyyy-MM",
          min_doc_count: 0,
        },
      },
    },
  })

  return {
    [Object.keys(blogData.aggregations)[0]]: blogData.aggregations[Object.keys(blogData.aggregations)[0]]["buckets"],
    blogs: [...blogData.hits.hits]
  }
}

export function percentage(partialValue, totalValue) {
  return (100 * partialValue) / totalValue;
}

export enum TimeRange {
  WEEK = "Week",
  MONTH = "Month",
  YEAR = "Year"
}