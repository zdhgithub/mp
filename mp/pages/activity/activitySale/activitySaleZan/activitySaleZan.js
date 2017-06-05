

var VF = require('../../../verify/verifyNum/verify.js');
var hp = require('../../../../utils/HPUtils.js');
var app = getApp();
Page({
  data: {
    // 悬浮视图初始位置
    left: app.sysInfo.windowWidth - 54,
    top: 240,
    // 是否显示分享图层
    isShareMask: false,
    //活动背景图片的OSS基本地址
    fs_discovery_DownLoad_HostURL: app.OSS.fs_discovery_DownLoad_HostURL,
    //用户头像OSS基本地址
    user_portrait_DownLoad_HostURL: app.OSS.user_portrait_DownLoad_HostURL,
    // 是否点击更多
    isMore: false,
  },
  onLoad: function (options) {
    // console.log("options", options);
    var that = this;

    if (app.user) {
      var json = JSON.parse(options.JsonStr);
      this.setData({
        releasedData: json
      });
      console.log("帮他点赞json", this.data.releasedData);
    } else {

      VF.checkUserBindPhoneNumber(function (result) {
        if (result == 1) {
          var json = JSON.parse(options.JsonStr);
          that.setData({
            releasedData: json
          });
          console.log("帮他点赞json", that.data.releasedData);
        }
      })
    }


  },
  onShow: function (options) {

    var that = this;
    if (app.user) {
      //判断是否发布
      this.judgeRelOrNot(app.user.id, this.data.releasedData.marketingId);
    } else {

      VF.checkUserBindPhoneNumber(function (result) {
        if (result == 1) {
          //判断是否发布
          that.judgeRelOrNot(app.user.id, that.data.releasedData.marketingId);
        }
      })
    }



  },
  // 判断是否发布 GET /marketing/{uid}/{mid}  1：表示已参加， 0：表示未参加
  judgeRelOrNot: function (uid, mid) {
    var that = this;
    var urlStr = app.basicURL + 'marketing/' + uid + '/' + mid;
    hp.request('GET', urlStr, {}, function (res) {
      console.log('判断是否发布', urlStr, res.body);
      if (res.body == 1) {
        that.setData({
          isReleased: true
        })
      } else {
        that.setData({
          isReleased: false
        })
      }
      console.log('isReleased', that.data.isReleased);
    })
  },
  //点赞事件
  zanMethod: function () {

    var that = this;
    var url = app.basicURL + 'marketing/likeUser';
    var para = {
      "likeUid": app.user.id,
      "marketUid": this.data.releasedData.uid,
      "marketingId": this.data.releasedData.marketingId
    };
    console.log('para', para);
    hp.request('POST', url, para, function (res) {
      console.log('点赞事件', res);
      if (res.status == 0) {
        // 加载已发布内容
        that.loadReleasedData(that.data.releasedData.marketingId, that.data.releasedData.uid, function (releasedData) {

          // 取出第一次加载图片的尺寸
          releasedData.imgs = that.data.imgs;
          that.setData({
            releasedData: releasedData
          });
          console.log('别人已发布内容', releasedData);

        })
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
  // 了解详情
  knowSaleDetail: function () {
    wx: wx.navigateTo({
      url: '/pages/activity/activitySale/activitySaleDetail/activitySaleDetail'
    })
  },
  //页面分享按钮
  onShareAppMessage: function () {
    return {
      title: '快来帮' + this.data.releasedData.nickname + '点赞助力拿鱼杆',
      path: '/pages/activity/activitySee/activitySee'
    }
  },
  // 加载活动详情的图片信息尺寸
  changeDetailImageSize: function (e) {
    console.log('加载活动详情的图片信息尺寸', e);
    //图片的位置
    var imgidx = e.currentTarget.dataset.idx;
    //取出图片
    var imgInfo = this.data.releasedData.imgs[imgidx];
    // console.log('imgInfo', imgInfo);
    //图片的真实宽高属性
    var width = e.detail.width;
    var height = e.detail.height;
    //为该张图片添加宽高属性

    imgInfo.w = 700;
    imgInfo.h = 700 * height / width


    //更新渲染层数据
    this.setData({
      releasedData: this.data.releasedData,
      // 缓存第一次加载图片的尺寸
      imgs: this.data.releasedData.imgs
    });

  },
  // 点击右上角帮他分享
  shareTap: function () {
    console.log('点击右上角帮他分享');
    this.setData({
      isShareMask: true
    })
    console.log("点击右上角帮他分享", this.data.isShareMask);
  },
  hiddenMask: function () {
    this.setData({
      isShareMask: false
    })
  },



  // ----------------------------发布及查看方法------------------------------

  //发布图片
  releasePicsClick: function () {

    var that = this;

    if (app.user) {
      console.log("发布图片");
      wx.navigateTo({
        url: '/pages/activity/activityRelease/activityRelease?actId=' + this.data.releasedData.marketingId
      })
    } else {//没登录的处理
      console.log("没登录，发毛啊");
      this.loginMethod(function (res) {
        console.log(res);
        if (res == 1) {
          wx.navigateTo({
            url: '/pages/activity/activityRelease/activityRelease?actId=' + this.data.releasedData.marketingId
          })
        }
      });
    }


  },
  //点击查看内容
  seePicsTapMethod: function () {
    var that = this;
    console.log("查看内容");
    // 加载已发布内容
    this.loadReleasedData(this.data.releasedData.marketingId, app.user.id, function (myRelData) {
      // console.log('加载我已发布内容', myRelData);

      that.setData({
        myRelData: myRelData
      });

      // 状态(0 审核中，1 通过，2 审核不通过)
      if (myRelData.status == 0) {
        that.seePicsTapChecking();
      } else if (myRelData.status == 1) {
        that.seePicsTapCheckSuccess();
      } else {
        that.seePicsTapCheckFail();
      }
    })
  },
  //审核通过 查看内容
  seePicsTapCheckSuccess: function () {
    console.log("审核通过 查看内容");
    wx.navigateTo({
      url: '/pages/activity/activitySee/activitySee?actId=' + this.data.myRelData.marketingId
    })
  },
  //审核中 查看内容
  seePicsTapChecking: function () {
    console.log("审核中 查看内容 转码前数据", this.data.myRelData);
    wx.navigateTo({
      url: '/pages/activity/activitySee/checking/checking?releasedDataJsonStr=' + JSON.stringify(this.data.myRelData)
    })
  },
  //审核失败 查看内容
  seePicsTapCheckFail: function () {
    console.log("审核失败 查看内容");
    wx.navigateTo({
      url: '/pages/activity/activitySee/checkFail/checkFail?releasedDataJsonStr=' + JSON.stringify(this.data.myRelData)
    })
  },
  //加载已发布内容GET /marketing/picture/{marketingId}/{uid}
  loadReleasedData: function (actId, uid, callback) {
    var that = this;
    var urlStr = app.basicURL + 'marketing/picture/' + actId + '/' + uid;
    hp.request('GET', urlStr, {}, function (res) {

      var obj = res.body;

      // 解析图片字符串成数组
      var picStr = obj.picture;
      // console.log('picStr', picStr);
      var arr = picStr.split(',');
      //移除空元素
      var arrRes = [];
      for (var j = 0; j < arr.length; j++) {
        var item = arr[j];

        if (item != '') {
          var imgObj = {
            img: item
          }
          arrRes.push(imgObj);
        }

        // wx.getImageInfo({
        //   src: that.data.fs_discovery_DownLoad_HostURL + '/' + item,
        //   success: function (res) {
        //     if (item != '') {
        //       var imgObj = {
        //         img: item,
        //         w:res.width,
        //         h:res.height
        //       }
        //       arrRes.push(imgObj);
        //     }
        //   }
        // })


      }
      // console.log('arr,arrRes', arr, arrRes);
      obj.imgs = arrRes;

      // 头像解析
      var portriat = obj.portriat;
      console.log('头像解析portriat', portriat);
      if (portriat == undefined || portriat.length == 0) {
        portriat = '';
      } else {
        console.log('indexOf', portriat.indexOf('http'));
        if (portriat.indexOf('http') < 0) {//不以http开头
          portriat = that.data.user_portrait_DownLoad_HostURL + '/' + portriat;
        }
      }
      obj.portriat = portriat;

      // 解析点赞人名 nicknames
      if (obj.likeCount == 0) {
        console.log('likeCount == 0');
      } else {
        var likeUsuer = obj.likeUsuer;
        var nicknames = '';
        for (var j = 0; j < likeUsuer.length; j++) {
          var user = likeUsuer[j];
          var nickname = user.nickName;
          nicknames += nickname + '、';
        }
        nicknames = nicknames.substring(0, nicknames.length - 1);
        console.log('nicknames', nicknames);
        obj.nicknames = nicknames;
      }


      // 点赞列表展开状态isMore
      obj.isMore = false;

      callback(res.body);
    });
  },
  releaseViewTouchMove: function (e) {

    var windowWidth = app.sysInfo.windowWidth
    var windowHeight = app.sysInfo.windowHeight

    // 拖动视图尺寸
    let viewW = 44
    let viewH = 100
    // 边界距离
    let distance = 10

    var x = e.touches[0].clientX - viewW * 0.5
    var y = e.touches[0].clientY - viewH * 0.5

    if (x < distance) { x = distance }
    else if (x > windowWidth - viewW - distance) { x = windowWidth - viewW - distance }
    else { }

    if (y < distance) { y = distance }
    else if (y > windowHeight - viewH - distance) { y = windowHeight - viewH - distance }
    else { }
    // console.log('x:' + x, 'y:' + y)
    this.setData({
      left: x,
      top: y
    })
  },

})