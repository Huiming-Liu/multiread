// 云函数入口文件
const cloud = require('wx-server-sdk')
// 给定字符串环境 ID：接下来的 API 调用都将请求到环境 some-env-id
cloud.init({
  
})



// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,

  }
}