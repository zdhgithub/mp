


var VF = require('../../../verify/verifyNum/verify.js');
var hp = require('../../../../utils/HPUtils.js');
var app = getApp();
Page({
  data: {
    items: [
      { img: 'https://app-discovery.oss-cn-shenzhen.aliyuncs.com/mp/ma2.png' },
      { img: 'https://app-discovery.oss-cn-shenzhen.aliyuncs.com/mp/ld.png' },
    ],
  },
  onLoad: function (options) {
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
})