

var VF = require('../verify/verifyNum/verify.js');
var hp = require('../../utils/HPUtils.js');
var app = getApp();
Page({
    data: {
        items: [
            {
                name: "账户信息",
                icon: "/images/my/my_account_info.png",
                action: "loginAndShowUserInfo"
            },
            {
                name: "关于黑漂",
                icon: "/images/my/my_heipiao.png",
                action: "pushHeipiao"
            }
            ],
        //标示是否登录过
        hasLogin: false,
        //用户对象
        user: null,
        //用户头像OSS地址
        user_portrait_DownLoad_HostURL: app.OSS.user_portrait_DownLoad_HostURL
    },
    onLoad: function (options) {
        console.log('onLoad');
        //通过app的user对象判断是否已经登录了
        if (app.user) {
            this.setData({
                user: app.user,
                hasLogin: true
            });
        }
    },
    onShow: function () {
        console.log('onShow');
        var user = wx.getStorageSync('user');
        // user.avatarUrl
        var portrait = user.portrait;
        var nickname = user.nickname;


        console.log('portrait',portrait);
        console.log('nickname',nickname);

        this.setData({
            user: app.user
        });
    },
    loginAndShowUserInfo: function () {
        console.log('portraitTap');
        var that = this;
        //判断一下用户是否已经登录了
        //app.user
        if (app.user) {
            //跳转到个人信息界面
            wx.navigateTo({
                url: '/pages/my/myAccount/myAccount'
            })
        }
        else {
            //判断之前是否绑定了手机号码了
            //回调函数中返回的参数:
            //0:代表请求失败或者用户拒绝授权
            //1:代表之前已经已经绑定了手机号码了,此时回调的时候,app的user对象已经有值了,同时也已经缓存到本地数据了
            //2:代表用户之前未绑定手机号码,需要跳转到绑定界面
            VF.checkUserBindPhoneNumber(function (result) {
                if (result == 1) {
                    //之前绑定了手机号码了,此时用户数据已经缓存到本地,并且app对象的user也有值了
                    //进行下面的业务
                    //刷新界面
                    that.setData({
                        user: app.user,
                        hasLogin: true
                    });
                    console.log("result == 1");
                    //跳转到个人信息界面
                    wx.navigateTo({
                        url: '/pages/mine/myAccount/myAccount'
                    })
                }
                //如果之前未绑定手机号码的,直接跳入到绑定界面了 或者提示错误信息了
            });
        }
    },
    // 关于黑漂
    pushHeipiao: function () {
      console.log('关于黑漂');
      //跳转到关于黑漂
      wx.navigateTo({
        url: '/pages/my/myHeipiao/myHeipiao'
      })
    }
    
})