  


var VF = require('../../verify/verifyNum/verify.js');
var hp = require('../../../utils/HPUtils.js');
var app = getApp();
Page({
  data: {
    items: [
      {
        img: "https://app-discovery.oss-cn-shenzhen.aliyuncs.com/mp/bs.jpg",
        // w: 750,
        // h: 530
      },
      {
        img: "https://app-discovery.oss-cn-shenzhen.aliyuncs.com/mp/s.jpg",
        // w: 750,
        // h: 500
      },
      {
        img: "https://app-discovery.oss-cn-shenzhen.aliyuncs.com/mp/s3.png",
        // w: 750,
        // h: 530
      },
    ],
  },
  onLoad: function (options) {
    console.log("onLoad");
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
  },
  //页面分享按钮
  onShareAppMessage: function () {
    return {
      title: '舜·男人的第十九种武器',
      path: '/pages/shun/shunStory/shunStory'
    }
  },
  changeImgSize: function (e) {
    console.log('图片加载完成', e);

    var index = e.currentTarget.dataset.idx;
    var img = this.data.items[index];
    // 获得图片尺寸
    var imgw = e.detail.width;
    var imgh = e.detail.height;
    // 重新设置图片尺寸
    img.w = 750;
    img.h = 750 * imgh / imgw;

    this.setData({
      items: this.data.items
    });
  }
})