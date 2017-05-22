
var VF = require('../verify/verifyNum/verify.js');
var hp = require('../../utils/HPUtils.js');
var app = getApp();
Page({
    data: {

    },
    onLoad: function (options) {
        console.log('onLoad');
        if (app.user) {

    } else {

      VF.checkUserBindPhoneNumber(function (result) {
        if (result == 1) {

        }
      })
    }
    },
    onShow: function () {
        console.log('onShow');
    },
    // 产品介绍
    productIntroduceTap:function(){
        console.log('产品介绍');
        wx.navigateTo({
          url: '/pages/shun/shunIntroduce/shunIntroduce'
        });
    },
    // 品牌故事
    productStoryTap:function(){
        console.log('品牌故事');
        wx.navigateTo({
          url: '/pages/shun/shunStory/shunStory'
        });
    },
    // 招商
    businessTap:function(){
        console.log('招商');
        wx.navigateTo({
          url: '/pages/shun/shunBusiness/shunBusiness'
        });
    },
    // 舜·见证视频
    videoTap:function(){
        console.log('舜·见证视频');
        wx.navigateTo({
          url: '/pages/shun/shunVideo/shunVideo'
        });
    }, 
    // 舜体验店
    shunExperienceTap:function() {
      console.log('舜体验店');
      wx.navigateTo({
        url: '/pages/shun/shunExperience/shunExperience'
      });
    }, 
    //页面分享按钮
  onShareAppMessage: function () {
    return {
      title: '黑漂.一杆钓江山.舜.邀您一起鱼乐！',
      path: '/pages/shun/shun'
    }
  },
})