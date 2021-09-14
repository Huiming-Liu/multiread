// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
var result


// 云函数入口函数
exports.main = async (event, context) => {
  
  result= await db.collection(event.collectionname).where({
    _id:event.userid,
    [event.date]: _.exists(true),
  }).get()
return result
}