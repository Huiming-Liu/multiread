/*
 * @Description: the index of the miniprogram
 * @Author: Huiming Liu
 * @Date: 13/09/2021
 */

const db = wx.cloud.database();
const app = getApp();
var title = [];
let _Loading = false;
Page({
  data: {
    tabs: [],
    activeTab: 0,
    listEN: [],
    listDE: [],
    listFR: [],

    tabEN: 0,
    tabDE: 0,
    tabFR: 0,

    hideNotice: false,
    notice: "",
    show: false,

    searchbar: false,
    searchvaule: "",
    search: [],
    searchauth: true,

    IsarticleEN: true,
    IsarticleDE: true,
    IsarticleFR: true,
  },

  onLoad: function () {
    var that = this;
    wx.hideTabBar();
    wx.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"],
    });
    app.getOpenid().then(function (res) {
      app.globalData.openid = res.result.openid;

      app.isUserAuth(res.result.openid).then(function (UserAuth) {
        if (UserAuth.data.length == 1) {
          app.globalData.loginauth = true;
        }
      });
    });

    var notice = db
      .collection("admin")
      .doc("cbddf0af60ae06540bc3b5fb1a20053e")
      .get();

    const titles = ["English", "Deutsch", "Français"];
    const tabs = titles.map((item) => ({ title: item }));
    this.setData({ tabs });

    wx.showLoading({
      title: "加载中...",
    });
    _Loading = true;

    var articleEN = db
      .collection("CatalogEN")
      .count()
      .then(async (res) => {
        if (res.total == 0) {
          that.setData({
            IsarticleEN: false,
          });
        } else {
          const batchTimes = Math.ceil(res.total / 20);
          var new_data = [];
          var old_data = [];
          for (let i = 0; i < batchTimes; i++) {
            await db
              .collection("CatalogEN")
              .skip(i * 20)
              .limit(20)
              .get()
              .then(async (res) => {
                new_data = res.data;
                old_data = this.data.listEN;
                this.setData({
                  listEN: old_data.concat(new_data).reverse(),
                });
              });
          }
          wx.createSelectorQuery()
            .select("#tabsSwiperEN")
            .boundingClientRect((res) => {
              this.setData({
                tabEN: res.height,
              });
            })
            .exec();
          return old_data.concat(new_data).reverse();
        }
      });

    var articleDE = db
      .collection("CatalogDE")
      .count()
      .then(async (res) => {
        if (res.total == 0) {
          that.setData({
            IsarticleDE: false,
          });
        } else {
          const batchTimes = Math.ceil(res.total / 20);
          var new_data = [];
          var old_data = [];
          for (let i = 0; i < batchTimes; i++) {
            await db
              .collection("CatalogDE")
              .skip(i * 20)
              .limit(20)
              .get()
              .then(async (res) => {
                new_data = res.data;
                old_data = this.data.listDE;
                this.setData({
                  listDE: old_data.concat(new_data).reverse(),
                });
              });
          }
          wx.createSelectorQuery()
            .select("#tabsSwiperDE")
            .boundingClientRect((res) => {
              this.setData({
                tabDE: res.height,
              });
            })
            .exec();
          return old_data.concat(new_data).reverse();
        }
      });

    var articleFR = db
      .collection("CatalogFR")
      .count()
      .then(async (res) => {
        if (res.total == 0) {
          that.setData({
            IsarticleFR: false,
          });
        } else {
          const batchTimes = Math.ceil(res.total / 20);
          var new_data = [];
          var old_data = [];
          for (let i = 0; i < batchTimes; i++) {
            await db
              .collection("CatalogFR")
              .skip(i * 20)
              .limit(20)
              .get()
              .then(async (res) => {
                new_data = res.data;
                old_data = this.data.listFR;
                this.setData({
                  listFR: old_data.concat(new_data).reverse(),
                });
              });
          }
          wx.createSelectorQuery()
            .select("#tabsSwiperFR")
            .boundingClientRect((res) => {
              this.setData({
                tabFR: res.height,
              });
            })
            .exec();
          return old_data.concat(new_data).reverse();
        }
      });

    Promise.all([articleEN, articleDE, articleFR, notice]).then((result) => {
      if (_Loading == true) {
        wx.hideLoading();
        _Loading = false;
      }

      wx.showTabBar();
      var titleEN;
      var titleDE;
      var titleFR;
      if (typeof result[0] != "undefined") {
        titleEN = result[0];
      } else {
        titleEN = [];
      }
      if (typeof result[1] != "undefined") {
        titleDE = result[1];
      } else {
        titleDE = [];
      }
      if (typeof result[2] != "undefined") {
        titleFR = result[2];
      } else {
        titleFR = [];
      }
      title = titleEN.concat(titleDE).concat(titleFR);
      this.setData({
        searchauth: false,
      });
      if (result[3].data.messeage != "") {
        this.setData({
          notice: result[3].data.messeage,
        });
      } else {
        this.setData({
          hideNotice: true,
          show: true,
        });
      }
    });
  },

  switchNotice: function () {
    this.setData({
      hideNotice: true,
      show: true,
    });
  },
  wxSearchTab: function () {
    if (!this.data.searchauth) {
      this.setData({
        searchbar: true,
      });
    }
  },

  onShow: function () {
    this.setData({
      searchbar: false,
    });
  },

  onTabCLick(e) {
    const index = e.detail.index;
    this.setData({ activeTab: index });
  },

  onChange(e) {
    const index = e.detail.index;
    this.setData({ activeTab: index });
  },

  searchInputAction: function (e) {
    var value = e.detail.value;
    var search = [];

    title.forEach((item) => {
      console.log(item);
      if (
        (item.titleCN.indexOf(value) != -1 ||
          item.titleFO.indexOf(value) != -1) &&
        value != ""
      ) {
        search.push(item);
      }
    });

    this.setData({
      search: search,
    });
  },
  closeSearch: function () {
    this.setData({
      searchbar: false,
    });
  },
});
