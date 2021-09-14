

// components/calendar/index.js
const { getDate, dataStr, getDateObj, transformDate } = require("./utils");
const getDateStr = (dataStr) => dataStr.slice(0, 7).replace("/", "-");


// 当前的索引值，必须从第一个开始，因为这样我们才能实现视野内的无缝
let currentSwiperIndex = 1,
  generateDate = dataStr, // 当前时间
  swipeStartPoint = 0, // 滑动的坐标
  isPrevMonth = false, // 是否向右滑动
  changeCount = 0; // 滑动的次数


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    duration: {
      type: String,
      value: 500,
    },
    isVertical: {
      type: Boolean,
      value: false,
    },
    dataArr: {
      type: Object,
      value: {},
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    week: ["一", "二", "三", "四", "五", "六", "日"],
    current: 1,
    calendarArr: [],
    monthFormat: getDateStr(dataStr),
    thisyear: new Date().getFullYear(),
   
  },

  /**
   * 组件的方法列表
   */
  methods: {
  
    // 设置上个月的时间
    getPrevMonth(monthFormat) {
      const [year, month] = monthFormat.split(/\-|\//);
      const { dataStr } = getDateObj(
        new Date(year, month-2, 1)
      );
      return dataStr;
    },
    // 设置下个月的时间
    getNextMonth(monthFormat) {
      const [year, month] = monthFormat.split(/\-|\//);
      const { dataStr } = getDateObj(new Date(year, month, 1));
      return dataStr;
    },
    // 生成日历数组
    generatorCalendar(date,dataArr) {
       
      const calendarArr = [];
      // 转换为 Date 实例
      const currentDate = transformDate(date);
      // 获取当前时间的日历数据
      const now = getDate(currentDate);
      // 获取当前时间的字符串
      const { dataStr } = getDateObj(currentDate);
      // 获取上个月的日历数据
      const prev = getDate(this.getPrevMonth(dataStr));
      // 获取下个月的日历数据
      const next = getDate(this.getNextMonth(dataStr));
      // 设置日历数据
      const prevIndex = currentSwiperIndex === 0 ? 2 : currentSwiperIndex - 1;
      const nextIndex = currentSwiperIndex === 2 ? 0 : currentSwiperIndex + 1;
      calendarArr[prevIndex] = prev;
      calendarArr[nextIndex] = next;
      calendarArr[currentSwiperIndex] = now;
      this.triggerEvent("change", this.data.monthFormat);
      
      this.setData({
        monthFormat: getDateStr(dataStr),
      });

        let key = "readday";
        let value = false;
        for(let i=0;i<calendarArr.length;i++){
          for (let j=0;j<calendarArr[i].length;j++){
            calendarArr[i][j][key] = value;
          }
        }
        
        var datedata =Object.keys(dataArr)
        var datedataTemp =[]
        for(let i=0;i<datedata.length;i++){
          datedataTemp.push(new Date(datedata[i].replace(/-/g,"/")))
        }
    
        var tempDate=new Date(dataStr.replace(/-/g,"/"))
        var resultDatepre=new Date((tempDate/1000-(86400*7))*1000)
        var resultDatenex=new Date((tempDate/1000+(86400*35))*1000)
      
       var showDate =[]
       for(let i=0;i<datedataTemp.length;i++){
         if(datedataTemp[i]<resultDatenex&&datedataTemp[i]>resultDatepre)
         showDate.push(datedataTemp[i])
       }
      
       var showDateStr=[]
      for(let i=0;i<showDate.length;i++){
        var month=showDate[i].getMonth()+1
        var day=showDate[i].getDate()
        if(month<10){
          month="0"+month
        }
        if(day<10){
          day="0"+day
        }
        showDateStr.push(showDate[i].getFullYear()+"/"+month+"/"+day)
      }
       
        let i = 0
        for(let j=0;j<showDateStr.length;j++){
          for(i;i<calendarArr[1].length;i++){
            if(showDateStr[j]==calendarArr[1][i].dataStr){
              calendarArr[1][i].readday = true
              break
            }
            
          }
        } 
        
          this.setData({
            calendarArr,
          });
    },
    // 设置当前的索引值
    swiperChange(e) {
      const { current, source } = e.detail;
      if (source === "touch") {
        currentSwiperIndex = current;
        changeCount += 1;
      }
    },
    // 动画结束后让滑动的次数置0
    swiperAnimateFinish() {
      const { year, month } = getDateObj(generateDate);
      const monthDist = isPrevMonth ? -changeCount : changeCount;
      generateDate = new Date(year, month + monthDist - 1);
      // 清空滑动次数
      changeCount = 0;
      this.generatorCalendar(generateDate,this.properties.dataArr);
    },
    // 获取手指刚按下的坐标
    swipeTouchStart(e) {
      const { clientY, clientX } = e.changedTouches[0];
      swipeStartPoint = this.data.isVertical ? clientY : clientX;
    },
    // 获取手指松开时的坐标
    swipeTouchEnd(e) {
      const { clientY, clientX } = e.changedTouches[0];
      isPrevMonth = this.data.isVertical
        ? clientY - swipeStartPoint > 0
        : clientX - swipeStartPoint > 0;
    },

    dateChange(e) {
      const monthFormat = e.detail.value;
      this.setData({
        monthFormat,
      });
      generateDate = getDateStr(monthFormat);
      this.generatorCalendar(generateDate,this.properties.dataArr);
    },

    // 上个月日期
    prevMonth() {
      var limit=this.data.monthFormat
      limit = limit.slice(0,7)
      if((limit.slice(0,4)==(new Date().getFullYear()))&&(limit!=(new Date().getFullYear())+"-"+"01")){
      this.setData({
        monthFormat: this.getPrevMonth(this.data.monthFormat),
      });
      
      this.generatorCalendar(this.data.monthFormat,this.properties.dataArr);
      } 
      
    },
    // 下个月日期
    nextMonth() {
      var limit=this.data.monthFormat
      limit = limit.slice(0,7)
      if(limit.slice(0,4)==(new Date().getFullYear())&&(limit!=(new Date().getFullYear())+"-"+"12")){
      this.setData({
        monthFormat: this.getNextMonth(this.data.monthFormat),
      });
     
      this.generatorCalendar(this.data.monthFormat,this.properties.dataArr);
      console.log()
       }
       
    },
  },
  ready() {
   // this.generatorCalendar(generateDate);
  },
  observers: {
    'dataArr': function() {
      this.generatorCalendar(generateDate,this.properties.dataArr);
     
      
    }}  

});



  