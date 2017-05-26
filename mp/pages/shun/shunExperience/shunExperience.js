// pages/shun/shunExperience/shunExperience.js

var VF = require('../../verify/verifyNum/verify.js');
var hp = require('../../../utils/HPUtils.js');
var app = getApp();

function getRandomColor() {
  const rgb = []
  for (let i = 0; i < 3; ++i) {
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length == 1 ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    screenWidth: app.sysInfo.screenWidth,
    bgColor: getRandomColor(),
    poster: 'https://app-discovery.oss-cn-shenzhen.aliyuncs.com/mp/sun-bp.png',
    // 状态0 未加盟  1已加盟  2审核中 审核失败-1
    join: 0,
    imgs: [
      { img: '/images/shun/experience/11.png' },
      { img: '/images/shun/experience/22.png' },
      { img: '/images/shun/experience/33.png' },
    ],
    items: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('SystemInfo', app.sysInfo);
  },
  // 获取当前经纬度
  getUserLoction: function (callback) {
    wx.getLocation({
      success: function (res) {
        console.log('获取当前经纬度 success', res)
        var loc = {
          lon: res.longitude,
          lat: res.latitude
        }
        callback({ isTrue: true, loc: loc })
      },
      fail: function (res) {
        console.log('获取当前经纬度 fail', res)
        callback({ isTrue: false, loc: null })
      },
    })
  },
  // 加载附近3条店铺信息
  loadNear3ShopInfo: function (lon, lat, callback) {

    var url = app.basicV2Url + 'alliance/top/3?longitude=' + lon + '&latitude=' + lat

    hp.ctoRequest('GET', url, {}, function (res) {
      callback(res)
    })
  },
  onLoadMethod: function () {

    var that = this;
    this.getUserLoction(function (res) {
      console.log('getUserLoction', res)
      that.loadNear3ShopInfo(res.loc.lon, res.loc.lat, function (res) {


        var arr = res.data;
        for (var i = 0; i < arr.length; i++) {
          var obj = arr[i]

          var store = JSON.parse(obj.stock)

          if (store != null) {
            for (var j = 0; j < store.length; j++) {
              var storeObj = store[j]
              if (j == 0) { storeObj.text = '一杆钓江山.舜.540' }
              else if (j == 1) { storeObj.text = '一杆钓江山.舜.630' }
              else if (j == 2) { storeObj.text = '一杆钓江山.舜.720' }
              else if (j == 3) { storeObj.text = '一杆钓江山.舜.810' }
              else if (j == 4) { storeObj.text = '一杆钓江山.舜.900' }
            }
          }


          obj.store = store
          console.log('stock', obj.stock)
          console.log('store', obj.store)

          var distance = (obj.duration * 0.001).toFixed(1)
          console.log('distance类型', typeof (distance))
          obj.distance = distance;

        }



        that.setData({
          items: res.data
        })
        console.log('加载附近3条店铺信息', that.data.items)
      })
    })
  },
  onShowMethod: function () {
    var that = this;

    this.searchJoinOrNot(function (res) {
      // 未加盟
      if (res.data === "") {
        console.log('未加盟')
        that.setData({
          join: 0
        })
      }
      // 0：审核中  1：审核已通过  -1：审核未通过
      else if (res.data == 0) {
        console.log('审核中')
        that.setData({
          join: 2
        })
      }
      else if (res.data == 1) {
        console.log('审核已通过')
        that.setData({
          join: 1
        })
      }
      else if (res.data == -1) {
        console.log('审核未通过 == 未加盟')
        that.setData({
          join: -1
        })
      }
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

    var that = this;

    if (app.user) {
      this.onLoadMethod()
      this.onShowMethod()
    } else {

      VF.checkUserBindPhoneNumber(function (result) {
        console.log(result)
        if (result == 1) {
          console.log('已经绑定手机号')
          that.onLoadMethod()
          that.onShowMethod();
        }
      })
    }

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
    this.onLoadMethod()
    this.onShowMethod()
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
    return {
      title: app.user.nickName + '邀您一起体验舜！',
      path: '/pages/shun/shunExperience/shunExperience'
    }
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
  // 图片加载完成
  changeImgSize: function (e) {
    console.log(e)
    var w = e.detail.width;
    var h = e.detail.height;
    this.setData({
      w: 750,
      h: 750 * h / w
    })
  },
  // 我要加盟
  wantToJoin: function () {
    wx.navigateTo({
      url: '/pages/shun/shunExperience/shunExperienceJoin/shunExperienceJoin?join=' + this.data.join,
    })
  },
  // 修改信息
  modifyInfo: function () {
    wx.navigateTo({
      url: '/pages/shun/shunExperience/shunExperienceModify/shunExperienceModify',
    })
  },
  // 审核中...
  checking: function () {
    console.log('审核中...');
  },
  // 一键导航
  navMethod: function (e) {
 
    console.log('一键导航')
    var item = e.currentTarget.dataset.item
    console.log(item)

    wx.openLocation({
      latitude: item.latitude,
      longitude: item.longitude,
      scale: 28,
      name: item.shopName,
      address: item.address,
      success: function (res) {
        console.log('success', res)
      },
      fail: function (res) {
        console.log('fail', res)
      }
    })
  },
  // 查询加盟商状态
  searchJoinOrNot: function (callback) {
    var url = app.basicV2Url + 'alliance/status/' + app.user.id
    console.log('查询加盟商状态', url)
    // hp.ctoRequest('GET', url, {}, function (res) {
    //   console.log('查询加盟商状态', res)
    //   callback(res)
    // })
    wx.request({
      url: url,
      data: {},
      method: 'GET',
      success: function (res) {

        console.log('查询加盟商状态res', res, res.data, res.errMsg);
        callback(res);
      },
      fail: function () {
        wx.showToast({
          title: '请求出错了^o^',
          icon: 'loading'
        })
      }
    })
  },
})