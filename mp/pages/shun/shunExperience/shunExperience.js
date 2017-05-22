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
    // 状态0 未加盟  1已加盟  2审核中
    join: 0,
    imgs: [
      { img: '/images/shun/experience/11.png' },
      { img: '/images/shun/experience/22.png' },
      { img: '/images/shun/experience/33.png' },
    ],
    items: [
      {
        shop: '黑漂虚拟渔具店黑漂虚拟渔具店',
        name: '王先生黑漂虚拟渔具店黑漂虚拟渔具店',
        phone: 13312922911,
        addr: '深圳市福田区车公庙深圳市福田区车公庙',
        lat: 22.365425,
        lon: 114.256325,
        distance: 9,
        gan: [
          {
            text: '一杆钓江山.舜.540 有货体验',
            have: true,
          },
          {
            text: '一杆钓江山.舜.630 无货体验',
            have: false,
          },
          {
            text: '一杆钓江山.舜.720 有货体验',
            have: true,
          },
          {
            text: '一杆钓江山.舜.810 无货体验',
            have: false,
          },
          {
            text: '一杆钓江山.舜.900 有货体验',
            have: true,
          },
        ],
      },
      {
        shop: '虚拟渔具店',
        name: 'liu先生',
        phone: 13312922911,
        addr: '深圳市福田区车公庙',
        lat: 22.545425,
        lon: 114.256325,
        distance: 9,
        gan: [
          {
            text: '一杆钓江山.舜.540 有货体验',
            have: true,
          },
          {
            text: '一杆钓江山.舜.630 无货体验',
            have: false,
          },
          {
            text: '一杆钓江山.舜.720 有货体验',
            have: true,
          },
          {
            text: '一杆钓江山.舜.810 无货体验',
            have: false,
          },
          {
            text: '一杆钓江山.舜.900 有货体验',
            have: true,
          },
        ],
      },
      {
        shop: 'niu渔具店',
        name: '先生',
        phone: 13312922911,
        addr: '深圳市福田区车公庙',
        lat: 22.365425,
        lon: 114.254325,
        distance: 9,
        gan: [
          {
            text: '一杆钓江山.舜.540 有货',
            have: true,
          },
          {
            text: '一杆钓江山.舜.630 无货',
            have: false,
          },
          {
            text: '一杆钓江山.舜.720 有货',
            have: true,
          },
          {
            text: '一杆钓江山.舜.810 无货',
            have: false,
          },
          {
            text: '一杆钓江山.舜.900 有货',
            have: true,
          },
        ],
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log('SystemInfo', app.sysInfo);


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
      url: '/pages/shun/shunExperience/shunExperienceJoin/shunExperienceJoin',
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
    // wx.getLocation({
    //   type: 'gcj02', //返回可以用于wx.openLocation的经纬度
    //   success: function (res) {
    //     console.log(res)
    //     var latitude = res.latitude
    //     var longitude = res.longitude
    //     wx.openLocation({
    //       latitude: latitude,
    //       longitude: longitude,
    //       scale: 28
    //     })
    //   }
    // })

    // latitude:22.543099
    // longitude:114.057868

    console.log('一键导航')
    var item = e.currentTarget.dataset.item
    console.log(item)

    wx.openLocation({
      latitude: item.lat,
      longitude: item.lon,
      scale: 28,
      name:item.name,
      address:item.addr,
      success:function(res){
        console.log('success',res)
      },
      fail:function(res){
        console.log('fail',res)
      }
    })
  },
})