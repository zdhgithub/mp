
var VF = require('../../verify/verifyNum/verify.js');
var hp = require('../../../utils/HPUtils.js');
var app = getApp();
Page({
  data: {
    //是否显示内容
    isShowContent: false,
    //显示的是支付界面,否则显示提示获取授权界面
    isShowPayInterface: false,
    //手机信息
    sysInfo: {
      width: app.sysInfo.windowWidth,
      height: app.sysInfo.windowHeight
    },
    // //输入的总金额
    // tMoney: null,
    // //总价钱字符串
    // // tMoneyStr:null,
    // //选中的票数组
    // ticketArr: null,
    // //优惠券数量
    // discountAmount: null,
    // //优惠券数组
    // discountList: null,
    // //漂币数量
    // piaoCoins: null,
    // //选中的优惠券对象
    // selDiscount: null
  },
  onLoad: function (options) {
    // 页面初始化
    var shopId = options.shopId;
    //保存渔具店id
    this.setData({
      shopId: shopId
    });
    //加载数据
    this.lalala();
  },
  onShow: function () {
    var selDiscount = app.selDiscount;
    if (selDiscount) {
      //选中了一张票了
      //将数据保存起来
      this.setData({
        selDiscount: selDiscount
      });
      //删除掉app保存的这个值
      delete app.selDiscount;
    }

    //判断app对象中是否有这个值isShopPayingSuccess 用来标识支付成功时,返回的时候,清除之前的数据
    if (app.isShopPayingSuccess) {
      this.setData({
        inputValue: '',
        // 总金额
        tMoney: '',
        //选中的优惠券
        selDiscount: null,
        //优惠券数量
        discountAmount: null,
        //优惠券数组
        discountList: null,
      });
      delete app.isShopPayingSuccess;
    }
    //判断app对象是否有HPShopPaying这个值,有的话 就再走上面的代码
    if (app.HPShopPaying) {
      delete app.HPShopPaying;
      //加载数据
      this.lalala();

    }
  },
  //我也不知道取什么名字了,QAQ
  lalala: function () {
    //加载菊花
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 10000,
      mask: true
    })
    //判断之前时候缓存过用户数据
    if (app.user) {
      //加载各种数据
      this.loadAllData(this.data.shopId);
    } else {
      //之前没有缓存过的,那么我们就需要验证用户时候绑定了手机号码
      var that = this;
      //判断之前是否绑定了手机号码了
      //回调函数中返回的参数:
      //0:代表请求失败或者用户拒绝授权
      //1:代表之前已经已经绑定了手机号码了,此时回调的时候,app的user对象已经有值了,同时也已经缓存到本地数据了
      //2:代表用户之前未绑定手机号码,需要跳转到绑定界面
      VF.checkUserBindPhoneNumber(function (result) {
        if (result == 1) {
          //之前绑定了手机号码了,此时用户数据已经缓存到本地,并且app对象的user也有值了
          //进行下面的业务: 跳转到支付界面
          that.loadAllData(that.data.shopId);
        } else if (result == 0) {
          //设置标识
          that.setData({
            //是否显示内容
            isShowContent: true,
            //显示的是支付界面,否则显示提示获取授权界面
            isShowPayInterface: false,
          });
        } else if (result == 2) {
          //如果之前未绑定手机号码的,直接跳入到绑定界面了
          wx.hideToast();
        }
      });
    }
  },
  //加载各种数据
  loadAllData: function (shopId) {
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 10000
    });
    var that = this;
    //将渔具店数据
    this.loadShopData(shopId, function (shop) {
      //保存到data中,
      that.setData(shop);
      //加载优惠券
      //加载用户的优惠券列表
      that.loadDiscount(app.user.id, shopId, function (list) {
        //保存优惠券列表
        that.setData({
          //是否显示内容
          isShowContent: true,
          //显示的是支付界面,否则显示提示获取授权界面
          isShowPayInterface: true,
          //原始数据
          discountList_raw: list,
          discountAmount_raw: list.length
        });
        //隐藏提示框
        wx.hideToast();
      });
    });
    //加载漂币数据
    this.loadPiaoCoins(app.user.id, function (goldCoin) {
      //将漂币数量保存保存起来
      that.setData({
        piaoCoins: goldCoin
      });
    });
  },
  //加载渔具店信息
  loadShopData: function (shopId, callback) {
    var urlStr = app.basicURL + 'fshop/query/shop/' + shopId + '/-';

    hp.request('GET', urlStr, {}, function (res) {

      callback(res.body);
    });
  },
  //加载优惠券数据
  loadDiscount: function (userId, shopId, callback) {
    var that = this;
    var urlStr = app.basicURL + 'coupon/user/list/unused/' + userId + '/' + shopId;

    hp.request('GET', urlStr, {}, function (res) {
      //将结果回调
      callback(res.body);
    });
  },
  //加载用户漂币
  loadPiaoCoins: function (userId, callback) {
    var that = this;
    var urlStr = app.basicURL + 'account/goldCoin/' + userId;
    //发送请求
    hp.request('GET', urlStr, {}, function (res) {
      //将结果回调
      callback(res.body.goldCoin);
    });
  },
  //输入框的输入监听事件
  inputValueChanged: function (e) {
    // console.log(e);
    var money = e.detail.value;
    //记录当前的钱
    this.setData({
      tMoney: money
    });
    //同时循环遍历原优惠券数组中符合条件的优惠券
    var count = 0;
    var disList = [];
    for (var i = 0; i < this.data.discountList_raw.length; i++) {
      var disc = this.data.discountList_raw[i];
      if (disc.useRule <= this.data.tMoney && this.data.tMoney != 0) {
        disList.push(disc);
      }
    }
    this.setData({
      //优惠券数量
      discountList: disList,
      //优惠券数组
      discountAmount: disList.length,
      //选中的优惠券
      selDiscount: null
    });

  },
  //当点击优惠券区域的时候调用
  chooseDiscount: function () {
    //如果优惠券的数量为0 则不用进入优惠券列表界面了
    if (this.data.discountAmount == 0) {
      return;
    }
    //将优惠券列表转成字符串
    var discountListStr = JSON.stringify(this.data.discountList);
    //uri编码
    discountListStr = encodeURIComponent(discountListStr);
    //跳到优惠券列表界面
    var urlStr = '/pages/paying/shopDiscount/shopDiscount?discount=' + discountListStr;
    wx.navigateTo({
      url: urlStr
    })
  },
  //当'确认按钮'被点击的时候调用
  comfirmBtnClicked: function () {
    //菊花等待...
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 10000,
      mask: true
    });
    var that = this;
    //1.获取订单号
    this.getOrderId(function (isWXpay, orderId) {
      //判断是否是平台支付:也就是优惠券金额大于订单总金额了
      if (!isWXpay) {
        //平台支付
        //隐藏菊花
        wx.hideToast();
        //直接跳转到支付成功界面
        //拉取用户奖励漂币
        that.checkUserReward(orderId, function (rewardCoins) {
          var urlStr = '/pages/paying/shopPayingSuccess/shopPayingSuccess?award=' + rewardCoins;
          wx.navigateTo({
            url: urlStr
          })
        });
      } else {
        //2.获取支付参数
        that.getPayParameter(orderId, function (payParaStr) {

          var payPara = JSON.parse(payParaStr);
          console.log(payPara);
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
              //拉取用户奖励漂币
              that.checkUserReward(orderId, function (rewardCoins) {
                var urlStr = '/pages/paying/shopPayingSuccess/shopPayingSuccess?award=' + rewardCoins;
                wx.navigateTo({
                  url: urlStr
                })
              });
            },
            fail: function (res) {
              console.log('支付失败的回调');
              console.log(res);
              //直接显示支付失败就好了
              wx.showToast({
                title: '支付失败',
                icon: 'loading'
              });
            }
          })
        });
      }
    });
  },
  //当点击'重新获取'用户授权的时候
  reGetUserInfo: function () {
    //验证用户是否绑定了手机号码
    var that = this;
    //判断之前是否绑定了手机号码了
    //回调函数中返回的参数:
    //0:代表请求失败或者用户拒绝授权
    //1:代表之前已经已经绑定了手机号码了,此时回调的时候,app的user对象已经有值了,同时也已经缓存到本地数据了
    //2:代表用户之前未绑定手机号码,需要跳转到绑定界面
    VF.checkUserBindPhoneNumber(function (result) {
      if (result == 1) {
        //之前绑定了手机号码了,此时用户数据已经缓存到本地,并且app对象的user也有值了
        //进行下面的业务: 跳转到支付界面
        that.loadAllData(that.data.shopId);
      } else if (result == 0) {
        //设置标识
        that.setData({
          //是否显示内容
          isShowContent: true,
          //显示的是支付界面,否则显示提示获取授权界面
          isShowPayInterface: false,
        });
      } else if (result == 2) {
        //如果之前未绑定手机号码的,直接跳入到绑定界面了
        wx.hideToast();
      }
    });
  },
  //获取订单号
  getOrderId: function (callback) {
    //参数
    var para = {};
    //1.用户id
    para.uid = app.user.id;
    //2.渔具店id
    para.shopId = this.data.id;
    //3.总金额
    para.ordersMoney = this.data.tMoney.toString();
    //4.实付金额
    para.payMoney = ((this.data.tMoney - (this.data.selDiscount ? this.data.selDiscount.couponFee : 0)) > 0 ? (this.data.tMoney - (this.data.selDiscount ? this.data.selDiscount.couponFee : 0)) : 0).toString();
    //5.使用的存鱼总金额
    para.depositMoney = '0';
    //6.使用漂币数量
    para.goldCoinMoney = 0;
    //7.如果选中了优惠券 则需要加上这两个字段
    if (this.data.selDiscount) {
      // console.log('选中的优惠券数据:');
      // console.log(this.data.selDiscount);
      //7.1 优惠券id
      para.couponId = this.data.selDiscount.cid.toString();
      //7.2优惠券面额
      para.couponsMoney = this.data.selDiscount.couponFee.toString();
    }
    //9.经纬度信息 如果没有,那就算啦!
    if (app.location) {
      //9.1
      para.lng = app.location.lng;
      //9.2
      para.lat = app.location.lat;
    }
    //10.平台：0:商戶平台,1:微信,2:支付宝
    //判断总订单金额是否是大于优惠券金额,如果小于,则走平台支付,否则即是微信支付
    //也即是实际支付金额是否大于0
    //创建一个标识,用于区分是平台支付还是微信支付
    var isWXpay = true;
    if (para.payMoney > 0) {
      //走微信支付
      para.tradePlatform = 1;
      //11.订单来自哪个app 1：自己平台 2:小程序平台
      para.whereIsApp = 2;
      isWXpay = true;
    } else {
      para.tradePlatform = 0;
      //11.订单来自哪个app 1：自己平台 2:小程序平台
      para.whereIsApp = 1;

      isWXpay = false;
    }
    //至此,参数全TM拼好了
    console.log(para);
    //地址
    var urlStr = app.basicURL + 'orders/shop/create';

    hp.request('POST', urlStr, para, function (res) {
      //获取了订单号了
      //回调
      callback(isWXpay, res.body);
    });
  },
  //获取支付参数
  getPayParameter: function (orderId, callback) {
    //创建参数
    var para = {};
    //1.用户id
    para.uid = app.user.id;
    //2.平台:1:微信，2:支付宝
    para.platform = 1;
    //3.订单号
    para.orderId = orderId;
    //4.IP地址 小程序里面无法获得,所以直接写死一个啦 随便写的
    para.appIp = '222.2.22.222';
    //商品名称
    para.body = '支付';
    //黑漂业务 1:购买商品(购票),2:充值，3：票支付
    para.hpService = 3;
    //openid
    para.openid = app.user.openId;
    console.log('参数参数');
    console.log(para);
    //url
    var urlStr = app.basicURL + 'pay/payParam';
    hp.request('POST', urlStr, para, function (res) {
      //接下来将支付参数回调出去
      callback(res.body);
    });
  },
  //获取用户奖励的漂币
  checkUserReward: function (orderId, callback) {
    //地址
    var urlStr = app.basicURL + 'reward/wxMini/payOnce';
    //参数
    var para = {
      orderId: orderId,
      uid: app.user.id,
      category: 1
    };
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 10000,
      mask: true
    })

    hp.request('POST', urlStr, para, function (res) {
      wx.hideToast();
      //将结果回调
      callback(res.body.reward);
    });
  }
})