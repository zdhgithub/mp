
// 网络请求封装
function request(method,url,data,result) {
    wx.request({
      url: url,
      data: data,
      method: method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        // success
        console.log(url);
        console.log(res);
        if (res.statusCode != 200) {
          wx.showToast({
            title: '哎呀,出错了(' + res.statusCode + ')',
            icon: 'loading'
          })
          return;
        }
        if (res.data.status != 0) {
          wx.showToast({
            title: res.data.errMsg,
            icon: 'loading'
          })
          return;
        }
        //将结果回调
        result(res.data);

      },
      fail: function () {
        // fail
        wx.showToast({
            title: '出错了^o^',
            icon: 'loading'
          })
      }
    })
}

//为日期类添加一个方法,这个方法用于将时间戳转成特定的字符串
Date.prototype.format = function (format) {
          var date = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S+": this.getMilliseconds()
          };
          if (/(y+)/i.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
          }
          for (var k in date) {
            if (new RegExp("(" + k + ")").test(format)) {
              format = format.replace(RegExp.$1, RegExp.$1.length == 1
                ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
            }
          }
          return format;
        }

//导出
module.exports = {
   request:request
}