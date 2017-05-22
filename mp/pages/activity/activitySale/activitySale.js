// pages/activity/activitySale/activitySale.js

var VF = require('../../verify/verifyNum/verify.js');
var hp = require('../../../utils/HPUtils.js');
var app = getApp();
Page({
  data: {
    //活动id
    actId: undefined,
    //活动详细信息
    info: undefined,
    //活动背景图片的OSS基本地址
    fs_discovery_DownLoad_HostURL: app.OSS.fs_discovery_DownLoad_HostURL,
    //用户头像OSS基本地址
    user_portrait_DownLoad_HostURL: app.OSS.user_portrait_DownLoad_HostURL,
    //用户是否登录了
    isLogin: false,
  },
  onLoad: function (options) {
    console.log("onLoad", options);
    //保存活动id
    this.setData({
      actId: options.actId
    });
    //判断用户是否已经登录了
    if (app.user) {
      this.setData({
        isLogin: true
      });
    }
    //加载活动详情信息
    var that = this;
    this.loadActivityData(options.actId, function (data) {
      that.setData({
        info: data
      });
    })
    //加载图片列表
    var that = this;
    this.loadPicsData(this.data.actId, function (picsList) {
      // console.log('picsList', picsList);
      that.setData({
        picsList: picsList
      });
    })

  },
  onShow: function (options) {
    //判断是否发布
    this.judgeRelOrNot(app.user.id, this.data.actId);
    console.log("onShow", this.data.isReleased);
  },

  // ------------------------------活动页面的内容------------------------------//
  //加载活动详情
  loadActivityData: function (id, callback) {
    var urlStr = app.basicURL + 'marketing/marketing/' + id;
    hp.request('GET', urlStr, {}, function (res) {

      console.log('营销活动详情', res);
      // //设置时间格式
      // var act = res.body;
      // //开始时间
      // var beginDate = new Date(act.beginTime);
      // act.beginTimeStr = beginDate.format('yyyy-MM-dd hh:mm');
      // //结束时间
      // var endDate = new Date(act.endTime);
      // act.endTimeStr = endDate.format('yyyy-MM-dd hh:mm');
      // //报名截止时间
      // var entryTerminalDate = new Date(act.entryTerminalTime);
      // act.entryTerminalTimeStr = entryTerminalDate.format('yyyy-MM-dd hh:mm');

      //解析活动详情
      var detailStr = res.body.detail;
      // console.log('detailStr', detailStr);

      //用于分隔成段落的
      var FGstr = String.fromCharCode(31);

      //用于标识文本段落
      var FGtext = String.fromCharCode(26);
      //用于标识图片
      var FGimg = String.fromCharCode(30);
      //用于标识图片
      var FGmov = String.fromCharCode(34);

      //通过\31分隔
      var conArr = detailStr.split(FGstr);
      // console.log('分隔的数据', conArr);

      //创建一个空数据 用来装数据的
      var detailInfoArr = [];
      for (var i = 0; i < conArr.length; i++) {
        var con = conArr[i];
        //截取后面的字符串
        var flag = con.substring(con.length - 1);

        if (flag == FGtext) {
          // console.log('是文本');
          //创建一个对象
          var textCon = {
            flag: 0,
            content: con.substring(0, con.length - 1)
          }
          //添加到数组中
          detailInfoArr.push(textCon);
        }
        else if (flag == FGimg) {
          // console.log('是图片');
          //创建一个对象
          var imgCon = {
            flag: 1,
            content: con.substring(0, con.length - 1)
          }
          //添加到数组中
          detailInfoArr.push(imgCon);
        } else if (flag == FGmov) {
          //创建一个对象
          var movCon = {
            flag: 2,
            content: con.substring(0, con.length - 1)
          }
          //添加到数组中
          detailInfoArr.push(movCon);
        }
      }
      //最后将数据保存起来
      res.body.detailInfoArr = detailInfoArr;

      var imgs = [];
      var imgArr = detailStr.split(',');

      for (var i = 0; i < imgArr.length; i++) {
        var pic = imgArr[i];
        var imgObj = {
          img: pic
        }
        imgs.push(imgObj);
      }

      res.body.imgs = imgs;

      //将数据回调
      callback(res.body);
    });
  },
  //加载图片列表数据
  loadPicsData: function (actId, callback) {

    var that = this;
    var urlStr = app.basicURL + 'marketing/pictures/' + actId;
    hp.request('GET', urlStr, {}, function (res) {
      //将数据回调
      // console.log('加载图片列表数据',res);

      for (var i = 0; i < res.body.length; i++) {
        var obj = res.body[i];

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
        }
        // console.log('arr,arrRes', arr, arrRes);
        obj.imgs = arrRes;

        // 头像解析
        var portriat = obj.portriat;
        console.log('头像解析portriat', portriat);
        if (portriat == undefined) {
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

      }

      callback(res.body);
    });
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

        // 获取图片尺寸
        wx.getImageInfo({
          src: that.data.fs_discovery_DownLoad_HostURL + '/' + str,
          success: function (res) {
            var imgObj = {
              w: res.width,
              h: res.height,
              img: str
            };
            if (str != "") {
              imgs.push(imgObj);
            }



          }
        })

      }
      // console.log('imgs', imgs);
      res.body.imgs = imgs;



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
        // console.log('nicknames nicknamesLength', nicknames, nicknames.length);

        res.body.nicknames = nicknames;
      }
      callback(res.body);
    });
  },

  //页面分享按钮
  onShareAppMessage: function () {
    return {
      title: app.user.nickName + '邀钓鱼人一起拿大奖',
      path: '/pages/activity/activitySale/activitySale'
    }
  },
  //发布图片
  releasePicsClick: function () {

    var that = this;

    if (app.user) {
      console.log("发布图片");
      wx.navigateTo({
        url: '/pages/activity/activityRelease/activityRelease?actId=' + this.data.info.id
      })
    } else {//没登录的处理
      console.log("没登录，发毛啊");
      this.loginMethod(function (res) {
        // console.log(res);
        if (res == 1) {
          wx.navigateTo({
            url: '/pages/activity/activityRelease/activityRelease?actId=' + that.data.info.id
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
    this.loadReleasedData(this.data.actId, function (releasedData) {
      // console.log('加载已发布内容', releasedData);

      that.setData({
        releasedData: releasedData
      });

      // 状态(0 审核中，1 通过，2 审核不通过)
      if (releasedData.status == 0) {
        that.seePicsTapChecking();
      } else if (releasedData.status == 1) {
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
      url: '/pages/activity/activitySee/activitySee?actId=' + this.data.info.id
    })
  },
  //审核中 查看内容
  seePicsTapChecking: function () {
    // console.log("审核中 查看内容 转码前数据", this.data.releasedData);
    wx.navigateTo({
      url: '/pages/activity/activitySee/checking/checking?releasedDataJsonStr=' + JSON.stringify(this.data.releasedData)
    })
  },
  //审核失败 查看内容
  seePicsTapCheckFail: function () {
    console.log("审核失败 查看内容");
    wx.navigateTo({
      url: '/pages/activity/activitySee/checkFail/checkFail?releasedDataJsonStr=' + JSON.stringify(this.data.releasedData)
    })
  },
  // 登录方法
  loginMethod: function (callback) {
    var that = this;

    //判断之前是否绑定了手机号码了
    //回调函数中返回的参数:
    //0:代表请求失败或者用户拒绝授权
    //1:代表之前已经已经绑定了手机号码了,此时回调的时候,app的user对象已经有值了,同时也已经缓存到本地数据了
    //2:代表用户之前未绑定手机号码,需要跳转到绑定界面
    VF.checkUserBindPhoneNumber(function (result) {
      callback(result);
      //如果之前未绑定手机号码的,直接跳入到绑定界面了 或者提示错误信息了
    });
  },
  //点赞事件
  zanMethod: function (e) {

    wx.showToast({
      title: '点赞中...',
      icon: 'loading',
      duration: 1000
    })

    var that = this;
    var obj = e.currentTarget.dataset.obj;
    // console.log('obj', obj);
    var arr = this.data.picsList;
    // console.log('arr', arr);
    for (var i = 0; i < arr.length; i++) {
      var item = arr[i];
      if (item.uid == obj.uid) {

        var url = app.basicURL + 'marketing/likeUser';
        var para = {
          "likeUid": app.user.id,
          "marketUid": obj.uid,
          "marketingId": obj.marketingId
        };
        console.log('点赞事件para', para);
        hp.request('POST', url, para, function (res) {
          console.log('点赞事件', res);
          if (res.status == 0) {
            that.loadPicsData(that.data.actId, function (picsList) {
              // console.log('picsList', picsList);
              that.setData({
                picsList: picsList
              });
            })
          }
        })

      }
    }



  },
  //更多点击事件
  showMoreNicknames: function (e) {
    var obj = e.currentTarget.dataset.obj;
    // console.log('obj', obj);
    var arr = this.data.picsList;
    // console.log('arr', arr);
    for (var i = 0; i < arr.length; i++) {
      var item = arr[i];
      if (item.uid == obj.uid) {
        item.isMore = true;
      }
    }

    // 重新赋值
    this.setData({
      picsList: arr
    });
    console.log('更多点击事件');
  },
  //收起点击事件
  showLessNicknames: function (e) {
    var obj = e.currentTarget.dataset.obj;
    // console.log('obj', obj);
    var arr = this.data.picsList;
    // console.log('arr', arr);
    for (var i = 0; i < arr.length; i++) {
      var item = arr[i];
      if (item.uid == obj.uid) {
        item.isMore = false;
      }
    }

    // 重新赋值
    this.setData({
      picsList: arr
    });
    console.log('收起点击事件');
  },
  // 活动详情界面
  pushToDetail: function () {
    console.log('活动详情界面');
    wx.navigateTo({
      url: '/pages/activity/activitySale/activitySaleDetail/activitySaleDetail?JsonStr=' + JSON.stringify(this.data.info)
    })
  },
  // 点击cell事件 
  pushToZan: function (e) {
    // console.log('帮他点赞界面', e.currentTarget.dataset.obj);
    var json = e.currentTarget.dataset.obj;
    // 我的内容界面
    if (json.uid == app.user.id) {
      wx.navigateTo({
        url: '/pages/activity/activitySee/activitySee?actId=' + this.data.actId
      })
    } else {//帮他点赞界面
      wx.navigateTo({
        url: '/pages/activity/activitySale/activitySaleZan/activitySaleZan?JsonStr=' + JSON.stringify(json)
      })
    }


  }
})