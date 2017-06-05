


var VF = require('../../verify/verifyNum/verify.js');
var hp = require('../../../utils/HPUtils.js');
var app = getApp();
Page({
  data: {
    //活动背景图片的OSS基本地址
    fs_discovery_DownLoad_HostURL: app.OSS.fs_discovery_DownLoad_HostURL,
    // 是否点击更多
    isMore: false,
  },
  onLoad: function (options) {

    var that = this;

    if (app.user) {
      this.onLoadMothod(options)
    } else {

      VF.checkUserBindPhoneNumber(function (result) {
        if (result == 1) {
          that.onLoadMothod(options)
        }
      })
    }

    
    


  },
  onLoadMothod: function (options){
    var that = this;
    //保存活动id
    this.setData({
      actId: options.actId
    });
    //加载已发布内容GET
    this.loadReleasedData(options.actId, function (releasedData) {
      that.setData({
        releasedData: releasedData
      });
    });
  },
  onShow: function (options) {
    console.log("onShow", this.data.releasedData);
  },

  //加载已发布内容GET /marketing/picture/{marketingId}/{uid}
  loadReleasedData: function (actId, callback) {
    var that = this;
    var uid = app.user.id;
    var urlStr = app.basicURL + 'marketing/picture/' + actId + '/' + uid;
    hp.request('GET', urlStr, {}, function (res) {
      //将数据回调

      // 图片解析imgs
      var imgStr = res.body.picture;
      var images = imgStr.split(',');
      // 去除空元素
      var imgs = [];
      for (var i = 0; i < images.length; i++) {
        var str = images[i];



        if (str != "") {
          var obj = {
            img: str
          }
          imgs.push(obj);
        }
      }
      res.body.imgs = imgs;

      // 头像解析
      var portriat = res.body.portriat;
      console.log('头像解析portriat', portriat);
      if (portriat == undefined || portriat.length == 0) {
        portriat = '';
      } else {
        console.log('indexOf', portriat.indexOf('http'));
        if (portriat.indexOf('http') < 0) {//不以http开头
          portriat = app.OSS.user_portrait_DownLoad_HostURL + '/' + portriat;
        }
      }
      res.body.portriat = portriat;

      // 点赞人名解析
      var likeUsuer = res.body.likeUsuer;
      if (likeUsuer.length == 0) {
        res.body.nicknames = "";
      } else {
        var nicknames = "";
        var length = likeUsuer.length;
        for (var i = 0; i < length - 1; i++) {
          nicknames += likeUsuer[i].nickName + '、';
        }
        nicknames += likeUsuer[length - 1].nickName;
        console.log('nicknames', nicknames);
        console.log('nicknamesLength', nicknames.length);
        res.body.nicknames = nicknames;
      }
      callback(res.body);
    });
  },
  //点赞事件
  zanMethod: function () {
    var that = this;
    var url = app.basicURL + 'marketing/likeUser';
    var para = {
      "likeUid": app.user.id,
      "marketUid": this.data.releasedData.uid,
      "marketingId": this.data.actId
    };
    console.log('para', para);
    hp.request('POST', url, para, function (res) {
      console.log('点赞事件', res);
      if (res.status == 0) {
    //加载已发布内容GET
    that.loadReleasedData(that.data.actId, function (releasedData) {
      console.log('点赞事件releasedData', releasedData);
      // 取出第一次加载图片的尺寸
      releasedData.imgs = that.data.imgs;
      that.setData({
        releasedData: releasedData
      });
    });
      }
    })

  },
  //更多点击事件
  showMoreNicknames: function () {
    this.setData({
      isMore: true
    });
    console.log('更多点击事件');
  },
  //收起点击事件
  showLessNicknames: function () {
    this.setData({
      isMore: false
    });
    console.log('收起点击事件');
  },
  // 加载活动详情的图片信息尺寸
  changeDetailImageSize: function (e) {
    console.log('加载活动详情的图片信息尺寸', e);
    //图片的位置
    var imgidx = e.currentTarget.dataset.idx;
    //取出图片
    var imgInfo = this.data.releasedData.imgs[imgidx];
    //图片的真实宽高属性
    var width = e.detail.width;
    var height = e.detail.height;
    //为该张图片添加宽高属性
    var imgArr = [];

    imgInfo.w = 700;
    imgInfo.h = 700 * height / width


    //更新渲染层数据
    this.setData({
      releasedData: this.data.releasedData,
      // 缓存第一次加载图片的尺寸
      imgs: this.data.releasedData.imgs
    });
    console.log('更新渲染层数据', this.data.releasedData);
  },
  //页面分享按钮
  // onShareAppMessage: function () {
  //   return {
  //     title: '快来帮' + app.user.nickname + '点赞助力拿鱼杆',
  //     path: '/pages/activity/activitySee/activitySee'
  //   }
  // },
})