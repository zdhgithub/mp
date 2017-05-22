// pages/mine/checkTktSuccess/checkTktSuccess.js
var QR = require('../mySiteTicket/qrcode.js');
var app = getApp();
Page({
  data: {
    
  },
  onLoad: function (options) {
    // 页面初始化
    this.setData({
      fishSiteName: options.fishSiteName,
      tangName: options.tangName,
      tid: options.tid,
      code: options.code
    });
    //绘制二维码
    QR.qrApi.draw(options.tid.toString(), 'qrcode', 180, 180);
    //给app对象标记一个值isCheckTktSuccess 当返回的时候就要重新加载票列表数据
    app.isCheckTktSuccess = true;
  },
  //返回按钮点击的时候调用
  backBtnClicked: function () {
    wx.navigateBack({
      delta: 1,
    })
  }
})