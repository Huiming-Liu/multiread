// 云函数入口文件
const cloud = require('wx-server-sdk')
// 给定字符串环境 ID：接下来的 API 调用都将请求到环境 some-env-id
cloud.init()

const db = cloud.database()
// 云函数入口函数

exports.main = async (event, context) => {
  
 // return await event
  return await db.createCollection(event.name)
}