/*
 * @Description: the read page of the miniprogram
 * @Author: Huiming Liu
 * @Date: 13/09/2021
 */

const app = getApp();
const db = wx.cloud.database();
const _ = db.command;
var language = "";
var articleID = "";
var word = [];
var pageObject = {
  data: {
    defaultSize: "mini",
    disabled: true,

    list: [],
    randomURL: "",
    randomURLbottom: "",
    showView: false,
    subtitle: "",
    newword: [],

    selected: false,
    list_name: "",
    list_word: [],
    btnText: [],
    selectedbtn: [],
    audioSrc: "",
    audioshow: true,

    scrollHeight: 0,

    collected: false,
    translated: false,
  },

  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"],
    });
    var that = this;
    var windowsHeight = wx.getSystemInfoSync().windowHeight;
    this.data.language = options.language;
    language = options.language;
    articleID = options.articleid;
    var start = Date.now();
    this.data.start = start;

    var random = Math.floor(Math.random() * 10 + 1);
    var randomString = "";
    randomString =
      "cloud://multiread-8gcsb9xfcb0114d9.6d75-multiread-8gcsb9xfcb0114d9-1304836910/image/read" +
      random +
      ".jpg";
    this.setData({
      randomURL: randomString,
    });

    var randomStringbottom = "";
    var name = ["shashibiya", "nicai", "dikaer"];
    var languageid = -1;
    if (options.language == "EN") {
      languageid = 0;
    } else if (options.language == "DE") {
      languageid = 1;
    } else {
      languageid = 2;
    }

    randomStringbottom =
      "cloud://multiread-8gcsb9xfcb0114d9.6d75-multiread-8gcsb9xfcb0114d9-1304836910/image/" +
      name[languageid] +
      ".png";
    this.setData({
      randomURLbottom: randomStringbottom,
    });

    app
      .getTextfromStorage(
        "cloud://multiread-8gcsb9xfcb0114d9.6d75-multiread-8gcsb9xfcb0114d9-1304836910/article/article" +
          options.language +
          "/article" +
          options.language +
          options.articleid +
          ".json"
      )
      .then((res) => {
        var keyword = res.data[2].text;
        var source = res.data[3].text;
        var wordnr = res.data[4].text;
        this.data.wordnr = wordnr;
        var subTitle =
          "关键词：" +
          keyword +
          ",\xa0\xa0" +
          "来源：" +
          source +
          ",\xa0\xa0" +
          " 词数：" +
          wordnr;

        this.setData({
          list: res.data,
          subtitle: subTitle,
        });

        var query = wx.createSelectorQuery();
        query.select("#addbtn").boundingClientRect();
        query.select("#startImage").boundingClientRect();
        query.select("#titleSpace").boundingClientRect();
        query.select("#buttombtn").boundingClientRect();
        query.exec((res) => {
          var scrollHeight =
            windowsHeight -
            res[0].height -
            res[1].height -
            res[2].height -
            res[3].height;
          this.setData({
            scrollHeight: scrollHeight,
          });
        });
      });

    var selectedbtn = [];
    var btnText = [];

    app
      .getTextfromStorage(
        "cloud://multiread-8gcsb9xfcb0114d9.6d75-multiread-8gcsb9xfcb0114d9-1304836910/article/article" +
          options.language +
          "/article" +
          options.language +
          options.articleid +
          "W.json"
      )
      .then((res) => {
        var tempo_word = [];

        res.data.forEach((newword) => {
          tempo_word.push(newword.word);
          selectedbtn.push(false);
          btnText.push("加入词单");
        });
        this.setData({
          list_word: tempo_word,
          list_name: "生词提示",
          selectedbtn: selectedbtn,
          btnText: btnText,
        });
        if (app.globalData.loginauth == true) {
          db.collection("userList")
            .where({
              _openid: app.globalData.openid,
            })
            .get({
              success: function (res) {
                for (let j = 0; j < tempo_word.length; j++) {
                  for (let i = 0; i < res.data[0].wordlist.length; i++) {
                    if (tempo_word[j].indexOf(res.data[0].wordlist[i]) != -1) {
                      selectedbtn[j] = true;
                      btnText[j] = "取消添加";
                    }
                  }
                }

                that.setData({
                  selectedbtn: selectedbtn,
                  btnText: btnText,
                });
              },
            });
        }

        this.setData({
          list_word: tempo_word,
          list_name: "生词提示",
        });
        word = tempo_word;
      });

    var audioURL =
      "cloud://multiread-8gcsb9xfcb0114d9.6d75-multiread-8gcsb9xfcb0114d9-1304836910/audio/Happy Whistling Ukulele.mp3";
    this.setData({
      audioSrc: audioURL,
    });
    if (app.globalData.loginauth == true) {
      db.collection("userCollection")
        .doc(app.globalData.openid)
        .get()
        .then((res) => {
          var collection = res.data.collection;
          collection.forEach((item) => {
            if (item[0] == language && item[1] == articleID) {
              this.setData({
                collected: true,
              });
            }
          });
        });
    }
  },

  onChangeShowState: function () {
    var that = this;
    that.setData({
      showView: !that.data.showView,
      translated: !that.data.translated,
    });
  },

  lower: function () {
    this.setData({
      disabled: false,
    });
  },
  endtime: function () {
    var end = Date.now();
    end = end - this.data.start;
    end = Math.round(end / 1000);
    this.data.end = end;
    var wordnr = this.data.wordnr;

    if (end < wordnr / 100) {
      wx.showModal({
        title: "提示",
        content: "阅读时间过短。点击取消继续阅读，点击确定返回首页。",
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: "../index/index",
            });
          } else if (res.cancel) {
          }
        },
      });
    } else if (end > wordnr / 2) {
      wx.showModal({
        title: "提示",
        content: "阅读时间过长，无法记录。点击确定返回首页。",
        showCancel: false,
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: "../index/index",
            });
          }
        },
      });
    } else {
      if (app.globalData.loginauth == false) {
        app.AuthConfirm();
      } else {
        this.userreadingInfo();
        wx.showToast({
          title: "今日打卡成功",
          icon: "none",
          duration: 1500,
        }).then(
          setTimeout(function () {
            wx.switchTab({
              url: "../index/index",
            });
          }, 1500)
        );
      }
    }
  },

  userreadingInfo: function () {
    var word = parseInt(this.data.wordnr);
    var time = this.data.end;
    var now = new Date();
    var date = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join("-");
    var record = new Array();
    if (this.data.language == "EN") {
      record = [word, time, 0, 0, 0, 0];
    } else if (this.data.language == "DE") {
      record = [0, 0, word, time, 0, 0];
    } else if (this.data.language == "FR") {
      record = [0, 0, 0, 0, word, time];
    } else {
      console.log("the record of language is wrong.");
    }
    const db = wx.cloud.database();
    wx.cloud
      .callFunction({
        name: "userreadingInfo",
        data: {
          userid: app.globalData.openid,
          collectionname: "user",
          date: date,
        },
      })
      .then(async (res) => {
        if (res.result.data.length == 0) {
          await db
            .collection("user")
            .doc(app.globalData.openid)
            .update({
              data: {
                [date]: record,
              },
            });
        } else {
          record = record.map((v, i) => res.result.data[0][date][i] + v);
          await db
            .collection("user")
            .doc(app.globalData.openid)
            .update({
              data: {
                [date]: record,
              },
            });
        }
      });
  },

  AddWordList(event) {
    if (app.globalData.loginauth == true) {
      var indexbtn = event.target.id;
      var newWord = word[indexbtn];
      db.collection("userList")
        .doc(app.globalData.openid)
        .update({
          data: {
            wordlist: _.push(newWord),
          },
        });

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
    } else {
      app.AuthConfirm();
    }
  },
  RemoveWordList(event) {
    var indexbtn = event.target.id;
    var newWord = word[indexbtn];
    db.collection("userList")
      .doc(app.globalData.openid)
      .update({
        data: {
          wordlist: _.pull(_.in([newWord])),
        },
      });

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
    this.setData({
      selected: !this.data.selected,
    });
  },
  collected: function () {
    if (app.globalData.loginauth == true) {
      db.collection("userCollection")
        .doc(app.globalData.openid)
        .update({
          data: {
            collection: _.push([[language, articleID]]),
          },
        })
        .then(
          this.setData({
            collected: true,
          })
        );
    } else {
      app.AuthConfirm();
    }
  },
  uncollected: function () {
    db.collection("userCollection")
      .doc(app.globalData.openid)
      .update({
        data: {
          collection: _.pull(_.in([[language, articleID]])),
        },
      })
      .then(
        this.setData({
          collected: false,
        })
      );
  },
};

Page(pageObject);

