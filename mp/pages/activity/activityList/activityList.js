// pages/activity/activityList/activityList.js
var hp = require('../../../utils/HPUtils.js');
var app = getApp();
Page({
  data: {
    //活动列表数据
    actLists: null,
    //活动背景图片的OSS基本地址
    fs_discovery_DownLoad_HostURL: app.OSS.fs_discovery_DownLoad_HostURL,
    //上拉加载的提示语
    loadMoreState: "",
    //是否正在进行下啦刷新
    isRefreshing: false,
    //是否正在进行上拉加载操作
    isLoadMore: false,
    //上拉加载完所有数据了的标志
    isLoadAllData: false,
    // 请求列表的页码
    listPage: 1

  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    this.loadActivitys(1, 10, function (lists) {
      //将数据保存起来
      if (lists.length == 10) {
        //将数据添加到原来的数组中并且设置状态
        that.setData({
          actLists: lists,
          isLoadMore: false,
          loadMoreState: "点击或上拉可加载更多"
        });
      } else {
        //已经全部加载完成了了
        that.setData({
          actLists: lists,
          isLoadAllData: true,
          isLoadMore: false,
          loadMoreState: ""
        });
      }
    });
  },
  onShow: function () {
    // 页面显示
  },
  // 下啦刷新
  onPullDownRefresh: function () {

    //判断是否正在进行下拉刷新操作
    if (this.data.isRefreshing == true) {
      return;
    }
    //设置下拉刷新操作
    this.data.isRefreshing = true;
    // 获取用户获取了几条数据了
    // var size = this.data.actLists.length > 0 ? this.data.actLists.length : 10; 这个存在一个bug,当添加新活动,刷新的时候,最后一个活动会被省略掉。于是直接固定size为10就好了。
    var size = 10;
    //加载数据
    var that = this;
    //加载数据
    this.loadActivitys(1, size, function (lists) {
      //将数据保存起来
      that.setData({
        actLists: lists
      });
      //停止刷新
      wx.stopPullDownRefresh();
      //设置下拉刷新操作
      that.data.isRefreshing = false;
    });
  },
  // 加载更多
  onReachBottom: function () {
    //判断是否正在加载
    if (this.data.isLoadMore == false && this.data.isLoadAllData == false) {
      //设置上拉加载状态
      this.setData({
        "loadMoreState": "正在加载更多数据...",
        "isLoadMore": true
      });
      //请求数据
      var that = this;
      this.loadActivitys(this.data.listPage, 10, function (lists) {
        //将数据保存起来
        if (lists.length == 10) {
          //将数据添加到原来的数组中并且设置状态
          that.setData({
            actLists: that.data.actLists.concat(lists),
            isLoadMore: false,
            loadMoreState: "点击或上拉可加载更多"
          });
        } else {
          //已经全部加载完成了了
          that.setData({
            actLists: that.data.actLists.concat(lists),
            isLoadAllData: true,
            isLoadMore: false,
            loadMoreState: "--哎呀,到底了--"
          });
        }
      });

    }
  },
  //加载活动列表
  //index:页码
  // size:范围
  //callback:回调,活动列表数据
  loadActivitys: function (index, size, callback) {
    var that = this;
    var urlStr = app.basicURL + 'campaign/list?start=' + index + '&size=' + size;

    hp.request('GET',urlStr,{},function(res){
      
        //设置时间格式
        for (var i = 0; i < res.body.length; i++) {
          var act = res.body[i];

          var beginDate = new Date(act.beginTime);

          act.beginTimeStr = beginDate.format('yyyy年MM月dd日 h:m');
        }
        //设置页码
        that.setData({
          listPage: that.data.listPage + 1
        });
        //将数据回调
        callback(res.body);
    });
  },
  //点击一个活动cell,进入活动详情页面
  gotoActivityDetail: function (e) {
    console.log(e);
    console.log("gotoActivityDetail");
    var actId = e.currentTarget.dataset.act.id;
    wx.navigateTo({
      url: '/pages/activity/activityDetail/activityDetail?actId=' + actId
    })
  },
  //点击一个活动cell,进入营销活动页面
  gotoActivitySale: function (e) {
    var actId = e.currentTarget.dataset.act.id;
    wx.navigateTo({
      url: '/pages/activity/activitySale/activitySale?actId=' + actId
    })
  },
  //页面分享按钮
  onShareAppMessage: function () {
    return {
      title: '最新最有趣的钓鱼活动尽在黑漂小程序',
      path: '/pages/activity/activityList/activityList'
    }
  },
})