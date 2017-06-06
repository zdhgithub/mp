

var VF = require('../../verify/verifyNum/verify.js');
var hp = require('../../../utils/HPUtils.js');
var app = getApp();
Page({
  data: {
    // 悬浮视图初始位置
    left: app.sysInfo.windowWidth - 54,
    top: 240,
    items: [
      {
        img: "https://app-discovery.oss-cn-shenzhen.aliyuncs.com/mp/bs1.png",
        // w: 750,
        // h: 763
      },
      {
        img: "https://app-discovery.oss-cn-shenzhen.aliyuncs.com/mp/bs2.png",
        // w: 750,
        // h: 763
        },
      {
        img: "https://app-discovery.oss-cn-shenzhen.aliyuncs.com/mp/bp.png",
        // w: 750,
        // h: 2000
        },
      {
        img: "https://app-discovery.oss-cn-shenzhen.aliyuncs.com/mp/bs3.png",
        // w: 750,
        // h: 778
        },
    ],
  },
  onLoad: function (options) {
    wx.clearStorage();
    console.log("onLoad");
    console.log('onLoad items', this.data.items);
    //保存活动id
    this.setData({
      actId: options.actId
    });

    if (app.user) {

    } else {

      VF.checkUserBindPhoneNumber(function (result) {
        if (result == 1) {

        }
      })
    }

  },
  onShow: function (options) {
    console.log("onShow");
    // console.log('onShow items', this.data.items);
  },
  //页面分享按钮
  onShareAppMessage: function () {
    return {
      title: '舜·全国盛大招商，用数字营销做大市场',
      path: '/pages/shun/shunBusiness/shunBusiness'
    }
  },
  changeImgSize: function (e) {
    // console.log('图片加载完成', e);

    var index = e.currentTarget.dataset.idx;
    var img = this.data.items[index];
    // 获得图片尺寸
    var imgw = e.detail.width;
    var imgh = e.detail.height;
    // 重新设置图片尺寸
    img.w = 750;
    img.h = 750*imgh/imgw;

    this.setData({
      items: this.data.items
    });
  },
  releaseViewTouchMove: function (e) {

    var windowWidth = app.sysInfo.windowWidth
    var windowHeight = app.sysInfo.windowHeight

    // 拖动视图尺寸
    let viewW = 44
    let viewH = 100
    // 边界距离
    let distance = 10

    var x = e.touches[0].clientX - viewW * 0.5
    var y = e.touches[0].clientY - viewH * 0.5

    if (x < distance) { x = distance }
    else if (x > windowWidth - viewW - distance) { x = windowWidth - viewW - distance }
    else { }

    if (y < distance) { y = distance }
    else if (y > windowHeight - viewH - distance) { y = windowHeight - viewH - distance }
    else { }
    // console.log('x:' + x, 'y:' + y)
    this.setData({
      left: x,
      top: y
    })
  },
  // 点击右上角帮他分享
  shareTap: function () {
    console.log('点击右上角帮他分享');
    this.setData({
      isShareMask: true
    })
    console.log("点击右上角帮他分享", this.data.isShareMask);
  },
  hiddenMask: function () {
    this.setData({
      isShareMask: false
    })
  },
})