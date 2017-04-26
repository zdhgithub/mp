// pages/paying/shopPayingSuccess/shopPayingSuccess.js
var app = getApp();
Page({
  data:{
  },
  onLoad:function(options){
    //将传过来的奖励金额保存起来
    this.setData({
      award:options.award
    });
    //为app对象设置一个值,标识已经登录成功了
    app.isShopPayingSuccess = true;   
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  //当点击返回的时候调用
  backClicked:function(){
    //返回到购票列表
    wx.navigateBack({
      delta: 1
    })
  }
})