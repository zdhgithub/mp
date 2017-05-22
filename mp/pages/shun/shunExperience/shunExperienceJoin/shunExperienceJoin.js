// pages/shun/shunExperience/shunExperienceJoin/shunExperienceJoin.js


var VF = require('../../../verify/verifyNum/verify.js');
var hp = require('../../../../utils/HPUtils.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

// address:"广东省深圳市福田区深南大道"
// errMsg : "chooseLocation:ok"
// latitude : 22.54068116798577
// longitude:114.05726718518066
// name :"福田区中心区深南大道市民广场"
  // 选择位置
  chooseLocation: function () {
    console.log('选择位置')
    wx.chooseLocation({
      success: function(res) {
        console.log('选择位置success',res)
        var lat = res.latitude
        var log = res.longitude
        var name = res.name

      },
      fail: function(res) {
        console.log('选择位置fail', res)
        wx.showToast({
          title: '选择位置失败，请重新选择',
          icon: 'loading',
          duration: 2000
        })
      },

    })

  },
  // 申请
  applyFor:function(){
    console.log('申请')

  },
  // 取消
  cancal: function () {
    console.log('取消')
  },
})