// pages/activity/activityRelease/activityRelease

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
    // 输入的文本
    text: "",
    //动态输入文本长度
    textLength: 0,
    // 选择的图片
    imageList: [],
  },
  onLoad: function (options) {
    console.log("actId", options.actId);
    //保存活动id
    this.setData({
      actId: options.actId
    })
  },
  // 输入完成事件
  inputFinish: function (e) {
    // console.log(e.detail.value);
    this.setData({
      text: e.detail.value
    })
  },
  // 正在输入
  input: function (e) {
    console.log(e.detail.value.length);
    this.setData({
      textLength: e.detail.value.length
    })
  },
  // 从相册选择
  chooseImage: function () {
    var that = this
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      count: 3,
      success: function (res) {
        console.log(res)
        that.setData({
          imageList: res.tempFilePaths
        })
      }
    })
  },

  // 预览图片
  previewImage: function (e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.imageList
    })
  },
  // 发布
  releaseBtnClicked: function () {
    wx.showToast({
      title: '发布中...',
      icon: 'loading',
      duration: 60000,
      mask: true
    });

    var that = this;
    var text = this.data.text;
    var imgArr = this.data.imageList;

    if (text.length == 0) {
      this.textNoneshow()
      return;
    }

    if (imgArr.length != 3) {
      this.imgNoneshow()
      return;
    }

    // 上传图片到oss
    var pics = [];
    var picStr = '';


    for (var i = 0; i < 3; i++) {
      var imgPath = imgArr[i];
      // console.log(imgPath);

      var str = hp.uuid();
      // 上传图片
      var key = 'marketing/' + this.data.actId + '/' + app.user.id + '/' + str + '.jpg';

      hp.uploadImage(imgPath, key, function (key) {
        console.log('名称 地址', key, imgPath);
        pics.push(key);
        if (pics.length == 3) {
          picStr = pics.join(',');
          console.log('picStr', picStr);
          that.setData({
            picture: picStr
          })
          that.releaseMethod()
        }
      })



      // console.log(str);app-discovery  app.OSS.fs_discoveryBucketName

      // hp.uploadFile2OSS(imgPath, str + '.png', 'marketing', app.OSS.fs_discoveryBucketName , function (keyPath) {
      //   console.log("keyPakeyth", keyPath);
      // pics.push(keyPath);
      // if (pics.length == 3) {
      //   picStr = pics.join(',');
      //   console.log('picStr', picStr);
      //   that.setData({
      //     picture: picStr
      //   })
      //   that.releaseMethod()
      // }
      // })

    }

  },
  // 发布的网络请求 POST 
  releaseMethod: function () {
    var that = this;
    var urlStr = app.basicURL + 'marketing/pictures';

    // marketingId(Y):营销活动id ,
    // uid(Y) :发布用户id,
    // picture(Y):图片,
    // pictureDesc(Y):图片描述
    var para = {
      marketingId: this.data.actId,
      uid: app.user.id,
      picture: this.data.picture,
      pictureDesc: this.data.text
    }
    console.log("para", para);
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 10000,
      mask: true
    });
    hp.request('POST', urlStr, para, function (res) {
      var status = res.status;
      // 发布成功
      if (status == 0) {

        that.releaseSuccess()
        // 延迟2秒执行
        setTimeout(that.navigateBack, 2000)

      }
    })
  },
  // 发布成功返回上一界面
  navigateBack: function () {
    wx.navigateBack({ delta: 1 })
  },
  releaseSuccess: function () {
    wx.showToast({
      title: '发布成功',
      icon: 'loading',
      duration: 2000
    })
  },
  textNoneshow: function () {
    wx.showToast({
      title: '请输入内容',
      icon: 'loading',
      duration: 2000
    })
  },
  imgNoneshow: function () {
    wx.showToast({
      title: '请选择3张图片',
      icon: 'loading',
      duration: 2000
    })
  }
})