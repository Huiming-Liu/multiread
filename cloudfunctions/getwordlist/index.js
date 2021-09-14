// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const xlsx = require('node-xlsx');

// 云函数入口函数
exports.main = async(event, context) => {

 
    try {
     
     
      console.log(event.data)
      let dataCVS = `yourlist${Date.now().toString().slice(-6)}.xlsx`
      
     var yourlist = []
      event.data.forEach(item => {
        let tempo_array=[item]
        yourlist.push(tempo_array)
      });
   //  console.log(yourlist)
    
      var buffer = await xlsx.build([{
        name: "yourlist",
        data: yourlist
      }]);
   
      return await cloud.uploadFile({
        cloudPath: dataCVS,
        fileContent: buffer, 
      })
  
    } catch (e) {
      console.error(e)
      return e
    }

}