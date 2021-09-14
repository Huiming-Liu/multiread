
/*
 * @Description: the user page
 * @Author: Huiming Liu
 * @Date: 13/09/2021
 */
import * as echarts from "../../components/ec-canvas/echarts.min.js";

import { setOption } from "charts.js";
import { initialize } from "tagCloud.js";
import { _handletouchmove } from "tagCloud.js";
import { _handletouchstart } from "tagCloud.js";

const app = getApp();
const db = wx.cloud.database();
var chart;

let _Loading = false;
Page({
  data: {
    defaultSize: "mini",

    tagEle: [],
    tagState: true,
    countTime: null,
    lastX: 0,
    lastY: 0,
    direction: 180,

    ec: {
      lazyLoad: true,
    },
    imageSrc: "",

    selected: [false, false, false, false, false, false],
    list_name: "",
    list_word: [],
    btnText: [],
    selectedbtn: [],
    active: null,

    dataArr: {},
    chartheight: "`${wx.getSystemInfoSync().windowHeight+800}rpx`",

    isLoaded: false,
    isDisposed: false,
    cloud: false,

    about: "",

    inputValue: "",
    userCollection: [],
    isCollected: false,
    wordList: [],
    isWordList: false,
  },

  handletouchmove: function (event) {
    const _event = event;
    const that = this;
    _handletouchmove(_event, that);
  },
  handletouchstart: function (event) {
    const _event = event;
    const that = this;
    _handletouchstart(_event, that);
  },

  calendarChange() {},

  unLoad: function () {},

  onHide() {
    clearInterval(this.countTime);
    this.countTime = null;

    if (this.data.isLoaded) {
      chart.dispose();
    }

    this.setData({
      isLoaded: false,
      isDisposed: false,
      userCollection: [],
      wordList: [],
      isWordList: false,
    });
  },

  async cancelAuth() {
    wx.showModal({
      title: "确定取消授权？",
      content: "取消之后，您的阅读数据将全部删除并无法复原。",
      async success(res) {
        if (res.confirm) {
          const db = wx.cloud.database();

          await db
            .collection("userCollection")
            .where({
              _id: app.globalData.openid,
            })
            .remove()
            .then(
              await db
                .collection("userList")
                .where({
                  _id: app.globalData.openid,
                })
                .remove()
                .then(
                  await db
                    .collection("user")
                    .where({
                      _id: app.globalData.openid,
                    })
                    .remove({
                      success: (res) => {
                        app.globalData.loginauth = false;

                        wx.switchTab({
                          url: "../index/index",
                        }).then(
                          setTimeout(
                            wx.showToast({
                              title: "取消授权成功",
                            })
                          ),
                          1500
                        );
                      },
                    })
                )
            );
        } else if (res.cancel) {
        }
      },
    });
  },

  AddWordList(event) {
    var indexbtn = event.target.id;
    wx.showToast({
      title: "添加成功",
      icon: "none",
      duration: 2000,
    }).then((res) => {
      this.setData({
        [`selectedbtn[${indexbtn}]`]: true,
        [`btnText[${indexbtn}]`]: "取消添加",
      });
    });
  },
  RemoveWordList(event) {
    var indexbtn = event.target.id;
    wx.showToast({
      title: "取消成功",
      icon: "none",
      duration: 2000,
    }).then((res) => {
      this.setData({
        [`selectedbtn[${indexbtn}]`]: false,
        [`btnText[${indexbtn}]`]: "加入词单",
      });
    });
  },

  onListClick(event) {
    let index = event.currentTarget.dataset.index;

    let active = this.data.active;

    this.setData({
      [`selected[${index}]`]: !this.data.selected[`${index}`],
      active: index,
    });

    if (active !== null && active !== index) {
      this.setData({
        [`selected[${active}]`]: false,
      });
    }
  },

  init: function () {
    this.ecComponent = this.selectComponent("#mychart-dom-line");
    this.ecComponent.init((canvas, width, height, dpr) => {
      chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr,
      });
      setOption(chart, this.data.dataArr);
      var height = wx.getSystemInfoSync().windowHeight;
      var width = wx.getSystemInfoSync().windowWidth;
      chart.resize({ width: width, height: height });

      this.setData({
        isLoaded: true,
        isDisposed: false,
        chartheight: `${wx.getSystemInfoSync().windowHeight + 850}rpx`,
      });
      return chart;
    });
  },

  showchart: function () {
    this.setData({
      isDisposed: false,
      chartheight: `${wx.getSystemInfoSync().windowHeight + 800}rpx`,
    });
  },
  hiddenchart: function () {
    this.setData({
      isDisposed: true,
      chartheight: "1000rpx",
    });
  },

  onShow: function () {
    app.AuthConfirm();
    wx.hideTabBar();
    db.collection("admin")
      .doc("79550af260b131891b36ad0c789389f0")
      .get()
      .then((res) => {
        this.setData({
          about: res.data.content,
        });
      });

    wx.cloud
      .callFunction({
        name: "echartsdata",
      })
      .then((res) => {
        if (res.result == null) {
          this.setData({
            dataArr: [],
            cloud: false,
          });
        } else if (res.result != null) {
          if (typeof res.result.data != "undefined") {
            if (res.result.data[0].length == 2) {
              this.setData({
                cloud: false,
              });
            }
            var readdata = res.result.data[0];
            delete readdata["_id"];
            delete readdata["_openid"];
            if (Object.keys(readdata).length != 0) {
              this.setData({
                dataArr: readdata,
                cloud: true,
              });
              var thisyear = new Date().getFullYear();

              var daynr = Object.keys(readdata).length;

              var ENword = 0;
              var ENtime = 0;
              var DEword = 0;
              var DEtime = 0;
              var FRword = 0;
              var FRtime = 0;
              for (let i = 0; i < daynr; i++) {
                ENword = Object.values(readdata)[i][0] + ENword;
                ENtime = Object.values(readdata)[i][1] + ENtime;
                DEword = Object.values(readdata)[i][2] + DEword;
                DEtime = Object.values(readdata)[i][3] + DEtime;
                FRword = Object.values(readdata)[i][4] + FRword;
                FRtime = Object.values(readdata)[i][5] + FRtime;
              }
              var wordsum = ENword + DEword + FRword;
              var timesum = Math.floor((ENtime + DEtime + FRtime) / 60);
              var tagEle = [
                { title: "欢迎你" },
                { title: `${thisyear}年` },
                { title: `坚持${daynr}天` },
                { title: `累计${timesum}分钟` },
                { title: `累计${wordsum}单词` },
                { title: "坚持热爱" },
                { title: "感谢遇见" },
                { title: "一起同行" },
              ];
              var that = this;
              initialize(tagEle, that);
            }
          }
        }
        wx.showTabBar();
      });

    var tempo_word = [];
    var selectedbtn = [];
    var btnText = [];

    app
      .getTextfromStorage(
        "cloud://multiread-8gcsb9xfcb0114d9.6d75-multiread-8gcsb9xfcb0114d9-1304836910/article/articleEN/articleEN1W.json"
      )
      .then((res) => {
        res.data.forEach((newword) => {
          tempo_word.push(newword.word);
          selectedbtn.push(false);
          btnText.push("加入词单");
        });
        this.setData({
          list_word: tempo_word,
          selectedbtn: selectedbtn,
          btnText: btnText,
          list_name: [
            "生词清单",
            "收藏文章",
            "打卡日历",
            "阅读数据",
            "关于小程序",
            "报错建议",
          ],
        });
      });
    //收藏文章
    if (app.globalData.loginauth == true) {
      db.collection("userCollection")
        .doc(app.globalData.openid)
        .get()
        .then((res) => {
          var collection = res.data.collection;
          if (collection.length == 0) {
            this.setData({
              isCollected: false,
            });
          } else {
            this.setData({
              isCollected: true,
            });
          }
          var userCollection = [];
          var promise;
          collection.forEach((item) => {
            if (item[0] == "EN") {
              promise = db
                .collection("CatalogEN")
                .where({
                  lan: "EN",
                  id: item[1],
                })
                .get();
              userCollection.push(promise);
            } else if (item[0] == "DE") {
              promise = db
                .collection("CatalogDE")
                .where({
                  lan: "DE",
                  id: item[1],
                })
                .get();
              userCollection.push(promise);
            } else if (item[0] == "FR") {
              promise = db
                .collection("CatalogFR")
                .where({
                  lan: "FR",
                  id: item[1],
                })
                .get();
              userCollection.push(promise);
            } else {
              console.log("error");
            }
          });

          Promise.all(userCollection).then((result) => {
            var CollectionResult = [];
            result.forEach((item) => {
              CollectionResult.push(item.data[0]);
            });

            this.setData({
              userCollection: CollectionResult,
            });
          });
        });

      //词单
      db.collection("userList")
        .doc(app.globalData.openid)
        .get()
        .then((res) => {
          if (res.data.wordlist.length == 0) {
            this.setData({
              isWordList: false,
            });
          } else {
            this.setData({
              isWordList: true,
            });
          }
          this.setData({
            wordList: res.data.wordlist,
          });
        });
    }
  },
  suggestion: function (e) {
    if (e.detail.value.message == "") {
      wx.showToast({
        title: "请输入您的留言",
        duration: 1500,
        icon: "none",
      });
    } else {
      this.setData({
        inputValue: "",
      });

      db.collection("suggestion")
        .where({
          _openid: app.globalData.openid,
        })
        .count()
        .then((res) => {
          if (res.total < 5) {
            db.collection("suggestion").add({
              data: {
                name: e.detail.value.name,
                contact: e.detail.value.contact,
                message: e.detail.value.message,
              },
              success: function (res) {
                wx.showToast({
                  title: "提交成功",
                  duration: 1500,
                  icon: "none",
                });
              },
            });
          } else {
            wx.showToast({
              title: "抱歉，提交次数已达上限，请24小时后再试。",
              duration: 3000,
              icon: "none",
            });
          }
        });
    }
  },
  downloadWordlistFile: function () {
    db.collection("userList")
      .doc(app.globalData.openid)
      .get()
      .then((res) => {
        wx.showLoading({
          title: "加载中",
        });
        _Loading = true;
        wx.cloud
          .callFunction({
            name: "getwordlist",
            data: { data: res.data.wordlist },
          })
          .then((res) => {
            var fileID = res.result.fileID;

            wx.cloud
              .getTempFileURL({
                fileList: [
                  {
                    fileID: fileID,
                    maxAge: 2 * 60,
                  },
                ],
              })
              .then((res) => {
                if (_Loading == true) {
                  wx.hideLoading();
                  _Loading = false;
                }

                wx.setClipboardData({
                  data: res.fileList[0].tempFileURL,
                  success(res) {
                    wx.getClipboardData({
                      success() {
                        setTimeout(function () {
                          wx.cloud.callFunction({
                            name: "deleteFile",
                            data: { fileID: fileID },
                          });
                        }, 1000 * 60);
                      },
                    });
                  },
                });
              });
          });
      });
  },
});
