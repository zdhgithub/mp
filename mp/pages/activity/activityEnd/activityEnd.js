// pages/activity/activityEnd/activityEnd.js



var VF = require('../../verify/verifyNum/verify.js');
var hp = require('../../../utils/HPUtils.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 悬浮视图初始位置
    left: app.sysInfo.windowWidth - 74,
    top: 240,
    //活动背景图片的OSS基本地址
    fs_discovery_DownLoad_HostURL: app.OSS.fs_discovery_DownLoad_HostURL,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.showShareMenu({
      withShareTicket: true
    })

    var act = options.act
    this.setData({
      act: act
    })

    var that = this;

    if (app.user) {
      this.onLoadMethod(act)
    } else {

      VF.checkUserBindPhoneNumber(function (result) {
        if (result == 1) {
          that.onLoadMethod(act)
        }
      })
    }

  },
  onLoadMethod: function (act) {

    var that = this;

    var dataStr = decodeURIComponent(act)
    var dataJson = JSON.parse(dataStr)
    this.setData({
      actId: dataJson.id,
      info: dataJson
    })

    //加载回顾文章列表
    this.loadReviewArticles(function (res) {
      //保存文章列表
      // that.setData({
      //   reviewArts: res.body
      // })
      var artId = res.body[0].id
      //请求文章内容
      that.loadArticleContent(artId, function (res) {
        that.setData({
          content: res
        })
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: app.user.nickName + '邀您一起看精彩钓鱼活动！',
      path: '/pages/activity/activityEnd/activityEnd?act=' + this.data.act
    }
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
  // 加载文章详情 加载第一篇文章直接显示
  loadArticleContent: function (artId, callback) {
    var urlStr = app.basicURL + 'campaign/article/id/' + artId;
    hp.request('GET', urlStr, {}, function (res) {

      //设置时间格式
      var art = res.body;
      //开始时间
      var beginDate = new Date(art.createTime);
      art.createTimeStr = beginDate.format('yyyy-MM-dd hh:mm');


      //解析活动详情
      var detailStr = res.body.content;
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
      // console.log('分隔的数据');
      // console.log(conArr);
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
      res.body.conInfoArr = detailInfoArr;

      //回调出去
      callback(res.body);
    });
  },
  // 加载活动详情的图片信息尺寸
  changeDetailImageSize: function (e) {
    // console.log(e);
    //图片的位置
    var imgidx = e.currentTarget.dataset.imgidx;
    //取出图片
    var imgInfo = this.data.content.conInfoArr[imgidx];
    //图片的真实宽高属性
    var width = e.detail.width;
    var height = e.detail.height;
    //为该张图片添加宽高属性
    imgInfo.width = 710;
    imgInfo.height = 710 * height / width;
    //更新渲染层数据
    this.setData({
      content: this.data.content
    });
  },




  //当点击回顾文章使,调用
  showReviewArticlesDetail: function (e) {
    // 暂停音乐
    this.audioPlayAndPause()
    var artId = e.currentTarget.dataset.art.id
    wx.navigateTo({
      url: '/pages/activity/activityDetail/reviewArticles/reviewArticles?artId=' + artId
    });
  },
  // 活动详情
  gotoActivityDetail: function () {
    // 暂停音乐
    this.audioPlayAndPause()
    wx.navigateTo({
      url: '/pages/activity/activityDetail/activityDetail?actId=' + this.data.actId
    })
  },
  releaseViewTouchMove: function (e) {

    var windowWidth = app.sysInfo.windowWidth
    var windowHeight = app.sysInfo.windowHeight

    // 拖动视图尺寸
    let viewW = 64
    let viewH = 30
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
})