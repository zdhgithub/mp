// pages/activity/activityDetail/joinedPersons/joinedPersons.js
var app = getApp();
Page({
  data:{
    //用户头像OSS基本地址
    user_portrait_DownLoad_HostURL:app.OSS.user_portrait_DownLoad_HostURL
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    console.log(options);
    //传过来的数据转成json对象
    var list = options.list;
    list = decodeURIComponent(list);
    list = JSON.parse(list);


   


    this.setData({
      list:list
    });
  }
})