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
      { text: '一杆钓江山·舜·540', idx: 0, bl: false },
      { text: '一杆钓江山·舜·630', idx: 1, bl: false },
      { text: '一杆钓江山·舜·720', idx: 2, bl: false },
      { text: '一杆钓江山·舜·810', idx: 3, bl: false },
      { text: '一杆钓江山·舜·900', idx: 4, bl: false },
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

    var that = this

    var url = app.basicV2Url + 'alliance/' + app.user.id;

    hp.ctoRequest('Get', url, {}, function (res) {
      console.log('查询当前加盟商信息 res', res)

      var info = res.data
      console.log('查询当前加盟商信息 info', info)
      var switchArr = that.data.switchArr
      if (info.stock == null) {
        info.store = switchArr
      } else {
        var store = JSON.parse(info.stock)
        console.log('查询当前加盟商信息 store', store)
        for (var i = 0; i < store.length; i++) {
          var storeObj = store[i]

          if (storeObj.idx == switchArr[i].idx) {
            switchArr[i].bl = storeObj.bl
          }
        }
        info.store = switchArr
      }
      console.log('查询当前加盟商信息  解析后', res)

      callback(res)
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
  // 修改位置
  modifyLocation: function () {
    var that = this;
    console.log('选择位置')
    wx.chooseLocation({
      success: function (res) {

        var info = that.data.info
        var shopName = (that.data.sn.length == 0) ? info.shopName : that.data.sn
        var name = (that.data.n.length == 0) ? info.name : that.data.n
        var address = (that.data.ad.length == 0) ? info.address : that.data.ad

        var info = that.data.info;

        info.shopName = shopName;
        info.name = name;
        info.address = address;


        info.latitude = res.latitude;
        info.longitude = res.longitude;

        // 地图坐标转火星坐标
        // var poi = {
        //   lat: res.latitude,
        //   lng: res.longitude
        // }
        // console.log('地图坐标', poi);
        // var gcj = hp.wgs2gcj(poi);
        // console.log('火星坐标', gcj);

        // info.latitude = gcj.lat;
        // info.longitude = gcj.lng;


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

    wx.showToast({
      title: '修改中...',
      icon: 'loading',
      mask: true,
      duration: 10000
    })

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
    
    hp.ctoRequest('PUT', url, para, function (res) {
      console.log('修改信息 res', res)
      callback(res)
    })
  },
  // 修改
  modify: function () {
    console.log('修改')
    this.modifyMethod(function (res) {
      if (res.statusCode == 200) {
        wx.showToast({
          title: '修改成功',
          duration:2000
        })
        // 2秒后返回
        setTimeout(function () {
          wx.navigateBack({})
        }, 2000)
      }else{
        wx.showToast({
          title: '修改失败',
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
})