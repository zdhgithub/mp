

var VF = require('../../../verify/verifyNum/verify.js');
var hp = require('../../../../utils/HPUtils.js');
var app = getApp();
Page({
  data: {
    //活动背景图片的OSS基本地址
    fs_discovery_DownLoad_HostURL: app.OSS.fs_discovery_DownLoad_HostURL,
  },
  onLoad: function (options) {
    console.log("options", options);
    var jsonStr = options.releasedDataJsonStr;

    var json = JSON.parse(jsonStr);
    // 图片解析imgs
    var imgStr = json.picture;
    var images = imgStr.split(',');
    // 去除空元素
    var imgs = [];
    for (var i = 0; i < images.length; i++) {
      var str = images[i];
      if (str != "") {
        var obj = {
          img:str
        }
        imgs.push(obj);
      }
    }
    console.log('imgs', imgs);
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
  // 加载活动详情的图片信息尺寸
  changeDetailImageSize: function (e) {
    console.log('加载活动详情的图片信息尺寸', e);
    //图片的位置
    var imgidx = e.currentTarget.dataset.idx;
    //取出图片
    var imgInfo = this.data.json.imgs[imgidx];
    //图片的真实宽高属性
    var width = e.detail.width;
    var height = e.detail.height;
    //为该张图片添加宽高属性
    var imgArr = [];
   
      imgInfo.w = 700;
      imgInfo.h = 700 * height / width
    
    
    //更新渲染层数据
    this.setData({
      json: this.data.json
    });
    console.log('更新渲染层数据', this.data.json);
  },
})