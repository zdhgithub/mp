var VF = require('../../verify/verifyNum/verify.js');
var hp = require('../../../utils/HPUtils.js');
var app = getApp();
Page({
  data: {
    items: [
      [{
        name: "黑漂账户",
        icon: "/images/mine/mine_item_account.png",
        action: "accountClicked"
      },
      {
        name: "我的钓场券",
        icon: "/images/mine/mine_item_siteTicket.png",
        action: "siteTicketClicked"
      },
      {
        name: "我的订单",
        icon: "/images/mine/mine_item_oders.png",
        action: "ordersClicked"
      },
      {
        name: "我的漂币",
        icon: "/images/mine/mine_item_coin.png",
        action: "coinsClicked"
      }
      ]
    ],
    //标示是否登录过
    hasLogin: false,
    //用户对象
    user: null,
    //用户的漂币
    // piaoCoins:null,
    //用户头像OSS地址
    user_portrait_DownLoad_HostURL: app.OSS.user_portrait_DownLoad_HostURL

  },
  onLoad: function (options) {
    //通过app的user对象判断是否已经登录了
    if (app.user) {
      this.setData({
        user: app.user,
        hasLogin: true
      });
    }
  },
  //测试的
  // cishi: function () {

  //   wx.chooseImage({
  //     count: 1, // 默认9
  //     sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
  //     sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
  //     success: function (res) {
  //       // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
  //       var tempFilePaths = res.tempFilePaths;
  //       console.log(tempFilePaths);

  //       var imgPath = tempFilePaths[0];

  //       //上传到OSS
  //       hp.uploadFile2OSS(imgPath,'444.png','hello','zt-app-discovery',function(keyPath){
  //         console.log('上传成功啦!!');
  //         console.log(keyPath);

  //       });
  //     }
  //   })
  // },
  onShow: function () {
    // 页面显示
    if (this.data.hasLogin) {
      //如果用户已经登录了,就加载用户的漂币数据
      this.loadPiaoCoins(this.data.user.id);
    } else {
      //通过app的user对象判断是否已经登录了
      if (app.user) {
        this.setData({
          user: app.user,
          hasLogin: true
        });
      }
    }
  },
  //加载用户漂币
  loadPiaoCoins: function (userId) {
    var that = this;
    var urlStr = app.basicURL + 'account/goldCoin/' + userId;
    console.log(urlStr);
    //发送请求
    hp.request('GET', urlStr, {}, function (res) {
      //将漂币数量保存起来
      that.setData({
        piaoCoins: res.body.goldCoin
      });
    });
  },
  //---------------点击方法---------------//
  accountClicked: function (e) {
    var that = this;
    //判断一下用户是否已经登录了
    //app.user
    if (app.user) {
      //跳转到个人信息界面
      wx.navigateTo({
        url: '/pages/mine/myAccount/myAccount'
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
          //跳转到个人信息界面
          wx.navigateTo({
            url: '/pages/mine/myAccount/myAccount'
          })
        }
        //如果之前未绑定手机号码的,直接跳入到绑定界面了 或者提示错误信息了
      });
    }
  },
  siteTicketClicked: function () {
    //判断一下用户是否已经登录了
    var that = this;
    if (app.user) {
      //跳转到我的钓场票界面
      wx.navigateTo({
        url: '/pages/mine/mySiteTicket/mySiteTicket'
      })
    }
    else {
      //判断之前是否绑定了手机号码了
      VF.checkUserBindPhoneNumber(function (hasBindBefore) {
        if (hasBindBefore) {
          //之前绑定了手机号码了,此时用户数据已经缓存到本地,并且app对象的user也有值了
          //进行下面的业务
          //刷新界面
          that.setData({
            user: app.user,
            hasLogin: true
          });
          //跳转到我的钓场票界面
          wx.navigateTo({
            url: '/pages/mine/mySiteTicket/mySiteTicket'
          })
        }
        //如果之前未绑定手机号码的,直接跳入到绑定界面了
      });
    }
  },
  ordersClicked: function () {
    wx.navigateTo({
      url: '/pages/mine/guide/guide'
    })
  },
  coinsClicked: function () {
    wx.navigateTo({
      url: '/pages/mine/guide/guide'
    })
  }
})