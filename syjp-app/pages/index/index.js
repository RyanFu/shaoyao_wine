var WxParse = require('../../lib/wxParse/wxParse.js');
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../services/user.js');

//获取应用实例
const app = getApp()
Page({
  data: {
    newGoods: [],
    hotGoods: [],
    topics: [],
    //brands: [],
    floorGoods: [],
    banner: [],
    channel: [],
    notice: {}
  },
  onShareAppMessage: function () {
    return {
      title: '芍药酒铺',
      desc: '芍药酒铺',
      path: '/pages/index/index'
    }
  },

  getIndexData: function () {
    let that = this;
    util.request(api.IndexUrl).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          newGoods: res.data.newGoodsList,
          hotGoods: res.data.hotGoodsList,
          topics: res.data.topicList,
          //brand: res.data.brandList,
          floorGoods: res.data.categoryList,
          banner: res.data.banner,
          channel: res.data.channel,
          // notice: res.data.notice
        });
        WxParse.wxParse('notice', 'html', res.data.notice, that);
      }
    });
  },
  onLoad: function (options) {
    var that = this;
    that.goLogin(function () {
      that.getIndexData();
    });
    // that.getIndexData();
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  goLogin: function (callback) {
    user.loginByWeixin().then(res => {
      this.setData({
        userInfo: res.data.userInfo
      });
      app.globalData.userInfo = res.data.userInfo;
      app.globalData.token = res.data.token;
      callback();
    }).catch((err) => {
      console.log(err)
    });
  }
})