
//-----------------下面是封装的方法--------------//

var app = getApp();

// 专为CTO做的网络请求封装类
function ctoRequest(method, url, data, result) {
  wx.request({
    url: url,
    data: data,
    method: method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    // header: {}, // 设置请求的 header
    success: function (res) {
      // success
      console.log('requestUrl,res', url, res);

// 200 201
      var code = res.statusCode.toString().indexOf('20')
      console.log('200 201', code);
      if (code != 0) {
        wx.showToast({
          title: '哎呀,出错了(' + res.statusCode + ')',
          icon: 'loading'
        })
        return;
      }
      // if (res.data.status != 0) {
      //   wx.showToast({
      //     title: res.data.errMsg,
      //     icon: 'loading'
      //   })
      //   return;
      // }
      //将结果回调
      result(res);

    },
    fail: function () {
      // fail
      wx.showToast({
        title: '请求出错了^o^',
        icon: 'loading'
      })
    }
  })
}

// 网络请求封装
function request(method, url, data, result) {
  wx.request({
    url: url,
    data: data,
    method: method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    // header: {}, // 设置请求的 header
    success: function (res) {
      // success
      console.log('requestUrl,res', url, res);

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
        title: '请求出错了^o^',
        icon: 'loading'
      })
    }
  })
}

//上传文件到OSS  文件名拼接规则  bucketName/dirPath/fileName.png

function uploadFile2OSS(filePath, fileName, dirPath, bucketName, result) {

  //1.先从后台拿到Signature和OSSAccessKeyId等信息
  var para = {
    bucket: bucketName,
    dir: dirPath + "/"
  };
  var urlStr = app.basicURL + 'token/oss_sign';
  //发送请求
  request('POST', urlStr, para, function (res) {
    console.log(res);
    //拼接formData参数 这5个参数是必须的
    var fd = {
      key: res.body.dir + fileName,
      OSSAccessKeyId: res.body.accessid,
      policy: res.body.policy,
      Signature: res.body.signature,
      success_action_status: '200'
    };
    //console.log('formData的格式是:');
    //console.log(fd);//res.body.host;  'https://disc-res.heipiaola.com'; 
    var url = res.body.host;

    //2.上传到OSS
    wx.uploadFile({
      url: url,
      filePath: filePath,
      //这个必须是file 切记!
      //这个代表上传的是文件
      name: 'file',
      formData: fd,
      success: function (res) {
        // success
        console.log(url);
        console.log('上传成功', res);
        if (res.statusCode != 200) {
          wx.showToast({
            title: '哎呀,出错了(' + res.statusCode + ')',
            icon: 'loading'
          })
          return;
        }
        //上传成功了,将文件名回调出去吧
        var fileKey = dirPath + '/' + fileName;

        result(fileKey);

      },
      fail: function (res) {
        // fail data errMsg statusCode
        console.log('失败了');
        console.log(res);
        wx.showToast({
          title: '上传出错了^o^' + res.errMsg + ',' + res.statusCode,
          icon: 'loading'
        })

      },
      complete: function (res) {
        // complete
      }
    })

  })

}


// 生成UUID
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  })
}


// ---------------------------gcjj02转换到百度地图经纬度方法 (这个方法有待验证)----------------------------//
function gcj2bd(lat, lon) {

  var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
  var x = lon, y = lat;
  var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
  var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
  var bd_lon = z * Math.cos(theta) + 0.0065;
  var bd_lat = z * Math.sin(theta) + 0.006;
  var result = [];
  result.push(bd_lat);
  result.push(bd_lon);

  return result;
}

//为日期类添加一个方法,这个方法用于将时间戳转成特定的字符串 传入参数是num型毫秒级
// var d = new Date(1495162106000)
// console.log(d.format('yyyy-MM-dd-hh-mm-ss'))
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



// console.log('isPhoneNum', '13515235695'.isPhoneNum());
String.prototype.isPhoneNum = function () {
  return /^1[34578]\d{9}$/.test(this);
}


/*
prototype为对象原型，注意这里为对象增加自定义方法的方法。
n表示第几项，从0开始算起。
如果n<0，则不进行任何操作。
     concat方法：返回一个新数组，这个新数组是由两个或更多数组组合而成的。
           这里就是返回this.slice(0,n)/this.slice(n+1,this.length)
           组成的新数组，这中间，刚好少了第n项。
     slice方法： 返回一个数组的一段，两个参数，分别指定开始和结束的位置。
    */
// Array.prototype.del = function (n) {
//   if (n < 0) {
//     return this;
//   } else {
//     return this.slice(0, n).concat(this.slice(n + 1, this.length));
//   }
// }


//导出
module.exports = {
  ctoRequest: ctoRequest,
  request: request,
  uploadFile2OSS: uploadFile2OSS,
  uuid: uuid
}