var app = getApp();
//判断用户是否之前已经绑定了手机号码
//回调函数中返回的参数:
//0:代表请求失败或者用户拒绝授权
//1:代表之前已经已经绑定了手机号码了,此时回调的时候,app的user对象已经有值了,同时也已经缓存到本地数据了
//2:代表用户之前未绑定手机号码,需要跳转到绑定界面
function checkUserBindPhoneNumber(callback) {
  wx.showToast({
    title: '加载中...',
    icon: 'loading',
    mask: true,
    duration: 10000
  });
  var that = this;
  //获取登录码
  getLoginCode(function (isS, code) {
    if (isS == false) {
      //回调
      callback(0);
      return;
    }
    //获取用户信息
    getUserInformation(function (isS, user) {
      if (isS == false) {
        //回调
        callback(0);
        return;
      }
      //判断这个微信号是否已经绑定了手机号码了
      var url = app.basicURL + 'users/login/wxMini/check';
      var parameter = {
        code: code,
        userInfo: user.userStr
      };
      wx.request({
        url: url,
        data: parameter,
        method: 'POST',
        success: function (res) {
          console.log('验证接口返回的数据',res);
       
          if (res.statusCode != 200) {
            wx.showToast({
              title: '哎呀,出错了(' + res.statusCode + ')',
              icon: 'loading'
            })
            //回调
            callback(0);
            return;
          }
          if (res.data.status != 0) {
            wx.showToast({
              title: res.data.errMsg,
              icon: 'loading'
            })
            //回调
            callback(0);
            return;
          }
          //如果body存在则表示已经绑定，反之则没有绑定
          //res.data.body
          if (res.data.body) {
            var u = res.data.body;
            //将微信的用户数据也添加上去
            u.avatarUrl = user.userInfo.avatarUrl;
            u.nickName = user.userInfo.nickName;
            u.language = user.userInfo.language;
            u.country = user.userInfo.country;
            u.province = user.userInfo.province;
            u.city = user.userInfo.city;
            u.language = user.userInfo.language;
            u.gender = user.userInfo.gender;

            console.log('验证是否登录时返回的用户信息',u);

            app.user = u;
            //缓存用户数据
            try {
              wx.setStorageSync('user', app.user);
              //隐藏提示框
              wx.hideToast();
            } catch (e) {
              //如果保存失败了,就提示一下用户
              wx.showToast({
                title: "保存用户信息失败,请重试",
                icon: "loading"
              });
              callback(0);
            }
            //拉起回调
            callback(1);
          } else {
            //没有值,说明没有绑定
            //重新再登录获取code
            getLoginCode(function (isS, code) {
              if (isS == false) {
                //回调
                callback(0);
                return;
              }
              //获取用户信息
              getUserInformation(function (isS, user) {
                if (isS == false) {
                  //回调
                  callback(0);
                  return;
                }
                //跳转到绑定界面
                verifyPhoneNumber(code, user.userStr);
                //隐藏提示框
                wx.hideToast();
                //回调
                callback(2);
              });
            });
          }
        },
        fail: function () {
          //回调
          callback(false);
          //隐藏提示框
          wx.hideToast();
        }
      })
    })
  });
}
//获取用户code
function getLoginCode(callback) {
  wx.login({
    success: function (res) {
      // success
      console.log('login.res',res);
      if (res.code) {
        callback(true, res.code);
      } else {
        wx.showToast({
          title: '获取用户登录态失败',
          icon: 'loading'
        })
        callback(false, '');
      }
    }
  })
}
//获取用户信息
function getUserInformation(callback) {
  wx.getUserInfo({
    success: function (res) {
      // success
      console.log('getUserInfo',res);
      var userInfo = {
        'iv': res.iv,
        'userInfo': res.userInfo,
        'rawData': res.rawData,
        'signature': res.signature,
        'encryptedData': res.encryptedData
      }
      //转成字符串
      var userStr = JSON.stringify(userInfo);

      //执行回调
      callback(true, {
        userInfo: res.userInfo,
        userStr: userStr
      });
    },
    fail: function () {
      // fail
      callback(false, '');
      //来到这里,说明用户拒绝授权,这时提示一下
      wx.showToast({
        title: '授权失败,请十分钟之后尝试',
        icon: 'loading'
      })
    }
  })
}
//跳转到绑定界面
function verifyPhoneNumber(code, userStr) {
  userStr = encodeURIComponent(userStr);
  //跳转到验证手机号码界面 + code + 用户信息字符串
  var urlStr = '/pages/verify/verifyNum/verifyNum?code=' + code + '&userStr=' + userStr;
  console.log(urlStr);
  wx.navigateTo({
    url: urlStr
  });
}



module.exports.checkUserBindPhoneNumber = checkUserBindPhoneNumber;
