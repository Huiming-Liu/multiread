/*
 * @Description: handle the data for echarts plugin
 * @Author: Huiming Liu
 * @Date: 13/09/2021
 */
function whichday(someday) {
  var currentYear = new Date().getFullYear().toString();
  var hasTimestamp = new Date(someday) - new Date(currentYear);
  var hasDays = Math.ceil(hasTimestamp / 86400000);
  return hasDays;
}

function setOption(chart, dataArr) {
  var data = [[]];
  var readdata = dataArr;

  var chart = chart;
  var thisyear = new Date();
  var base = +new Date(thisyear.getFullYear(), 0, 0);

  var currentYear = new Date().getFullYear().toString();
  var hasTimestamp = new Date() - new Date(currentYear);
  // 86400000 = 24 * 60 * 60 * 1000
  var hasDays = Math.ceil(hasTimestamp / 86400000);
  var oneDay = 24 * 3600 * 1000;
  for (var i = 0; i < hasDays; i++) {
    var now = new Date((base += oneDay));
    data.push([
      [now.getFullYear(), now.getMonth() + 1, now.getDate()].join("-"),
      0,
      0,
      0,
      0,
      0,
      0,
    ]);
  }
  data.shift();

  delete readdata["_id"];
  delete readdata["_openid"];
  // delete tasks[0]["_nickname"]
  // console.log(old_data[0])//时间数组
  var day = Object.keys(readdata);
  for (var i = 0; i < day.length; i++) {
    var everyday = day[i];
    var daynr = whichday(everyday);
    //console.log(daynr)
    var values = Object.values(readdata)[i];
    values.unshift("");
    data[daynr] = data[daynr].map((v, i) => values[i] + v);
  }
  // data=res.result
  var dataENw = [[]];
  var dataDEw = [[]];
  var dataFRw = [[]];

  var dataENt = [[]];
  var dataDEt = [[]];
  var dataFRt = [[]];

  dataENw = [[data[0][0], data[0][1]]];
  dataDEw = [[data[0][0], data[0][3]]];
  dataFRw = [[data[0][0], data[0][5]]];

  dataENt = [[data[0][0], data[0][2] / 60]];
  dataDEt = [[data[0][0], data[0][4] / 60]];
  dataFRt = [[data[0][0], data[0][6] / 60]];

  for (let i = 1; i < data.length; i++) {
    dataENw.push([data[i][0], data[i][1]]);
    dataDEw.push([data[i][0], data[i][3]]);
    dataFRw.push([data[i][0], data[i][5]]);
  }

  for (let i = 1; i < data.length; i++) {
    dataENt.push([data[i][0], data[i][2] / 60]);
    dataDEt.push([data[i][0], data[i][4] / 60]);
    dataFRt.push([data[i][0], data[i][6] / 60]);
  }

  const option = {
    tooltip: {
      trigger: "axis",
      position: "inside",
      formatter: function (data) {
        console.log(data);
        var date = data[0].data[0];
        var ENw = data[0].data[1];
        var ENt = Math.floor(data[3].data[1]);
        var DEw = data[1].data[1];
        var DEt = Math.floor(data[4].data[1]);
        var FRw = data[2].data[1];
        var FRt = Math.floor(data[5].data[1]);
        return `${date}\nEN: ${ENw}个单词/${ENt}分钟\nDE: ${DEw}个单词/${DEt}分钟\nFR: ${FRw}个单词/${FRt}分钟`;
      },
    },
    color: ["#37A2DA", "#67E0E3", "#9FE6B8"],
    legend: {
      data: ["EN", "DE", "FR"],
      padding: [10, 50, 0, 0],
      left: "center",
      backgroundColor: "transparent",
      z: 100,
    },
    grid: {
      top: "16%",
      left: "3%",
      right: "3%",
      bottom: "10%",
      containLabel: true,
    },
    xAxis: {
      type: "time",
      gridIndex: 0,
      boundaryGap: false,
      minInterval: 3600 * 24 * 1000,
      minInterval: 24 * 3600 * 1000,
      interval: 24 * 3600 * 1000,
      axisLabel: {
        rotate: "45",
      },
    },
    yAxis: [
      {
        name: "单词数",
        type: "value",
        boundaryGap: [0, "100%"],
      },
      {
        name: "阅读分钟",
        type: "value",
        boundaryGap: [0, "100%"],
      },
    ],
    dataZoom: [
      {
        type: "inside",
        start: 0,
        end: 20,
      },
      {
        start: 0,
        end: 20,
      },
    ],
    series: [
      {
        name: "EN",
        type: "line",
        smooth: true,
        symbol: "none",
        yAxisIndex: 0,
        data: dataENw,
      },
      {
        name: "DE",
        type: "line",
        smooth: true,
        symbol: "none",
        yAxisIndex: 0,
        data: dataDEw,
      },
      {
        name: "FR",
        type: "line",
        smooth: true,
        symbol: "none",
        yAxisIndex: 0,
        data: dataFRw,
      },
      {
        name: "EN",
        type: "line",
        smooth: false,
        itemStyle: {
          normal: {
            lineStyle: {
              width: 2,
              type: "dotted",
            },
          },
        },
        symbol: "none",
        yAxisIndex: 1,
        data: dataENt,
      },
      {
        name: "DE",
        type: "line",
        smooth: false,
        itemStyle: {
          normal: {
            lineStyle: {
              width: 2,
              type: "dotted",
            },
          },
        },
        symbol: "none",
        yAxisIndex: 1,
        data: dataDEt,
      },
      {
        name: "FR",
        type: "line",
        smooth: false,
        itemStyle: {
          normal: {
            lineStyle: {
              width: 2,
              type: "dotted",
            },
          },
        },
        symbol: "none",
        yAxisIndex: 1,
        data: dataFRt,
      },
    ],
  };

  chart.setOption(option, dataArr);
}

exports.setOption = setOption;
