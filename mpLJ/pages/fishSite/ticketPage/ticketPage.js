// pages/fishSite/ticketPage/ticketPage.js
var VF = require('../../verify/verifyNum/verify.js');
var hp = require('../../../utils/HPUtils.js');
var app = getApp();
Page({
  data: {
    //钓场id
    fishSiteId: null,
    // 选中的票的总数量
    tCount: 0,
    //选中的票的总金额
    tMoney: 0.00,
    //票金额的字符串
    tMoneyStr: '0.00'
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    //将钓场id也记录下来
    this.setData({
      fishSiteId: options.fishSiteId
    });
    //加载票数据
    var that = this;
    this.loadTicketsData(function (data) {
      //保存返回的数据
      that.setData(data);
      //同时设置
    });
  },
  onShow: function () {
    //判断一下app对象是否有isPaySuccess这个key 有的话就刷新票界面
    if (app.isPaySuccess) {
      // console.log('来到这里啦?票列表界面');
      //删除这个key
      delete app.isPaySuccess;
      //加载票数据
      var that = this;
      wx.showToast({
        title: '加载中...',
        icon: 'loading',
        duration: 10000,
        mask: true
      })
      this.loadTicketsData(function (data) {
        //保存返回的数据
        that.setData(data);
        //同时设置
        that.setData({
          // 选中的票的总数量
          tCount: 0,
          //选中的票的总金额
          tMoney: 0.00,
          //票金额的字符串
          tMoneyStr: '0.00'
        });
        wx.hideToast();
      });
    }
  },
  //页面分享按钮
  onShareAppMessage: function () {
    var title = '【黑漂钓鱼】' + (this.data.body.fishSiteName ? this.data.body.fishSiteName : '') + '支付即走更随意';
    return {
      title: title,
      path: '/pages/fishSite/ticketPage/ticketPage?fishSiteId=' + this.data.fishSiteId
    }
  },
  //加载票数据
  loadTicketsData: function (callback) {
    //参数
    //默认从0开始查询,查询容量为100 且查询的是出售中的商品 状态 0：仓库中,1:出售中
    //一次性把所有的票都加载出来 不分页了!!
    var that = this;
    var url = app.basicURL + 'goods/wxMini/' + this.data.fishSiteId + '/1/0/100';

    hp.request('GET', url, {}, function (res) {
      //再自己添加一个属性 是用来记录选中的票票
      for (var i = 0; i < res.body.list.length; i++) {
        res.body.list[i].selCount = 0;
        console.log(res.body.list[i]);
      }
      //执行回调
      callback(res);
    });
  },
  //跳转到钓场详情
  showSiteDetail: function () {
    var urlStr = '/pages/fishSite/siteDetail/siteDetail?fishSiteId=' + this.data.fishSiteId;
    console.log(urlStr);
    wx.navigateTo({
      url: urlStr
    })
  },
  //当点击加号按钮的时候调用
  addTicketClicked: function (e) {
    //获取到这张票的所有信息
    //通过票id来判断是哪一张票
    var selTid = e.currentTarget.dataset.ticket.goodId;
    var ticketArr = this.data.body.list;
    var money = 0.00;
    var count = 0;
    for (var i = 0; i < ticketArr.length; i++) {
      var ticket = ticketArr[i];
      if (ticket.goodId == selTid) {
        //往这张票中加入一个字段,这个字段是一个用来标记是选中了几张票了了
        if (ticket.selCount != undefined) {
          //判断当前的选中的票的数量是否大于库存了了
          if (ticket.amount > ticket.selCount) {
            ticket.selCount += 1;
            money = ticket.discountPrice;
            count = 1;
          } else {
            ticket.selCount = ticket.amount;
          }
        } else {
          ticket.selCount = 1;
          money = ticket.discountPrice;
          count = 1;
        }
        console.log(ticket.selCount);

      }
    }
    //加钱
    this.data.tMoney += money;
    this.data.tMoneyStr = this.data.tMoney.toFixed(2);
    //统计数量
    this.data.tCount += count;
    //再保存到Data中
    this.setData(this.data);
  },
  //当点击减号按钮的时候调用
  delTicketClicked: function (e) {
    //获取到这张票的所有信息
    //通过票id来判断是哪一张票
    var selTid = e.currentTarget.dataset.ticket.goodId;
    var ticketArr = this.data.body.list;
    var money = 0.00;
    var count = 0;
    for (var i = 0; i < ticketArr.length; i++) {
      var ticket = ticketArr[i];
      if (ticket.goodId == selTid) {
        //往这张票中加入一个字段,这个字段是一个用来标记是选中了几张票了了
        if (ticket.selCount != undefined) {
          if (ticket.selCount > 0) {
            ticket.selCount -= 1;
            money = ticket.discountPrice;
            count = 1;
          } else {
            ticket.selCount == 0;
          }
        } else {
          ticket.selCount = 0;
          money = ticket.discountPrice;
          count = 1;
        }
        console.log(ticket.selCount);
      }
    }
    //减钱钱
    this.data.tMoney -= money;
    this.data.tMoneyStr = this.data.tMoney.toFixed(2);
    this.data.tCount -= count;
    //再保存到Data中
    this.setData(this.data);
  },
  //当点击'去支付'的时候调用
  payClicked: function (e) {
    //判断用户是否选择了一些票
    if (this.data.tCount == 0) {
      wx.showToast({
        title: '您还未选择票哦',
        icon: 'loading'
      })
      return;
    }
    //再判断一下用户是否已经登录了
    if (app.user) {
      //跳转到支付页面,
      this.payTicket();
    }
    else {
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
          that.payTicket();
        }
        //如果之前未绑定手机号码的,直接跳入到绑定界面了  或者提示错误信息了
      });
    }
  },
  //去到支付界面
  payTicket: function () {
    //遍历票列表数组找出选中的票
    // 搞一个空数组
    var selTicketArr = [];
    for (var i = 0; i < this.data.body.list.length; i++) {
      var ticket = this.data.body.list[i];
      if (ticket.selCount > 0) {
        //加入到选中的数组中
        selTicketArr.push(ticket);
      }
    }
    //将数组对象转换成字符串
    var arrStr = JSON.stringify(selTicketArr);
    // console.log(arrStr);
    console.log('传过去的参数');
    console.log(this.data);
    //添加参数
    var urlStr = '/pages/fishSite/payingTicket/payingTicket?fishSiteId=' + this.data.fishSiteId + '&tMoney=' + this.data.tMoneyStr + '&tArrStr=' + encodeURIComponent(arrStr);
    wx.navigateTo({
      url: urlStr
    })
  }
})