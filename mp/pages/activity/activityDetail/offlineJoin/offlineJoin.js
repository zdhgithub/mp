// pages/activity/activityDetail/offlineJoin/offlineJoin.js
var hp = require('../../../../utils/HPUtils.js');
var app = getApp();
Page({
  data: {
    //活动的id
    actId: undefined,
    //是否显示界面 默认不显示
    isShow: false,
    //用户的code 
    code: '',
    //用户信息字符串
    userStr: '',
    //标识是否禁用获取验证码
    "disableCodeBtn": false,
    //标识是否禁用绑定按钮
    "disableVerifyBtn": true,
    //倒计时时间
    "time": 60
  },
  onLoad: function (options) {
    //记录下活动的id
    this.data.actId = options.actId;
    var that = this;
    //获取code和用户信息
    that.getLoginCode(function (userCode) {
      //获取用户信息
      that.getUserInformation(function (user) {
        //记录下来
        that.setData({
          code: userCode,
          userStr: user.userStr
        });
        //菊花等待...
        wx.showToast({
          title: '加载中...',
          icon: 'loading',
          duration: 10000,
          mask: true
        });
        //通过code和userStr还有actId请求接口看是否已经绑定了
        var urlStr = app.basicURL + 'users/login/wxActivity/check';
        var para = {
          code: userCode,
          userInfo: user.userStr,
          activityCid: that.data.actId
        };
        hp.request('POST', urlStr, para, function (res) {
          wx.hideToast();
          console.log(res);
          //如果是老用户的话,需要分会给我用户的信息,让我保存起来啊
          //判断给没给我返回body用户信息
          if (res.body) {
            //老用户 
            //将微信的用户数据也添加上去
            app.user = res.body;
            app.user.avatarUrl = user.userInfo.avatarUrl;
            app.user.nickName = user.userInfo.nickName;
            app.user.language = user.userInfo.language;
            app.user.country = user.userInfo.country;
            app.user.province = user.userInfo.province;
            app.user.city = user.userInfo.city;
            app.user.language = user.userInfo.language;
            app.user.gender = user.userInfo.gender;
            //缓存用户数据
            //缓存用户数据
            try {
              wx.setStorageSync('user', app.user);
            } catch (e) {
              //如果保存失败了,就提示一下用户
              wx.showToast({
                title: "保存用户信息失败,请重试",
                icon: "loading"
              });
            }
            //进入到活动界面
            wx.redirectTo({
              url: '/pages/activity/activityDetail/activityDetail?actId=' + that.data.actId,
            })
          } else {
            //新用户
            //是新用户,那么则需要显示登录界面啊
            that.setData({
              isShow: true
            });
          }
        });

      });
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },

  // ------------------------自定义方法-------------------//
  //加载用户在该活动的状态
  loadUserStateData: function (actId, userId, callback) {
    var urlStr = app.basicURL + 'campaign/actor/' + actId + '/' + userId;
    hp.request('GET', urlStr, {}, function (res) {
      //将数据回调
      callback(res.body);
    });
  },

  //点击获取验证码的时候调用
  getCodeClicked: function (e) {
    // console.log(e);
    var phone = e.detail.value.phone;
    //验证是否是电话号码
    if (!(/^1[34578]\d{9}$/.test(phone))) {
      wx.showToast({
        title: '号码错误!',
        icon: 'loading',
        duration: 1000
      });
      return;
    }
    //禁用按钮
    this.setData({
      "disableCodeBtn": true
    });
    var that = this;
    //倒计时
    this.setData({
      time: 59
    });
    var myTimer = setInterval(function () {
      var newTime = that.data.time - 1;
      if (that.data.time > 0) {
        that.setData({
          time: newTime
        });
      } else {
        //让时钟停止
        clearInterval(myTimer);
        //让时间再搞到60s 同时启用获取验证码按钮
        that.setData({
          time: 60,
          disableCodeBtn: false
        });
      }
    }, 1000);

    //获取code和用户信息
    that.getLoginCode(function (userCode) {
      //获取用户信息
      that.getUserInformation(function (user) {
        //记录下来
        that.setData({
          code: userCode,
          userStr: user.userStr
        });


        var para = {
          "mobile": phone,
          "code": that.data.code,
          "userInfo": decodeURIComponent(that.data.userStr)
        }
        console.log(para);
        var url = app.basicURL + 'portal/sms/wxActivity';
        hp.request('POST', url, para, function (res) {
          //什么都不做了
          console.log(res);
        });

      });
    })

  },
  //监听验证码输入状态
  codeTFDidChange: function (e) {
    //判断是否已经输入了四位验证码了了
    // console.log(e);
    if (e.detail.value.length == 4) {
      //启用绑定按钮
      this.setData({
        "disableVerifyBtn": false
      });
    } else {
      //禁用绑定按钮
      this.setData({
        "disableVerifyBtn": true
      });
    }
  },
  //'确定'按钮被点击的时候调用
  verifyClicked: function (e) {
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      mask: true,
      duration: 10000
    });
    var that = this;
    var phone = e.detail.value.phone;
    var code = e.detail.value.code;
    //获取code和用户信息
    that.getLoginCode(function (userCode) {
      //获取用户信息
      that.getUserInformation(function (user) {
        var para = {
          "phone": phone,
          "verifyNum": code,
          "code": userCode,
          "userInfo": user.userStr,
          "activityCid": that.data.actId
        };
        var url = app.basicURL + 'users/login/wxActivity';
        //发起请求
        wx.request({
          url: url,
          data: para,
          method: 'POST',
          success: function (res) {
            wx.hideToast();
            // success
            if (res.statusCode != 200) {
              wx.showToast({
                title: '哎呀,出错了(' + res.statusCode + ')',
                icon: 'loading'
              })
              return;
            }
            if (res.data.status != 0) {
              wx.showToast({
                title: res.data.errMsg,
                icon: 'loading'
              })
              return;
            }
            app.user = res.data.body;
            //将微信的用户数据也添加上去
            app.user.avatarUrl = user.userInfo.avatarUrl;
            app.user.nickName = user.userInfo.nickName;
            app.user.language = user.userInfo.language;
            app.user.country = user.userInfo.country;
            app.user.province = user.userInfo.province;
            app.user.city = user.userInfo.city;
            app.user.language = user.userInfo.language;
            app.user.gender = user.userInfo.gender;
            //缓存用户数据
            try {
              wx.setStorageSync('user', app.user);

            } catch (e) {
              //如果保存失败了,就提示一下用户
              wx.showToast({
                title: "保存用户信息失败,请重试",
                icon: "loading"
              });
            }
            //进入到活动界面
            wx.redirectTo({
              url: '/pages/activity/activityDetail/activityDetail?actId=' + that.data.actId,
            })
          },
          fail: function () {
            // fail
            wx.hideToast();
          }
        })
      });
    });
  },
  //获取用户code
  getLoginCode: function (callback) {
    wx.login({
      success: function (res) {
        // success
        console.log(res.code);
        if (res.code) {
          callback(res.code);
        } else {
          wx.showToast({
            title: '获取用户登录态失败',
            icon: 'loading'
          })
        }
      }
    })
  },
  //获取用户信息
  getUserInformation: function (callback) {
    wx.getUserInfo({
      success: function (res) {
        // success
        console.log(res);
        var userInfo = {
          'iv': res.iv,
          'userInfo': res.userInfo,
          'rawData': res.rawData,
          'signature': res.signature,
          'encryptedData': res.encryptedData
        }
        //转成字符串
        var userStr = JSON.stringify(userInfo);
        //执行回调
        callback({
          userInfo: res.userInfo,
          userStr: userStr
        });
      },
      fail: function () {
        // fail
        //来到这里,说明用户拒绝授权,这时提示一下
        wx.showToast({
          title: '您已拒绝授权,请十分钟之后再尝试',
          icon: 'loading'
        })
      }
    })
  }

})