

var VF = require('../../../verify/verifyNum/verify.js');
var hp = require('../../../../utils/HPUtils.js');
var app = getApp();
Page({
  data: {
    //活动背景图片的OSS基本地址
    fs_discovery_DownLoad_HostURL: app.OSS.fs_discovery_DownLoad_HostURL,
    // 请求的数据
    json: undefined,
  },
  onLoad: function (options) {
    console.log("onLoad");
    var jsonStr = options.releasedDataJsonStr;

    var json = JSON.parse(jsonStr);
    // console.log("json", json);
    // 图片解析imgs
    var imgStr = json.picture;
    var images = imgStr.split(',');
    // 去除空元素
    var imgs = [];
    for (var i = 0; i < images.length; i++) {
      var str = images[i];
      if (str != "") {
        var obj = {
          img: this.data.fs_discovery_DownLoad_HostURL + '/' + str
        }
        imgs.push(obj);
      }
    }
    // console.log('imgs', imgs);
    json.imgs = imgs;
    console.log("解码后数据json", json);
    //保存传过来的数据
    this.setData({
      json: json
    });
    console.log("解码后数据json", this.data.json);
  },
  onShow: function (options) {
    console.log("onShow");
  },
  // 从相册选择
  selectImg: function (e) {

    console.log('从相册选择', e);
    var idx = e.currentTarget.dataset.idx;
    var imgArr = this.data.json.imgs;

    var that = this
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      count: 3,
      success: function (res) {
        console.log(res)
        var selImg = {
          img: res.tempFilePaths[0]
        }
        // 数组元素替换
        imgArr.splice(idx, 1, selImg); //删除1项，插入1项 
        console.log('console.log', imgArr);

        that.setData({
          json: that.data.json
        })
      }
    })
  },
  // 发布
  releaseAgain: function () {
    console.log('重新发布');

    wx.showToast({
      title: '发布中...',
      icon: 'loading',
      duration: 3000,
      mask: true
    });

    var that = this;

    var imgArr = this.data.json.imgs;
    // 上传图片到oss
    var pics = [];
    var picStr = '';

    // 添加原有图片
    for (var i = 0; i < 3; i++) {
      var imgPath = imgArr[i].img;
      if (imgPath.indexOf('http') == 0) {
        // var str = imgPath.substring(54);
        var str = imgPath.slice(-48);
        // var str1 = imgPath.substr(-48);
        console.log('http', str);
        pics.push(str);
      }
    }

    for (var i = 0; i < 3; i++) {
      var imgPath = imgArr[i].img;
      // console.log(imgPath);
      // 选出要上传的图片  以wxfile开头
      if (imgPath.indexOf('wxfile') == 0) {
        console.log('看看几次', imgPath);

        var str = hp.uuid();

        hp.uploadFile2OSS(imgPath, str + '.png', 'release', app.OSS.fs_discoveryBucketName, function (keyPath) {
          console.log("keyPath", keyPath);
          pics.push(keyPath);
          
          if (pics.length == 3) {
            console.log('pics', pics);
            picStr = pics.join(',');
            console.log('picStr', picStr);
            that.setData({
              picture: picStr
            })
            that.releaseMethod()
          }
        })

      }


    }

  },
  // 重新发布 put 
  releaseMethod: function () {
    var that = this;
    var urlStr = app.basicURL + 'marketing/pictures';

    // marketingId(Y):营销活动id ,
    // uid(Y) :发布用户id,
    // picture(Y):图片,
    // pictureDesc(Y):图片描述
    var para = {
      marketingId: this.data.json.marketingId,
      uid: app.user.id,
      picture: this.data.picture,
      pictureDesc: this.data.json.pictureDesc
    }
    console.log("para", para);
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 10000,
      mask: true
    });
    hp.request('PUT', urlStr, para, function (res) {
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

})