// pages/activity/activityEnd/activityEnd.js



var VF = require('../../verify/verifyNum/verify.js');
var hp = require('../../../utils/HPUtils.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //活动背景图片的OSS基本地址
    fs_discovery_DownLoad_HostURL: app.OSS.fs_discovery_DownLoad_HostURL,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var dataStr = decodeURIComponent(options.act)
    var dataJson = JSON.parse(dataStr)

    console.log('传过来的活动', dataJson)
    this.setData({
      actId: dataJson.id,
      info: dataJson
    })

    //加载回顾文章列表
    var that = this;
    this.loadReviewArticles(function (res) {
      console.log('加载回顾文章列表', res.body)
      //保存文章列表
      that.setData({
        reviewArts: res.body
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.data.audioCtx = wx.createAudioContext('myAudio');
    // //播放音乐
    // this.audioPlayAndPause();
    //如果网速慢的情况就不会自动播放了,可能因为上下文还没创建好所以还需要搞个定时任务检查一下,确保能够播放
    var that = this;
    setTimeout(function () {
      that.data.audioCtx = wx.createAudioContext('myAudio');
      that.setData({
        isplayingAudio: false
      });
      that.audioPlayAndPause();
    }, 3000);
  },
  // 暂停和播放背景音乐
  audioPlayAndPause: function () {
    //判断是播放还是暂停
    if (this.data.isplayingAudio == true) {
      // console.log('暂停');
      this.data.audioCtx.pause();
      this.setData({
        isplayingAudio: false
      });
    } else {
      // console.log('开始');
      this.data.audioCtx.play();
      this.setData({
        isplayingAudio: true
      });
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //-----------------------------------回顾页面的方法-----------------------------------//
  loadReviewArticles: function (callback) {
    //通过数据来看 
    var urlStr = app.basicURL + 'campaign/article/list/' + this.data.actId;
    hp.request('GET', urlStr, {}, function (res) {
      //回调出去
      callback(res);
    });
  },
  //当点击回顾文章使,调用
  showReviewArticlesDetail: function (e) {
    // 暂停音乐
    this.audioPlayAndPause()
    var artId = e.currentTarget.dataset.art.id
    wx.navigateTo({
      url: '/pages/activity/activityDetail/reviewArticles/reviewArticles?artId=' + artId
    });
  },
  gotoActivityDetail:function(){
    // 暂停音乐
    this.audioPlayAndPause()
    wx.navigateTo({
      url: '/pages/activity/activityDetail/activityDetail?actId=' + this.data.actId
    })
  },
})