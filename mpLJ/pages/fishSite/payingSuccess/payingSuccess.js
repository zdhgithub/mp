// pages/fishSite/payingSuccess/payingSuccess.js
var app = getApp();
Page({
  data:{
  },
  onLoad:function(options){
    //将传过来的奖励金额保存起来
    this.setData({
      award:options.award
    });
    //往app对象加入一个isPaySuccess 用于标识返回的时候是否在返回票列表界面时刷新数据
    app.isPaySuccess = true;
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
  //当点击去核票的时候调用
  checkedTicketClicked:function(){
    //跳转到票列表界面
    wx.redirectTo({
      url: '/pages/mine/mySiteTicket/mySiteTicket',
      success: function(res){
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })

  },
  //当点击返回的时候调用
  backClicked:function(){
    //返回到购票列表
    wx.navigateBack({
      delta: 1
    })
  }
})