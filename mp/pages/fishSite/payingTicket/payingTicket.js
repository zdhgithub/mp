// pages/fishSite/payingTicket/payingTicket.js
var hp = require('../../../utils/HPUtils.js');
var app = getApp();
Page({
  data: {
    //手机信息
    sysInfo: {
      width: app.sysInfo.windowWidth,
      height: app.sysInfo.windowHeight
    },
    // 注意:我下面这些属性都是用到的,在程序运行的时候,都会有值的。之所以注释，是因为在程序一开始 加载数据，还未返回数据时，如果不注释，在界面上就会显示null 很难看。
    // //用户id,
    // userId: null,
    // //钓场id
    // fishSiteId: null,
    // //总价钱
    // tMoney: 0,
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
    var tangStr = decodeURIComponent(options.tArrStr);
    var tArr = JSON.parse(tangStr);
    console.log(options);
    //将数据保存下来
    this.setData({
      tMoney: options.tMoney,
      ticketArr: tArr,
      userId: app.user.id,
      fishSiteId: options.fishSiteId
    });
    //加载用户的优惠券列表
    this.loadDiscount(app.user.id, options.fishSiteId, options.tMoney);
    //加载漂币数据
    this.loadPiaoCoins(app.user.id);


    console.log(app.user);
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
  },
  //加载优惠券数据
  loadDiscount: function (userId, fishSiteId, tMoney) {
    var that = this;
    var urlStr = app.basicURL + 'coupon/user/usablelist/' + userId + '/' + tMoney + '/' + fishSiteId;
    //发送请求
    hp.request('GET', urlStr, {}, function (res) {
      //将优惠券信息保存起来
      that.setData({
        discountAmount: res.total,
        discountList: res.data
      });
    });
  },
  //加载用户漂币
  loadPiaoCoins: function (userId) {
    var that = this;
    var urlStr = app.basicURL + 'account/goldCoin/' + userId;
    //发送请求
    hp.request('GET', urlStr, {}, function (res) {
      //将漂币数量保存保存起来
      that.setData({
        piaoCoins: res.body.goldCoin
      });
    });
  },
  //当点击优惠券区域的时候调用
  chooseDiscount: function () {
    //如果优惠券的适量为0 则不用进入优惠券列表界面了
    if (this.data.discountAmount == 0) {
      return;
    }
    //将优惠券列表转成字符串
    var discountListStr = JSON.stringify(this.data.discountList);
    //uri编码
    discountListStr = encodeURIComponent(discountListStr);
    //跳到优惠券列表界面
    var urlStr = '/pages/fishSite/discount/discount?discount=' + discountListStr;
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
          var urlStr = '/pages/fishSite/payingSuccess/payingSuccess?award=' + rewardCoins;
          wx.redirectTo({
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
                var urlStr = '/pages/fishSite/payingSuccess/payingSuccess?award=' + rewardCoins;
                wx.redirectTo({
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
  //获取订单号
  getOrderId: function (callback) {
    //参数
    var para = {};
    //1.用户id
    para.uid = this.data.userId;
    //2.钓场id
    para.fishSiteId = this.data.fishSiteId;
    //3.总金额
    para.ordersMoney = this.data.tMoney.toString();
    //4.实付金额
    para.payMoney = ((this.data.tMoney - (this.data.selDiscount ? this.data.selDiscount.coupon.money : 0)) > 0 ? (this.data.tMoney - (this.data.selDiscount ? this.data.selDiscount.coupon.money : 0)) : 0).toString();
    //5.使用的存鱼总金额
    para.depositMoney = '0';
    //6.使用漂币数量
    para.goldCoinMoney = 0;
    //7.如果选中了优惠券 则需要加上这两个字段
    if (this.data.selDiscount) {
      console.log('选中的优惠券数据:');
      console.log(this.data.selDiscount);
      //7.1 优惠券id
      para.couponId = this.data.selDiscount.id.toString();
      //7.2优惠券面额
      para.couponsMoney = this.data.selDiscount.coupon.money.toString();
    }
    //8.商品数组
    var goodsArr = [];
    for (var i = 0; i < this.data.ticketArr.length; i++) {
      var goods = this.data.ticketArr[i];
      //创建一个字典
      var goodDict = {};
      //8.1商品id
      goodDict.goodId = goods.goodId.toString();
      //8.2实付单价
      goodDict.payPrice = goods.discountPrice.toString();
      //8.3数量
      goodDict.amount = goods.selCount;

      goodsArr.push(goodDict);
    }
    para.ordersDetails = goodsArr;
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
    var urlStr = app.basicURL + 'orders/create';

    hp.request('POST', urlStr, para, function (res) {
      //回调
      callback(isWXpay, res.body);
    });
  },
  //获取支付参数
  getPayParameter: function (orderId, callback) {
    //创建参数
    var para = {};
    //1.用户id
    para.uid = this.data.userId;
    //2.平台:1:微信，2:支付宝
    para.platform = 1;
    //3.订单号
    para.orderId = orderId;
    //4.IP地址 小程序里面无法获得,所以直接写死一个啦 随便写的
    para.appIp = '222.2.22.222';
    //商品名称
    para.body = '购票';
    //黑漂业务 1:购买商品(购票),2:充值，3：票支付
    para.hpService = 1;
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