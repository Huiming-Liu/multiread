/*
 * @Description: https://www.cnblogs.com/xiaozhu007/p/10774290.html
 * @Author: 爱上大树的小猪
 *
 */



function _handletouchmove (event, _this) {
  
  let currentX = event.touches[0].pageX // 获得X轴坐标
  let currentY = event.touches[0].pageY // 获得Y轴坐标
  let tx = currentX - _this.data.lastX // 计算X轴偏差值
  let ty = currentY - _this.data.lastY // 计算Y轴偏差值

  // 上下左右方向滑动
  if (tx === 0) { // 上下方向
    if (ty < 0) { // 上滑动
      _this.data.direction = 360
    } else if (ty > 0) { // 下滑动
      _this.data.direction = 180
    }
  } else if (ty === 0) { // 左右方向
    if (tx < 0) { // 左滑动
      _this.data.direction = 270
    } else if (tx > 0) { // 右滑动
      _this.data.direction = 90
    }
  } else if (tx < 0 && ty < 0) { // 左上滑动
    _this.data.direction = 315
  } else if (tx < 0 && ty > 0) { // 左下滑动
    _this.data.direction = 225
  } else if (tx > 0 && ty < 0) { // 右上滑动
    _this.data.direction = 45
  } else if (tx > 0 && ty > 0) { // 右下滑动
    _this.data.direction = 135
  } 

  // 将当前坐标进行保存以进行下一次计算
  _this.data.lastX = currentX
  _this.data.lastY = currentY

 
}

function _handletouchstart (event, _this) {
  _this.data.lastX = event.touches[0].pageX // 获得触摸点X轴坐标
  _this.data.lastY = event.touches[0].pageY // 获得触摸点Y轴坐标
}

  // 初始化标签云特效
  function initialize(data, _this) {
    const that = _this
    let countList = [] // 计算列表数据集合
    let radius = 150 // 初始化滚动半径作用区域
    let tagEle = data // 标题元素数组
    _this.setData({ // 首次赋值给到页面用于后续获取高宽值
      tagEle: tagEle
    })

    // 首次循环获取所有元素高宽值并计算得出首次计算列表数据
    for (let i = 0; i < tagEle.length; i++) {
      let query = wx.createSelectorQuery() // 小程序API获得组件对象
      query.select(`#tag${i}`).boundingClientRect(rect => { // 使用选择器获得每个id元素的高宽值
        let acos = Math.acos(-1 + (2 * i + 1) / tagEle.length) // 计算反余弦 
        let sqrt = Math.sqrt((tagEle.length + 1) * Math.PI) * acos // 计算平方根
        countList.push({
          /*offsetWidth: rect.width, // 当前id元素的宽度
          offsetHeight: rect.height, // 当前id元素的高度**/
          offsetWidth: 300, // LIU修改
          offsetHeight: 300, // LIU修改
          left: radius * 1.5 * Math.cos(sqrt) * Math.sin(acos), // 当前id元素的left值
          top: radius * 1.5 * Math.sin(sqrt) * Math.sin(acos), // 当前id元素的top值
          z: radius * 1.5 * Math.cos(acos), // 计算Z轴值
        })
      }).exec()
    }

    // 下列为主要运算赋值程序，定时器是由于小程序API获取高宽的异步执行，这里暂时没改为同步。即用定时器来做延时运行。
    setTimeout(() => {
      that.countTime = setInterval(() => {
        calculation(tagEle, countList, radius, that) // 调用计算函数
      }, 50) // 每50毫秒执行一次，考虑性能消耗问题，不建议更改时间，要控制速度更改ispeed值
      _this.setData({
        tagState: false
      })
    }, 300)
  }
 // Style样式计算过程
 function calculation(tagData, countData, num, _this) {
   const that = _this
  let countList = countData // 计算结果数组
  const radius = num // 滚动区域范围，默认单位为px，数值越大滚动范围越大
  let fontsize = 14 // 字体大小，默认单位为px，后期转换rem。数值越大字体越大
  let depth = 2 * radius // 滚动深度
  let ispeed = 15 // 滚动速度，数值越大滚动速度越快，不能小于2
  let direction = _this.data.direction // 滚动方向, 取值角度(0-360): 0和360对应即从下到上, 90对应垂直X-Y,180对应从上倒下，其他数值随意测试...
  let directionX = ispeed * Math.sin(direction * Math.PI / 180) // 计算X轴Sin值
  let directioneY = -ispeed * Math.cos(direction * Math.PI / 180) // 计算Y轴Cos值
  let a = -(Math.min(Math.max(-directioneY, -radius), radius) / radius) * ispeed // 计算a值用以后续判断计算
  let b = (Math.min(Math.max(-directionX, -radius), radius) / radius) * ispeed // 计算b值用以后续判断计算
  let dtr = Math.PI / 180 // 计算圆周率
  let PIList = [ // 计算圆周率数组
    Math.sin(a * dtr),
    Math.cos(a * dtr),
    Math.sin(b * dtr),
    Math.cos(b * dtr)
  ]
  // 若ab值太小，即相关配置如速度/范围等太低，直接return不执行动效
  if (Math.abs(a) <= 0.01 && Math.abs(b) <= 0.01) { return; }
  // 循环遍历每个元素前面所计算出来的各值
  for (let j = 0; j < countList.length; j++) {
    let rz1 = countList[j].top * PIList[0] + countList[j].z * PIList[1] // 计算前置数据
    let rz2 = rz1 * PIList[3] - countList[j].left * PIList[2] // 计算前置数据
    let per = depth / (depth + rz2) // 计算前置数据

    countList[j].left = countList[j].left * PIList[3] + rz1 * PIList[2] // 计算left用以后面计算赋值left
    countList[j].top = countList[j].top * PIList[1] + countList[j].z * (-PIList[0]) // 计算top用以后面计算赋值top
    countList[j].z = rz2 // 赋值计算列表中Z值新数据
    countList[j].fontsize = (per * 2 + fontsize) / 30 // 计算fontsize用以后面计算赋值font-size。注：最后除以30是用以后续rem单位计算，具体rem单位计算可参照官方计算。
    countList[j].alpha = 1.5 * per - 0.7 // 计算alpha用以后面计算赋值opacity
    countList[j].zIndex = Math.ceil(per * 10 - 5) // 计算zIndex用以后面计算赋值z-index
  }

  voluation(tagData, countList, that)
}

  // Style样式赋值运算
  function voluation(tagData, countData, _this) {
    const tagEle = tagData
    const countList = countData
    let styleList = [] // 存储完整渲染列表的文字和样式结构
    for (let i = 0; i < countList.length; i++) {
      styleList.push({
        title: tagEle[i].title, // 标题文字内容
        left: countList[i].left + (500 - countList[i].offsetWidth) / 2 + "rpx",  // 500越大，则距离左边越远 
        top: countList[i].top + (450 - countList[i].offsetHeight) / 2 + "rpx", // 440越大，则距离上边越远
        zIndex: countList[i].zIndex, // z-index值
        opacity: countList[i].alpha,  // opacity值
        //fontSize: countList[i].fontsize + "rem" // font-size值。注：不采用rpx值是因为在小程序最后会被改为四舍五入后的px值，不支持小数点单位，在放大缩小中不是很美观。于是采用转换rem值。
        fontSize: countList[i].fontsize
      })
    
    }
    _this.setData({ // 赋值给到页面渲染
      tagEle: styleList
    })
  }

  const _handletouchmove1 = _handletouchmove
export { _handletouchmove1 as _handletouchmove }
  const _handletouchstart1 = _handletouchstart
export { _handletouchstart1 as _handletouchstart }
  const _initialize = initialize
export { _initialize as initialize }
  const _calculation = calculation
export { _calculation as calculation }
  const _voluation = voluation
export { _voluation as voluation }
