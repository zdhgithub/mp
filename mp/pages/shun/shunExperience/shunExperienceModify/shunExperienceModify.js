// pages/shun/shunExperience/shunExperienceModify/shunExperienceModify.js



var VF = require('../../../verify/verifyNum/verify.js');
var hp = require('../../../../utils/HPUtils.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
  items:[
    {
      text:'一杆钓江山·舜·540',
      have:true
    },
    {
      text: '一杆钓江山·舜·630',
      have: false
    },
    {
      text: '一杆钓江山·舜·720',
      have: true
    },
    {
      text: '一杆钓江山·舜·810',
      have: false
    },
    {
      text: '一杆钓江山·舜·900',
      have: true
    },
  ],
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
  // 修改位置
  modifyLocation: function () {
    console.log('修改位置')
    wx.chooseLocation({
      success: function (res) {
        console.log('选择位置success', res)
        var lat = res.latitude
        var log = res.longitude
        var name = res.name

      },
      fail: function (res) {
        console.log('选择位置fail', res)
        wx.showToast({
          title: '选择位置失败，请重新选择',
          icon: 'loading',
          duration: 2000
        })
      },

    })

  },
  // 修改
  modify: function () {
    console.log('修改')

  },
  // 取消
  cancal: function () {
    console.log('取消')
  },
})