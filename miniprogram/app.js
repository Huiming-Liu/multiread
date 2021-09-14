//app.js

let _Loading = false;

App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error("请使用 2.2.3 或以上的基础库以使用云能力");
    } else {
      wx.cloud.init({
        // here please use your own env!
        env: "",
        traceUser: true,
      });
    }

    wx.login({
      success: (res) => {},
    });
  },
  globalData: {
    loginauth: false,
    openid: "",
  },

  async getOpenid() {
    return new Promise((resolve) => {
      wx.cloud.callFunction({
        name: "getOpenid",
        success: (res) => resolve(res),
      });
    });
  },

  AuthConfirm() {
    var that = this;
    var loginauth;
    loginauth = this.globalData.loginauth;
    if (loginauth == false) {
      wx.showModal({
        title: "您还未授权",
        content:
          "点击确定授权，我将记录您的阅读数据并进行排名，所有数据及生词库仅保存至本年12月31日。点击取消浏览其他内容。",
        success(res) {
          if (res.confirm) {
            that.AddNewUser(that.globalData.openid);
            that.globalData.loginauth = true;

            wx.showToast({
              title: "授权成功",
              duration: 1500,
            });
          } else if (res.cancel) {
            wx.switchTab({
              url: "../index/index",
            });
          }
        },
      });
    }
  },

  async isUserAuth(userID) {
    const db = wx.cloud.database();
    var UserAuth = await db
      .collection("user")
      .where({
        _id: userID,
      })
      .get();
    return UserAuth;
  },

  getTextfromStorage(myUrl) {
    return new Promise((resolve) => {
      wx.showLoading({
        title: "加载中",
      });
      _Loading = true;

      wx.cloud
        .getTempFileURL({
          fileList: [
            {
              fileID: myUrl,
              maxAge: 10 * 60,
            },
          ],
        })
        .then((res) => {
          wx.request({
            url: res.fileList[0].tempFileURL,
            header: {
              "content-type": "application/json",
            },
            success: (res) => resolve(res),

            fail: (res) => {},
            complete: (res) => {
              if (_Loading == true) {
                wx.hideLoading();
                _Loading = false;
              }
            },
          });
        });
    });
  },
  AddNewUser(Userid) {
    var now = new Date();

    const db = wx.cloud.database();
    db.collection("user").add({
      data: {
        _id: Userid,
      },
    });
    db.collection("userCollection").add({
      data: {
        _id: Userid,
        collection: [],
      },
    });
    db.collection("userList").add({
      data: {
        _id: Userid,
        wordlist: [],
      },
    });
  },
});
