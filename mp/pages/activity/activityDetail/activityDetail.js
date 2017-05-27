// pages/activity/activityDetail/activityDetail.js
var VF = require('../../verify/verifyNum/verify.js');
var hp = require('../../../utils/HPUtils.js');
var app = getApp();
Page({
  data: {
    //活动id
    actId: undefined,
    //显示哪个页面 默认是详情
    // 0:代表详情,1:代表回顾
    opType: 0,
    //活动详细信息
    info: undefined,
    //活动背景图片的OSS基本地址
    fs_discovery_DownLoad_HostURL: app.OSS.fs_discovery_DownLoad_HostURL,
    //用户头像OSS基本地址
    user_portrait_DownLoad_HostURL: app.OSS.user_portrait_DownLoad_HostURL,
    //用户是否登录了
    isLogin: false,
    //用户参与活动的状态标识:
    userState: undefined,
    // 音频上下文
    audioCtx: undefined,
    // 是否正在播放音乐 
    isplayingAudio: false,

    //活动回顾文章列表
    reviewArts: undefined
  },
  onLoad: function (options) {
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
      //再判断用户在该场活动的状态
      //判断用户是否已经登录过了
      if (app.user) {
        //加载用户在该活动的状态
        that.loadUserStateData(that.data.actId, app.user.id, function (data) {
          that.setData({
            userState: data
          });
        });
      }
    })
    //加载报名人数数据
    this.loadJoinedData(options.actId, function (joinedList) {
      console.log('加载报名人数数据', joinedList)
      that.setData({
        joinedList: joinedList
      });
    })
  },
  onReady: function (e) {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.data.audioCtx = wx.createAudioContext('myAudio');
    // //播放音乐
    // this.audioPlayAndPause();
    //如果网速慢的情况就不会自动播放了,可能因为上下文还没创建好所以还需要搞个定时任务检查一下,确保能够播放
    var that = this;
    setTimeout(function () {
      that.data.audioCtx = wx.createAudioContext('myAudio');
      that.setData({
        isplayingAudio: false
      });
      that.audioPlayAndPause();
    }, 3000);


  },
  onShow: function () {
    // 页面显示

  },
  // ------------------------------活动页面的内容------------------------------//
  //加载活动详情
  loadActivityData: function (id, callback) {
    var urlStr = app.basicURL + 'campaign/' + id;
    hp.request('GET', urlStr, {}, function (res) {
      
      //设置时间格式
      var act = res.body;
      //开始时间
      var beginDate = new Date(act.beginTime);
      act.beginTimeStr = beginDate.format('yyyy-MM-dd hh:mm');
      //结束时间
      var endDate = new Date(act.endTime);
      act.endTimeStr = endDate.format('yyyy-MM-dd hh:mm');
      //报名截止时间
      var entryTerminalDate = new Date(act.entryTerminalTime);
      act.entryTerminalTimeStr = entryTerminalDate.format('yyyy-MM-dd hh:mm');

      //解析活动详情
      var detailStr = res.body.detail;
      console.log('detailStr', detailStr);
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
      console.log('分隔的数组', conArr);
      
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
      //将数据回调
      callback(res.body);
      console.log('活动详情信息',res.body)
    });
  },
  //加载报名人数数据
  loadJoinedData: function (actId, callback) {
    var urlStr = app.basicURL + 'campaign/actor/list/' + actId + '/0';
    hp.request('GET', urlStr, {}, function (res) {
      //将数据回调
      callback(res.body);
    });
  },
  //加载用户在该活动的状态
  loadUserStateData: function (actId, userId, callback) {
    var urlStr = app.basicURL + 'campaign/actor/' + actId + '/' + userId;
    hp.request('GET', urlStr, {}, function (res) {
      //将数据回调
      callback(res.body);
    });
  },
  // 加载活动详情的图片信息尺寸
  changeDetailImageSize: function (e) {
    // console.log('加载活动详情的图片信息尺寸',e);
    //图片的位置
    var imgidx = e.currentTarget.dataset.imgidx;
    //取出图片
    var imgInfo = this.data.info.detailInfoArr[imgidx];
    //图片的真实宽高属性
    var width = e.detail.width;
    var height = e.detail.height;
    //为该张图片添加宽高属性
    imgInfo.width = 710;
    imgInfo.height = 710 * height / width;
    //更新渲染层数据
    this.setData({
      info: this.data.info
    });
    // console.log('更新渲染层数据', this.data.info);
  },
  //获取支付参数
  getPayingParameter: function (actId, userId, openId, callback) {
    var urlStr = app.basicURL + 'campaign/actor/miniPay';
    var para = {
      uid: userId,
      cid: actId,
      openid: openId
    }
    // console.log(para);

    hp.request('POST', urlStr, para, function (res) {
      //进行字符串解析
      var body = JSON.parse(res.body);
      //将数据回调
      callback(body);
    });
  },
  //去支付该场活动的费用
  gotoPaying: function () {
    //菊花等待...
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 10000,
      mask: true
    });
    var that = this;
    //获取订单参数
    this.getPayingParameter(this.data.actId, app.user.id, app.user.openId, function (payPara) {
      //隐藏菊花
      wx.hideToast();
      //调起微信支付接口!
      wx.requestPayment({
        'timeStamp': payPara.timeStamp,
        'nonceStr': payPara.nonceStr,
        'package': payPara.package,
        'signType': payPara.signType,
        'paySign': payPara.paySign,
        success: function (res) {
          //支付成功了
          console.log(res);
          that.payingSuccessVerify(that.data.actId, app.user.id, function () {
            wx.showToast({
              title: '支付成功',
              icon: 'success'
            });
            //加载用户报名状态
            that.loadUserStateData(that.data.actId, app.user.id, function (data) {
              that.setData({
                userState: data
              });
            });
            //加载报名人数数据
            that.loadJoinedData(that.data.actId, function (joinedList) {
              that.setData({
                joinedList: joinedList
              });
            });
          });
        },
        fail: function (res) {
          // console.log('支付失败的回调');
          console.log(res);
          that.payingSuccessVerify(that.data.actId, app.user.id, function () {
            //直接显示支付失败就好了
            wx.showToast({
              title: '支付失败',
              icon: 'loading'
            });
          });
        }
      })
    });
  },
  //支付成功时请求验证
  payingSuccessVerify: function (actId, userId, callback) {

    var urlStr = app.basicURL + 'campaign/actor/miniConfirm'
    var para = {
      uid: userId,
      cid: actId
    }
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 10000,
      mask: true
    });
    //发送请求
    hp.request('POST', urlStr, para, function (res) {
      wx.hideToast();
      //进行下面的逻辑
      callback();
    });
  },
  //-----------------------------------回顾页面的方法-----------------------------------//
  loadReviewArticles: function (callback) {
    //通过数据来看 
    var urlStr = app.basicURL + 'campaign/article/list/' + this.data.actId;
    hp.request('GET', urlStr, {}, function (res) {
      //回调出去
      callback(res);
    });
  },
  //当点击回顾文章使,调用
  showReviewArticlesDetail: function (e) {

    var url = '/pages/activity/activityDetail/reviewArticles/reviewArticles?artId=' + e.currentTarget.dataset.art.id;
    wx.navigateTo({
      url: url
    });
  },

  // ------------------------------------按钮方法--------------------------------------//
  //切换页面,也就是显示详情页面或是回顾界面
  switchPage: function (e) {
    var selType = e.currentTarget.dataset.type;
    if (this.data.opType == selType) {
      return;
    }
    //将这个值保存
    this.setData({
      opType: selType
    });
    //判断要不要暂停音乐
    if (this.data.opType != 0 && this.data.info.video != undefined) {
      //暂停音乐
      this.data.audioCtx.pause();
      this.setData({
        isplayingAudio: false
      });
    }

    //判断一下要不要加载回顾列表数据
    if (selType == 0 || (selType == 1 && this.data.reviewArts != undefined)) {
      return;
    }
    //加载回顾文章列表
    var that = this;
    this.loadReviewArticles(function (res) {
      //保存文章列表
      that.setData({
        reviewArts: res.body
      });
    });
  },
  // 暂停和播放背景音乐
  audioPlayAndPause: function () {
    //判断是播放还是暂停
    if (this.data.isplayingAudio == true) {
      // console.log('暂停');
      this.data.audioCtx.pause();
      this.setData({
        isplayingAudio: false
      });
    } else {
      // console.log('开始');
      this.data.audioCtx.play();
      this.setData({
        isplayingAudio: true
      });
    }
  },
  //显示参加的钓友列表
  showJoinedPersons: function () {
    //获取数据
    var joinedList = this.data.joinedList;
    joinedList = JSON.stringify(joinedList);
    joinedList = encodeURIComponent(joinedList);
    var urlStr = '/pages/activity/activityDetail/joinedPersons/joinedPersons?list=' + joinedList;
    wx.navigateTo({
      url: urlStr
    })
  },
  //点击'报名'按钮的方法
  joinBtnClocked: function () {
    var that = this;
    //判断这个按钮能不能点
    if (this.data.info.status != 1) {
      //不能点了 直接return掉
      return;
    }
    if (this.data.isLogin == true && this.data.userState.isJoin == true) {
      return;
    }

    //走到下面的就是能点的
    //再判断用户是否登录了
    if (this.data.isLogin == true) {
      //去支付
      this.gotoPaying();
    } else {
      //去登录
      //判断之前是否绑定了手机号码了
      //回调函数中返回的参数:
      //0:代表请求失败或者用户拒绝授权 在VF中已经做了响应的处理了
      //1:代表之前已经已经绑定了手机号码了,此时回调的时候,app的user对象已经有值了,同时也已经缓存到本地数据了
      //2:代表用户之前未绑定手机号码,需要跳转到绑定界面
      VF.checkUserBindPhoneNumber(function (result) {
        if (result == 1) {
          //之前绑定了手机号码了,此时用户数据已经缓存到本地,并且app对象的user也有值了
          //进行下面的业务: 用户在该场活动的状态

          //加载用户在该活动的状态
          that.loadUserStateData(that.data.actId, app.user.id, function (data) {
            that.setData({
              isLogin: true,
              userState: data
            });
            //判断用户是否已经参加了这场活动了
            if (data.isJoin == false) {
              //去支付
              that.gotoPaying();
            } else {
              //就什么都不做了
            }
          });
        }
        //如果之前未绑定手机号码的,直接跳入到绑定界面了  或者提示错误信息了
      });
    }

  },
  //页面分享按钮
  onShareAppMessage: function () {
    return {
      title: app.user.nickName +'邀您一起钓鱼去！',
      path: '/pages/activity/activityDetail/activityDetail?actId=' + this.data.info.id
    }
  },
})