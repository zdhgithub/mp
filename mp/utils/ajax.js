

var app = getApp();
var hp = require('HPUtils.js');



var ajax = (function () {

  var marketing = {
    // 获取营销活动列表
    getActList: function (index, callback) {
      var url = app.basicURL + 'marketing/listpage/' + index + '/10'
      hp.request('GET', url, {}, function (res) { callback(res) })
    },
    // 获取发布图片列表
    getPicsList: function (mid, callback) {
      var url = app.basicURL + 'marketing/list/' + mid + '/' + app.user.id;
      hp.request('GET', url, {}, function (res) { callback(res) })
    },
    // 用户是否参加活动
    isJoinAct: function (uid, mid, callback) {
      var urlStr = app.basicURL + 'marketing/status/' + uid + '/' + mid;
      hp.request('GET', urlStr, {}, function (res) { callback(res) })
    },
    // 获取个人发布图片内容
    getPersonalPics: function (mid, uid, callback) {
      var url = app.basicURL + 'marketing/picture/' + mid + '/' + uid;
      hp.request('GET', url, {}, function (res) { callback(res) })
    },
    // 点赞方法
    zan: function (para, callback) {
      var url = app.basicURL + 'marketing/likeUser';
      hp.request('POST', url, para, function (res) { callback(res) })
    },


  }


  module.exports = {
    marketing: marketing
  }
})();