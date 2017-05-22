// pages/mine/mySiteTicket/mySiteTicket.js
var QR = require("qrcode.js");
var hp = require('../../../utils/HPUtils.js');
var app = getApp();
Page({
  data: {
    //用户数据
    user: app.user,
    //OSS图片下载地址
    fs_profile_DownLoad_HostURL: app.OSS.fs_profile_DownLoad_HostURL,
    //点击一张票时的票码
    ticketCode: '',
    //选中的票的tid
    selTicket: null,
    //是否要显示二维码
    isShowQRCode: false,
    //显示二维码时的时钟id
    heartBeatTimer: null
  },
  onLoad: function (options) {
    // 页面初始化
    //加载票数据
    this.loadTicketData();

  },
  onShow: function () {
    //判断app有没有这个值isCheckTktSuccess 有的话就要从新加载列表数据
    if (app.isCheckTktSuccess) {
      this.loadTicketData();
      //删除这个标识
      delete app.isCheckTktSuccess;
    }
  },
  onUnload: function () {
    //停止心跳
    clearInterval(this.data.heartBeatTimer);
    this.setData({
      isShowQRCode: false
    });
  },
  //sb的画布
  sbcanvas: function () {

  },
  //加载可用票数据
  loadTicketData: function () {
    //加载用户购买的票
    //list/uid/{uid}/{status}/{start}/{size}"
    //通过用户id查询票 v1/ticket/list/uid/10002/0/0/10   状态 0:未使用,1:已使用,2:已退票,3:过期
    //容量直接写100 不分页了
    var urlStr = app.basicURL + 'ticket/list/uid/' + app.user.id + '/0/0/100'
    var that = this;

    hp.request('GET', urlStr, {}, function (res) {
      
      //设置时间格式
      for (var i = 0; i < res.body.length; i++) {
        var ticket = res.body[i];

        var newDate = new Date(ticket.buyTime);

        ticket.buyDateStr = newDate.format('yyyy-MM-dd hh:mm:ss');
      }
      //保存数据
      that.setData({
        body: res.body
      });
    });
  },
  //当点击其中的票的时候调用
  ticketClicked: function (e) {
    console.log(e.currentTarget.dataset.ticket);
    var ticket = e.currentTarget.dataset.ticket;
    var that = this;
    //加载票码
    this.loadTicketCode(ticket.tid, function (ticketCode) {
      //记录票码
      //分隔一下 注意:这里如果不是8位的话,就坑爹了
      var code = ticketCode.toString().substr(0, 4) + '-' + ticketCode.toString().substr(4, 4) + ticketCode.toString().substr(7, ticketCode.toString().length - 8);
      that.setData({
        ticketCode: code,
        selTicket: ticket,
        isShowQRCode: true
      });
      //绘制二维码
      //注意 传进取的一定是字符串!!
      QR.qrApi.draw(ticket.tid.toString(), 'qrcode', 180, 180);
      //接下不断调用检测票接口是否已经使用了
      var heartBeatTimer = setInterval(function () {
        that.detectTicketUsed(function (status) {
          //如果状态是0说明未使用
          console.log(heartBeatTimer);
          if (status != 0) {
            //停止心跳
            clearInterval(heartBeatTimer);
            if (status == 1) {
              //说明已经使用,说明已经验票成功了,
              //取消二维码页面
              that.cancelQRCodeView();
              //跳转到核票成功界面
              that.showCheckTicketSuccess();
            }
          }
        });
      }, 3000);
      //将时钟id保存到data中
      that.setData({
        heartBeatTimer: heartBeatTimer
      });
    });
  },
  //加载票的码号
  loadTicketCode: function (tid, callback) {
    //菊花
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 10000
    })
    var that = this;
    var urlStr = app.basicURL + 'ticket/ticketCode/' + tid;

    hp.request('GET', urlStr, {}, function (res) {
      //回调
      wx.hideToast();
      callback(res.body.code);
    });
  },
  //检测票是否已经使用过了
  detectTicketUsed: function (callback) {
    var urlStr = app.basicURL + 'ticket/tid/' + this.data.selTicket.tid;
    hp.request('GET', urlStr, {}, function (res) {
      //执行回调 将票的状态搞出去
      //0:未使用 其他的我都不管了
      callback(res.body.status);
    });
  },
  //取消二维码页面
  cancelQRCodeView: function () {
    //停止心跳
    clearInterval(this.data.heartBeatTimer);
    this.setData({
      isShowQRCode: false
    });
  },
  //跳转到引导界面
  showGuidePage: function () {
    wx.navigateTo({
      url: '/pages/mine/guide/guide'
    })
  },
  //跳转到核票成功界面
  showCheckTicketSuccess: function () {
    //地址
    var url = '/pages/mine/checkTktSuccess/checkTktSuccess?fishSiteName=' + this.data.selTicket.fishSiteName + '&tangName=' + this.data.selTicket.ticketName + '&tid=' + this.data.selTicket.tid + '&code=' + this.data.ticketCode;
    wx.navigateTo({
      url: url
    })
  }

})