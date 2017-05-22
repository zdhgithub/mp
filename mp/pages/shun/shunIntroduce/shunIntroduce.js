


var VF = require('../../verify/verifyNum/verify.js');
var hp = require('../../../utils/HPUtils.js');
var app = getApp();
Page({
  data: {
    items: [
      {
        img: "https://app-discovery.oss-cn-shenzhen.aliyuncs.com/mp/pi.jpg",
        // w: 750,
        // h: 5980
      },
    ],
  },
  onLoad: function (options) {
    console.log("onLoad", this.data.items);

    if (app.user) {

    } else {

      VF.checkUserBindPhoneNumber(function (result) {
        if (result == 1) {

        }
      })
    }
  },
  onShow: function (options) {
    console.log("onShow", this.data.items);
  },
  //页面分享按钮
  onShareAppMessage: function () {
    return {
      title: '舜·一杆钓江山，产品介绍',
      path: '/pages/shun/shunIntroduce/shunIntroduce'
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