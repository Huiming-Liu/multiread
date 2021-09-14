// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const MAX_LIMIT = 100


var tasks
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
var echartsdata = db.collection('user')
.where({
  _id: wxContext.OPENID
})
.count().then(async res=>{
  if(res.total>0){
  let total = res.total;
 
  // 计算需分几次取
  const batchTimes = Math.ceil(total / MAX_LIMIT)
 
  // 承载所有读操作的 promise 的数组
  tasks=[]
  
  for (let i = 0; i < batchTimes; i++) {
    const promise= db.collection('user').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)}
    return (await Promise.all(tasks)).reduce((acc,cur)=>
    {
      return {tasks:acc.data.concat(cur.data)}
    })
  }
})
  return echartsdata
 
}
