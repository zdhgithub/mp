// pages/activity/activityDetail/reviewArticles/reviewArticles.js
var app = getApp();
var hp = require('../../../../utils/HPUtils.js');
Page({
  data: {
    //OSS地址
    fs_discovery_DownLoad_HostURL: app.OSS.fs_discovery_DownLoad_HostURL,
    //文章id
    artId: undefined,
    //文章内容
    content:undefined
  },
  onLoad: function (options) {
    //记录下文章id
    this.setData({
      artId: options.artId
    });
    var that = this;
    //请求文章内容
    this.loadArticleContent(options.artId,function(res){
      that.setData({
        content:res
      });
    });
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },

  //加载文章详情
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

  //页面分享按钮
  onShareAppMessage: function () {
    return {
      title: this.data.content.title,
      path: '/pages/activity/activityDetail/reviewArticles/reviewArticles?artId=' + this.data.artId
    }
  },

})