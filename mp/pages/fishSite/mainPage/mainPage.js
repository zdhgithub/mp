// pages/fishSite/mainPage/mainPage.js
var hp = require('../../../utils/HPUtils.js');
var app = getApp();
Page({
  data: {
    //经纬度
    lat: 0,
    lng: 0,
    //用户是否授权获取地理位置
    isGetLocation: true,
    //是否是第一次请求用户地理位置
    isFirstTimeReq: true,
    //上拉加载的提示语
    loadMoreState: "",
    //是否正在进行上拉加载操作
    isLoadMore: false,
    //上拉加载完所有数据了的标志
    isLoadAllData: false,
    //钓场主图下载地址
    fs_profile_DownLoad_HostURL: null
  },
  onLoad: function (options) {
    // 页面初始化
    //将OSS地址赋值给data
    this.setData({
      fs_profile_DownLoad_HostURL: app.OSS.fs_profile_DownLoad_HostURL
    });
    //获取用户地理位置
    this.getUserLocation();

  },
  onReachBottom: function () {
    // Do something when page reach bottom.
    //console.log('到达底部了');
    //判断是否正在加载
    if (this.data.isLoadMore == false && this.data.isLoadAllData == false) {
      //设置上拉加载状态
      this.setData({
        "loadMoreState": "正在加载更多数据...",
        "isLoadMore": true
      });
      //请求数据
      this.loadMoreSite();
    }
  },
  //获取用户地理位置
  getUserLocation: function () {
    var that = this;
    //定位,获取当前经纬度
    wx.getLocation({
      type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function (res) {
        // success
        // console.log('获取地理位置成功了');
        // console.log(res);
        //通过经纬度拉去钓场列表
        that.loadFishSiteList(res.latitude, res.longitude);
        that.setData({
          isGetLocation: true
        });
      },
      fail: function () {
        // fail
        console.log('获取地理位置失败了');
        that.setData({
          isGetLocation: false
        });
        if (that.data.isFirstTimeReq == false) {
          wx.showToast({
            title: '您已拒绝授权,请十分钟后尝试',
            icon: 'loading',
            duration: 2000
          })
        }
        that.data.isFirstTimeReq = false;
      }
    })
  },
  //通过经纬度拉取钓场列表
  loadFishSiteList: function (lat, lng) {
    //将gcj的经纬度转换成百度的经纬度bd09
    var loc = this.gcj2bd(lat, lng);
    //将经纬度保存起来
    this.data.lat = loc[0];
    this.data.lng = loc[1];
    // console.log('百度的经纬度');
    // console.log(loc);
    //将经纬度数据保存到app对象中
    app.location = {
      lat: loc[0],
      lng: loc[1]
    };
    //加载数据
    var that = this;
    //使用的是这个接口:v1/sites/list/{uid}/{lng}/{lat}/{radius}/{index}/{size}
    //参数说明:搜索半径50公里的钓场
    //用户id这个参数 未登录 传0;
    //url
    var url = app.basicURL + 'sites/list/' + '0/' + loc[1] + '/' + loc[0] + '/50/0/10';

    hp.request('GET', url, {}, function (res) {
      //解析显示售价
      for (var i = 0; i < res.body.length; i++) {
        var site = res.body[i];

        if (site.chargeDesc == undefined) {
          //设置属性
          site.isShowCharge = false;
        }
        else {
          //判断是否显示价格
          var subStrArr = site.chargeDesc.split(',');
          if (subStrArr[0] == '0' || subStrArr[1] == '0') {
            site.isShowCharge = false;

          } else {
            site.isShowCharge = true;
            //记录下这里这两个数据
            site.charge1 = subStrArr[0];
            site.charge2 = subStrArr[1];
          }
        }
      }
      //赋值
      that.setData(res);
      if (res.body.length == 10) {
        //设置上拉加载更多的状态
        that.setData({
          isLoadMore: false,
          loadMoreState: "点击或上拉可加载更多"
        });
      } else {
        that.setData({
          isLoadAllData: true,
          isLoadMore: false,
          loadMoreState: "--哎呀,到底了--"
        });
      }
    });
  },
  //加载更多数据
  loadMoreSite: function () {

    //获取最后一个钓场的id
    var siteArr = this.data.body;
    var lastId = 0;
    if (siteArr.length > 1) {
      lastId = siteArr[siteArr.length - 1].duration;
    }
    //用户id
    var userId = 0;
    //参数说明:搜索半径50公里的钓场
    var url = app.basicURL + 'sites/list/' + userId + '/' + this.data.lng + '/' + this.data.lat + '/50/' + lastId + '/10';
    console.log(url);
    var that = this;

    hp.request('GET', url, {}, function (res) {
      //解析显示售价
      for (var i = 0; i < res.body.length; i++) {
        var site = res.body[i];

        if (site.chargeDesc == undefined) {
          //设置属性
          site.isShowCharge = false;
        }
        else {
          //判断是否显示价格
          var subStrArr = site.chargeDesc.split(',');
          if (subStrArr[0] == '0' || subStrArr[1] == '0') {
            site.isShowCharge = false;

          } else {
            site.isShowCharge = true;
            //记录下这里这两个数据
            site.charge1 = subStrArr[0];
            site.charge2 = subStrArr[1];
          }
        }
      }

      if (res.body.length == 10) {
        //将数据添加到原来的数组中并且设置状态
        that.setData({
          body: that.data.body.concat(res.body),
          isLoadMore: false,
          loadMoreState: "点击或上拉可加载更多"
        });
      } else {
        //已经全部加载完成了了
        that.setData({
          body: that.data.body.concat(res.body),
          isLoadAllData: true,
          isLoadMore: false,
          loadMoreState: "--哎呀,到底了--"
        });
      }
    });
  },

  //进入钓场详情
  gotoSiteDetail: function (e) {
    var that = this;
    // console.log(e.currentTarget.dataset.site.fishSiteId);
    //跳转到详情页面,后面拼接参数:钓场id
    var urlStr = '/pages/fishSite/siteDetail/siteDetail?fishSiteId=' + e.currentTarget.dataset.site.fishSiteId;
    console.log(urlStr);
    wx.navigateTo({
      url: urlStr
    })
  },
  //进入购票界面
  buyTicket: function (e) {
    // console.log(e);
    var url = '/pages/fishSite/ticketPage/ticketPage?fishSiteId=' + e.currentTarget.dataset.fishsite.fishSiteId;
    //界面跳转
    wx.navigateTo({
      url: url
    })
  },
  //页面分享按钮
  onShareAppMessage: function () {
    return {
      title: '点击使用小程序，无需下载更便捷',
      path: '/pages/fishSite/mainPage/mainPage'
    }
  },
  // ---------------------------gcjj02转换到百度地图经纬度方法 (这个方法有待验证)----------------------------//
  gcj2bd: function (lat, lon) {

    var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
    var x = lon, y = lat;
    var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
    var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
    var bd_lon = z * Math.cos(theta) + 0.0065;
    var bd_lat = z * Math.sin(theta) + 0.006;
    var result = [];
    result.push(bd_lat);
    result.push(bd_lon);

    return result;
  }

})