// pages/shun/shunExperience/shunExperienceModify/shunExperienceModify.js



var VF = require('../../../verify/verifyNum/verify.js');
var hp = require('../../../../utils/HPUtils.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 渔具店名
    sn: '',
    // 姓名
    n: '',
    // 地址
    ad: '',
    // 经纬度
    lat: '',
    lon: '',
    // 记录开关状态的数组
    switchArr: [
      { idx: 0, bl: false },
      { idx: 1, bl: false },
      { idx: 2, bl: false },
      { idx: 3, bl: false },
      { idx: 4, bl: false },
    ],
    items: [
      {
        text: '一杆钓江山·舜·540',
        have: false
      },
      {
        text: '一杆钓江山·舜·630',
        have: false
      },
      {
        text: '一杆钓江山·舜·720',
        have: false
      },
      {
        text: '一杆钓江山·舜·810',
        have: false
      },
      {
        text: '一杆钓江山·舜·900',
        have: false
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.seeInfo(function (res) {
      that.setData({
        info: res.data
      })
    })
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
  // 查询当前加盟商信息
  seeInfo: function (callback) {
    var url = app.basicV2Url + 'alliance/' + app.user.id;

    hp.ctoRequest('Get', url, {}, function (res) {
      console.log('查询当前加盟商信息', res)
      callback(res)
    })
  },
  // 修改位置
  modifyLocation: function () {
    var that = this;
    console.log('修改位置')
    wx.chooseLocation({
      success: function (res) {

        var location = {
          lat: res.latitude,
          lon: res.longitude,
          name: res.name,
          addr: res.address
        }
        that.setData({
          location: location
        })

        console.log('选择位置success', res, that.data.location.addr)

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
  inputShopName: function (e) {
    console.log('修改 shop', e.detail.value)
    this.setData({
      sn: e.detail.value
    })
  },
  inputName: function (e) {
    console.log('修改 name', e.detail.value)
    this.setData({
      n: e.detail.value
    })
  },
  inputAddr: function (e) {
    console.log('修改 addr', e.detail.value)
    this.setData({
      ad: e.detail.value
    })
  },
  modifyLocation: function () {
    var that = this;
    console.log('选择位置')
    wx.chooseLocation({
      success: function (res) {

        var info = that.data.info;
        info.latitude = res.latitude;
        info.longitude = res.longitude;

        that.setData({
          info: info
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
  switchChange: function (e) {

    var idx = e.currentTarget.dataset.idx;
    var bl = e.detail.value;

    var arr = this.data.switchArr;

    for (var i = 0; i < arr.length; i++) {
      var obj = arr[i];
      if (obj.idx == idx) {
        obj.bl = bl;
      }
    }

    console.log('开关事件', obj, this.data.switchArr)

  },
  modifyMethod: function (callback) {

    var url = app.basicV2Url + 'alliance/' + app.user.id

    var info = this.data.info

    var shopName = (this.data.sn.length == 0) ? info.shopName : this.data.sn
    var name = (this.data.n.length == 0) ? info.name : this.data.n
    var address = (this.data.ad.length == 0) ? info.address : this.data.ad
    var longitude = (this.data.lon.length == 0) ? info.longitude : this.data.lon
    var latitude = (this.data.lat.length == 0) ? info.latitude : this.data.lat
    var stock = JSON.stringify(this.data.switchArr)

    var para = {
      "shopName": shopName,
      "name": name,
      "address": address,
      "longitude": longitude,
      "latitude": latitude,
      "stock": stock
    }
    console.log('修改信息参 para', para)
    wx.showToast({
      title: '修改中...',
      icon: 'loading',
      mask: true,
      duration: 10000
    })
    hp.ctoRequest('PUT', url, para, function (res) {
      console.log('修改信息 res', res)
      wx.hideToast()
      callback(res)
    })
  },
  // 修改
  modify: function () {
    console.log('修改')
    this.modifyMethod(function (res) {
      if (res.statusCode == 200) {
        wx.showToast({
          title: '修改成功'
        })
        // 2秒后返回
        setTimeout(wx.navigateBack({}), 2000)
      }
    })
  },
  // 取消
  cancal: function () {
    console.log('取消')
    wx.navigateBack({})
  },
})