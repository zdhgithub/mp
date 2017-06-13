


var VF = require('../../../verify/verifyNum/verify.js');
var hp = require('../../../../utils/HPUtils.js');
var app = getApp();
Page({
  data: {
    // 悬浮视图初始位置
    left: app.sysInfo.windowWidth - 54,
    top: 240,
    items: [
      { img: 'https://app-discovery.oss-cn-shenzhen.aliyuncs.com/mp/ma2.png' },
      { img: 'https://app-discovery.oss-cn-shenzhen.aliyuncs.com/mp/ld.png' },
    ],
  },
  onLoad: function (options) {

    if (app.user) {

    } else {

      VF.checkUserBindPhoneNumber(function (result) {
        if (result == 1) {

        }


        
      })
    }
    console.log("onLoad", options);
  },
  onShow: function (options) {
    console.log("onShow");
  },
  // 加载图片信息尺寸
  changeImageSize: function (e) {
    console.log('加载活动详情的图片信息尺寸', e);
    //图片的位置
    var imgidx = e.currentTarget.dataset.imgidx;
    //取出图片
    var imgInfo = this.data.items[imgidx];
    //图片的真实宽高属性
    var width = e.detail.width;
    var height = e.detail.height;
    //为该张图片添加宽高属性
    imgInfo.width = 750;
    imgInfo.height = 750 * height / width;
    //更新渲染层数据
    this.setData({
      items: this.data.items
    });
  },
  //页面分享按钮
  onShareAppMessage: function () {
    return {
      title: app.user.nickName + '邀钓鱼人一起拿大奖',
      path: '/pages/activity/activitySale/activitySaleDetail/activitySaleDetail'
    }
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