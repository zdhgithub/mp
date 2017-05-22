

var VF = require('../../verify/verifyNum/verify.js');
var hp = require('../../../utils/HPUtils.js');
var app = getApp();
Page({
  data: {
    items: [
      {
        img: "https://app-discovery.oss-cn-shenzhen.aliyuncs.com/mp/v1.mp4",
        // w: 750,
        // h: 422,
        video: true
      },
      {
        img: "https://app-discovery.oss-cn-shenzhen.aliyuncs.com/mp/wv.png",
        // w: 750,
        // h: 1334,
        video: false
      },
      {
        img: "https://app-discovery.oss-cn-shenzhen.aliyuncs.com/mp/v2.mp4",
        // w: 750,
        // h: 600,
        video: true
      },
    ],
  },
  onLoad: function (options) {
    console.log("onLoad", this.data.items);
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
      title: '(视频)舜·只为见证这一刻 永留存',
      path: '/pages/shun/shunVideo/shunVideo'
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