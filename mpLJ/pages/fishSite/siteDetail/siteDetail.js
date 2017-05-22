// pages/fishSite/siteDetail/siteDetail.js
var app = getApp();
var hp = require('../../../utils/HPUtils.js');
Page({
  data: {

  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      id: options.fishSiteId
    });
    //加载数据
    var that = this;
    this.loadFishSiteData(options.fishSiteId, function (fishSite) {
      that.setData(fishSite);
      //设置导航栏标题
      wx.setNavigationBarTitle({
        title: fishSite.fishSiteName
      })
      //将钓场的照片地址分隔成数组
      var pics = fishSite.resources;

      var picsArr = pics.split(',');

      var newPicsArr = [];

      for (var i = 0; i < picsArr.length; i++) {
        var pic = picsArr[i];
        if (pic.length != 0) {
          newPicsArr.push(picsArr[i]);
        }
      }
      //保存到data中
      that.setData({
        pics: newPicsArr
      })
      //加载鱼塘信息
      var urlStr = app.basicURL + 'sites/pond/list/' + fishSite.fishSiteId;
      hp.request('GET', urlStr, {}, function (res) {
        //成功后保存起来
        that.setData(res)
      });
    });
  },
  //加载钓场信息
  loadFishSiteData: function (fishSiteId, callback) {
    //
    var urlStr = app.basicURL + 'sites/site/' + fishSiteId
    hp.request('GET', urlStr, {}, function (res) {
      //执行回调
      callback(res.body);
    });
  },
  //点击'购票'按钮的时候调用
  buyTicketClicked: function () {

    //跳转到购票界面
    var urlStr = '/pages/fishSite/ticketPage/ticketPage?fishSiteId=' + this.data.fishSiteId;
    wx.navigateTo({
      url: urlStr
    })

  },
  //当钓场图片的头部区域被点击的时候调用
  siteImageDetail: function (e) {
    //console.log(e.currentTarget.dataset.pics);
    var url = '/pages/fishSite/siteDetail/picsDetail/picsDetail?pics=' + e.currentTarget.dataset.pics;
    wx.navigateTo({
      url: url
    })
  },
  //页面分享按钮
  onShareAppMessage: function () {
    var title = '【黑漂钓鱼】' + (this.data.fishSiteName ? this.data.fishSiteName : '') + '详情全了解';
    return {
      title: title,
      path: '/pages/fishSite/siteDetail/siteDetail?fishSiteId=' + this.data.id
    }
  },
})