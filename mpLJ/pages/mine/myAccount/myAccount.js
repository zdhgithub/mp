// pages/mine/myAccount/myAccount.js
var app = getApp();
Page({
  data:{
    //用户数据
    user: null,
    //用户头像OSS地址
    user_portrait_DownLoad_HostURL: app.OSS.user_portrait_DownLoad_HostURL
  },
  onLoad:function(options){
    console.log(app.user);
    this.setData({
      user:app.user
    });
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
  }
})