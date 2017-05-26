// pages/shun/shunExperience/shunExperienceJoin/shunExperienceJoin.js


var VF = require('../../../verify/verifyNum/verify.js');
var hp = require('../../../../utils/HPUtils.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneNumber: '',
    shopName: '',
    name: '',
    address: '',
    lon: '',
    lat: '',
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
  // onShareAppMessage: function () {

  // },

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
  inputPhone: function (e) {
    this.setData({
      phoneNumber: e.detail.value
    })
    console.log('inputPhone', this.data.phoneNumber)
  },
  inputShopName: function (e) {
    this.setData({
      shopName: e.detail.value
    })
    console.log('shopName', this.data.shopName)
  },
  inputName: function (e) {
    this.setData({
      name: e.detail.value
    })
    console.log('name', this.data.name)
  },
  inputAddr: function (e) {
    this.setData({
      address: e.detail.value
    })
    console.log('address', this.data.address)
  },

  // 选择位置
  chooseLocation: function () {

    var that = this;
    console.log('选择位置')
    wx.chooseLocation({
      success: function (res) {

        that.setData({
          lat: res.latitude,
          lon: res.longitude,
          addrName: res.name
        })

        console.log('选择位置success', res, that.data.lat)

      },
      fail: function (res) {
        console.log('选择位置fail', res)
        if (res.errMsg == 'chooseLocation:fail cancel') {
          wx.showToast({
            title: '选择位置失败，请重新选择',
            icon: 'loading',
            duration: 2000
          })
        } else if (res.errMsg == 'chooseLocation:fail auth deny') {
          wx.showToast({
            title: '您已拒绝授权，请10分钟后重试',
            icon: 'loading',
            duration: 2000
          })
        } else { }

      },

    })

  },
  // 申请
  applyFor: function () {
    console.log('申请')
    this.join(function (res) {
      if (res.statusCode == 201) {
        wx.showToast({
          title: '申请已提交',
        })
        // 2秒后调用函数
        var time = setTimeout(function () {
          wx.navigateBack({})
        }, 2000)

      }else{
        wx.showToast({
          title: '申请失败',
          icon:'loading'
        })
      }
    })
  },
  // 取消
  cancal: function () {
    console.log('取消')
    wx.navigateBack({})
  },
  join: function (callback) {
    // 显示菊花
    wx.showToast({
      title: '申请中...',
      icon: 'loading',
      mask: true,
      duration: 10000
    })

    var url = app.basicV2Url + 'alliance'
    
    if (this.data.phoneNumber.isPhoneNum() == false) {
      wx.showToast({
        title: '手机号码有误，请重新输入',
        icon: 'loading'
      })
      return
    } else if (this.data.shopName.length == 0) {
      wx.showToast({
        title: '请输入渔具店名称',
        icon: 'loading'
      })
      return
    } else if (this.data.name.length == 0) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'loading'
      })
      return
    } else if (this.data.address.length == 0) {
      wx.showToast({
        title: '请输入地址',
        icon: 'loading'
      })
      return
    } else if (this.data.lat.length == 0 || this.data.lon.length == 0) {
      wx.showToast({
        title: '请选择位置',
        icon: 'loading'
      })
      return
    }

    var para = {
      "uid": app.user.id,
      "phoneNumber": this.data.phoneNumber,
      "shopName": this.data.shopName,
      "name": this.data.name,
      "address": this.data.address,
      "longitude": this.data.lon,
      "latitude": this.data.lat
    }

    console.log('申请加盟 para', para)

    hp.ctoRequest('POST', url, para, function (res) {
      // 隐藏菊花
      wx.hideToast()
      console.log('申请加盟', res)
      callback(res)
    })
    


  },
})