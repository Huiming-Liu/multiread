// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()



// 云函数入口函数
exports.main = async (event, context) => {
  var fileID=event.fileID
  cloud.deleteFile({
    fileList: [fileID]
  }).then(res=>{
  })
  //setTimeout(function(){delaydelete(fileID)}, 1000*12);
}
//function delaydelete(fileID){
//}