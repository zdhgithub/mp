var hp = require('../../utils/HPUtils.js');
var VF = require('../verify/verifyNum/verify.js');


var app = getApp();
Page({
  data: {
    // 悬浮视图初始位置
    left: app.sysInfo.windowWidth - 54,
    top: 240,
    // 轮播图
    imgUrls: [
      'https://app-discovery.oss-cn-shenzhen.aliyuncs.com/mp/p1.png',
      'https://app-discovery.oss-cn-shenzhen.aliyuncs.com/mp/p2.png',
      'https://app-discovery.oss-cn-shenzhen.aliyuncs.com/mp/p3.png',
      'https://app-discovery.oss-cn-shenzhen.aliyuncs.com/mp/p4.png',
    ],
    // 是否第一次请求定位
    isFirstTimeReq: true,
    // 点击类型
    openType: 0,
    //活动列表数据
    actLists: null,
    //活动背景图片的OSS基本地址
    fs_discovery_DownLoad_HostURL: app.OSS.fs_discovery_DownLoad_HostURL,
    //用户头像OSS基本地址
    user_portrait_DownLoad_HostURL: app.OSS.user_portrait_DownLoad_HostURL,
    //上拉加载的提示语
    loadMoreState: "",
    //是否正在进行下啦刷新
    isRefreshing: false,
    //是否正在进行上拉加载操作
    isLoadMore: false,
    //上拉加载完所有数据了的标志
    isLoadAllData: false,
    // 请求列表的页码
    listPage: 1,

  },
  onLoad: function (options) {

    wx.getSetting({
      success(res) {
        console.log('读取照片权限',res)
        if (!res['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              wx.saveImageToPhotosAlbum({
                filePath: 'http://wx.qlogo.cn/mmopen/vi_32/e73xbFhLtPiaNUMjXje31InpEdNLSj5TyqBmaT8X1bZ03GHSu4bskgGYAgV7gZyqHvPHf08YAE8gpFMMz8O8zow/0',
              })
            }
          })
        }
      }
    })

    app.log('app.log openType onLoad', this.data.openType);

    // var that = this;

    // var jmz = {};
    // jmz.GetLength = function (str) {
    //   return str.replace(/[\u0391-\uFFE5]/g, "aa").length;  //先把中文替换成两个字节的英文，在计算长度
    // };
    // console.log('GetLength', jmz.GetLength('测试测试qw'));
    var employees = []
    employees[0] = { name: "George", age: 32, retiredate: "March 12, 2014" }
    employees[1] = { name: "Edward", age: 18, retiredate: "June 2, 2023" }
    employees[2] = { name: "Christine", age: 18, retiredate: "December 20, 2036" }
    employees[3] = { name: "Sarah", age: 62, retiredate: "April 30, 2020" }

    employees.sort(function (v1, v2) {
      // 如果年龄相同，则按姓名排序
      if (v1.age === v2.age) {
        return v1.name > v2.name ? 1 : -1;
      } else {
        return v1.age > v2.age ? 1 : -1;
      }
    })

    // var by = function (name) {
    //   return function (o, p) {
    //     var a, b;
    //     if (typeof o === "object" && typeof p === "object" && o && p) {
    //       a = o[name];
    //       b = p[name];
    //       if (a === b) {
    //         return 0;
    //       }
    //       if (typeof a === typeof b) {
    //         return a < b ? -1 : 1;
    //       }
    //       return typeof a < typeof b ? -1 : 1;
    //     }
    //     else {
    //       throw ("error");
    //     }
    //   }
    // }


    // employees.sort(by("age"));




    // var by = function (name, minor) {
    //   return function (o, p) {
    //     var a, b;
    //     if (o && p && typeof o === 'object' && typeof p === 'object') {
    //       a = o[name];
    //       b = p[name];
    //       if (a === b) {
    //         return typeof minor === 'function' ? minor(o, p) : 0;
    //       }
    //       if (typeof a === typeof b) {
    //         return a < b ? -1 : 1;
    //       }
    //       return typeof a < typeof b ? -1 : 1;
    //     } else {
    //       thro("error");
    //     }
    //   }
    // }

    // employees.sort(by('age', by('name')));
    console.log(employees)

    // if (app.user) {
    //   this.actMethod()
    //   console.log('怎么回事')
    // }
    // else {

    //   VF.checkUserBindPhoneNumber(function (result) {
    //     if (result == 1) {
    //       console.log('11111怎么回事')
    //       that.actMethod()
    //     }
    //   })
    // }





  },
  onShow: function () {
    console.log('onShow')
    var that = this;

    if (this.data.openType == 0) {
      if (app.user) {
        // 营销活动列表
        this.loadSaleList(1, function (res) {
          var actId = res[0].id
          that.setData({
            actId: actId
          })

          //加载发布图片列表
          that.loadPicsData(actId, function (picsList) {
            that.setData({
              picsList: picsList
            })
          })
          //判断是否发布
          that.judgeRelOrNot(app.user.id, that.data.actId);

        })


      } else {
        VF.checkUserBindPhoneNumber(function (result) {
          console.log('result', result);
          if (result == 1) {

            // 营销活动列表
            that.loadSaleList(1, function (res) {
              var actId = res[0].id
              that.setData({
                actId: actId
              })

              //加载发布图片列表
              that.loadPicsData(actId, function (picsList) {
                that.setData({
                  picsList: picsList
                })
              })
              //判断是否发布
              that.judgeRelOrNot(app.user.id, that.data.actId);
            })

          }
        })
      }
    }


  },
  actMethod: function () {


    // 数组元素替换
    // var lang = ["php", "java", "javascript"]; 
    // var replace = lang.splice(1, 1, "ruby"); //删除一项，插入两项 
    // console.log('console.log',replace,lang);



    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    this.loadActivitys(1, 10, function (lists) {
      //将数据保存起来
      if (lists.length == 10) {
        //将数据添加到原来的数组中并且设置状态
        that.setData({
          actLists: lists,
          isLoadMore: false,
          loadMoreState: "点击或上拉可加载更多"
        });
      } else {
        //已经全部加载完成了了
        that.setData({
          actLists: lists,
          isLoadAllData: true,
          isLoadMore: false,
          loadMoreState: "--哎呀,到底了--"
        });
      }
    });
  },

  // 下啦刷新
  onPullDownRefresh: function () {
    console.log('下啦刷新 你妈 openType', this.data.openType);
    var that = this;

    var openType = this.data.openType;


    if (openType == 0) {

      //加载发布图片列表
      this.loadPicsData(this.data.actId, function (picsList) {
        that.setData({
          picsList: picsList
        })
      })
      //判断是否发布
      this.judgeRelOrNot(app.user.id, this.data.actId);

    } else if (openType == 1) {
      //判断是否正在进行下拉刷新操作
      if (this.data.isRefreshing == true) {
        return;
      }
      //设置下拉刷新操作
      this.data.isRefreshing = true;
      // 获取用户获取了几条数据了
      // var size = this.data.actLists.length > 0 ? this.data.actLists.length : 10; 这个存在一个bug,当添加新活动,刷新的时候,最后一个活动会被省略掉。于是直接固定size为10就好了。
      var size = 10;

      //加载数据
      this.loadActivitys(1, size, function (lists) {
        //将数据保存起来
        that.setData({
          actLists: lists
        });
        //停止刷新
        wx.stopPullDownRefresh();
        //设置下拉刷新操作
        that.data.isRefreshing = false;
      });

    } else {

    }

  },
  // 加载更多
  onReachBottom: function () {
    console.log('openType', this.data.openType);

    var openType = this.data.openType;
    if (openType == 0) {

    } else if (openType == 1) {

      console.log('onReachBottom  1', this.data.isLoadMore, this.data.isLoadAllData)

      //判断是否正在加载
      if (this.data.isLoadMore == false && this.data.isLoadAllData == false) {
        //设置上拉加载状态
        this.setData({
          "loadMoreState": "正在加载更多数据...",
          "isLoadMore": true
        });
        //请求数据
        var that = this;
        this.loadActivitys(this.data.listPage, 10, function (lists) {
          //将数据保存起来
          if (lists.length == 10) {
            //将数据添加到原来的数组中并且设置状态
            that.setData({
              actLists: that.data.actLists.concat(lists),
              isLoadMore: false,
              loadMoreState: "点击或上拉可加载更多"
            });
          } else {
            //已经全部加载完成了了
            that.setData({
              actLists: that.data.actLists.concat(lists),
              isLoadAllData: true,
              isLoadMore: false,
              loadMoreState: "--哎呀,到底了--"
            });
          }
        });

      }
    } else {




    }

  },
  //加载活动列表
  //index:页码
  // size:范围
  //callback:回调,活动列表数据
  loadActivitys: function (index, size, callback) {
    var that = this;
    var urlStr = app.basicURL + 'campaign/list?start=' + index + '&size=' + size;

    hp.request('GET', urlStr, {}, function (res) {

      //设置时间格式
      for (var i = 0; i < res.body.length; i++) {
        var act = res.body[i];

        var beginDate = new Date(act.beginTime);

        act.beginTimeStr = beginDate.format('yyyy年MM月dd日 h:m');
      }
      //设置页码
      that.setData({
        listPage: that.data.listPage + 1
      });
      //将数据回调
      callback(res.body);
    });
  },
  // 加载营销活动列表
  loadSaleList: function (index, callback) {

    var urlStr = app.basicURL + 'marketing/listpage/' + index + '/10'
    hp.request('GET', urlStr, {}, function (res) {
      console.log('营销活动列表', urlStr, res);
      var bodyArr = res.body;
      callback(bodyArr);
    })

    // var urlStr = app.basicV2Url + 'marketing/list/' + index + '/10'
    // hp.ctoRequest('GET', urlStr, {}, function (res) {
    //   console.log('营销活动列表', urlStr, res);
    //   var bodyArr = res.data;
    //   callback(bodyArr);
    // })
  },
  //点击一个活动cell,进入活动详情页面
  gotoActivityDetail: function (e) {

    // console.log('gotoActivityDetail',e);

    var act = e.currentTarget.dataset.act
    var actId = act.id
    var status = act.status

    console.log('status', status);
    // 活动回顾
    if (status == 4) {
      var dataStr = JSON.stringify(act)
      var dataStrUrl = encodeURIComponent(dataStr)
      wx.navigateTo({
        url: '/pages/activity/activityEnd/activityEnd?act=' + dataStrUrl
      })
    }
    // 活动详情
    else {
      wx.navigateTo({
        url: '/pages/activity/activityDetail/activityDetail?actId=' + actId
      })
    }
  },
  //点击一个活动cell,进入营销活动页面
  // gotoActivitySale: function (e) {
  //   console.log('点击一个活动cell,进入营销活动页面', e);
  //   var actId = e.currentTarget.dataset.act.id;

  //   console.log("gotoActivitySale");
  //   wx.navigateTo({
  //     url: '/pages/activity/activitySale/activitySale?actId=' + actId
  //   })
  // },
  //页面分享按钮
  onShareAppMessage: function () {
    return {
      title: '黑漂钓鱼邀您一起鱼乐！',
      path: '/pages/fishHappy/fishHappy'
    }
  },


  changeImgSize: function (e) {
    // console.log('图片加载完成', e);

    var index = e.currentTarget.dataset.idx;
    var obj = this.data.saleLists[index];
    var img = obj.banner;
    // 获得图片尺寸
    var imgw = e.detail.width;
    var imgh = e.detail.height;
    // 重新设置图片尺寸
    obj.w = 750;
    obj.h = 750 * imgh / imgw;

    this.setData({
      saleLists: this.data.saleLists
    });
  },
  //加载图片列表数据
  loadPicsData: function (actId, callback) {

    var that = this;

    var urlStr = app.basicURL + 'marketing/list/' + actId + '/' + app.user.id;
    hp.request('GET', urlStr, {}, function (res) {
      //将数据回调
      console.log('加载图片列表数据', res);

      for (var i = 0; i < res.body.length; i++) {
        var obj = res.body[i];

        // 解析图片字符串成数组
        var picStr = obj.picture;
        // console.log('picStr', picStr);
        var arr = picStr.split(',');
        //移除空元素
        var arrRes = [];
        for (var j = 0; j < arr.length; j++) {
          var item = arr[j];
          if (item != '') {
            var imgObj = {
              img: item
            }
            arrRes.push(imgObj);
          }
        }
        // console.log('arr,arrRes', arr, arrRes);
        obj.imgs = arrRes;

        // 头像解析
        var portriat = obj.portriat;
        console.log('头像解析portriat', portriat);
        if (portriat == undefined || portriat.length == 0) {
          portriat = '';
        } else {
          console.log('indexOf', portriat.indexOf('http'));
          if (portriat.indexOf('http') < 0) {//不以http开头
            portriat = that.data.user_portrait_DownLoad_HostURL + '/' + portriat;
          }
        }
        obj.portriat = portriat;

        // 解析点赞人名 nicknames
        if (obj.likeCount == 0) {
          console.log('likeCount == 0');
        } else {
          var likeUsuer = obj.likeUsuer;
          var nicknames = '';
          for (var j = 0; j < likeUsuer.length; j++) {
            var user = likeUsuer[j];
            var nickname = user.nickName;
            nicknames += nickname + '、';
          }
          nicknames = nicknames.substring(0, nicknames.length - 1);
          console.log('nicknames', nicknames);
          obj.nicknames = nicknames;
        }


        // 点赞列表展开状态isMore
        obj.isMore = false;

      }


      // 解析点赞排名  sort方法在真机没效果
      // var arr = res.body
      // arr.sort(function (v1, v2) {
      //   if (v1.likeCount === v2.likeCount && v1.likeUsuer.length > 0 && v2.likeUsuer.length > 0) {
      //     return v1.likeUsuer[0].likeTime < v2.likeUsuer[0].likeTime
      //   } else {
      //     return v2.likeCount > v1.likeCount
      //   }
      // })

      // // arr.sort(function (o1, o2) {
      // //   return o2.likeCount - o1.likeCount
      // // })
      

      // for (var i = 0; i < arr.length; i++) { arr[i].sort = i + 1 }

      // var arrN = []
      // var selfObj;
      // for (var i = 0; i < arr.length; i++) {
      //   var obj = arr[i];
      //   if (obj.uid == app.user.id) {
      //     selfObj = obj
      //   }
      //   if (obj.uid != app.user.id) {
      //     arrN.push(obj)
      //   }
      // }
      // arrN.unshift(selfObj)
      // console.log('排名后', arrN)

      callback(res.body);
    })

    // var urlStr = app.basicV2Url + 'marketing/pictures/' + actId;
    // hp.ctoRequest('GET', urlStr, {}, function (res) {
    //   //将数据回调
    //   console.log('加载图片列表数据', res);

    //   for (var i = 0; i < res.data.length; i++) {
    //     var obj = res.data[i];

    //     // 解析图片字符串成数组
    //     var picStr = obj.picture;
    //     // console.log('picStr', picStr);
    //     var arr = picStr.split(',');
    //     //移除空元素
    //     var arrRes = [];
    //     for (var j = 0; j < arr.length; j++) {
    //       var item = arr[j];
    //       if (item != '') {
    //         var imgObj = {
    //           img: item
    //         }
    //         arrRes.push(imgObj);
    //       }
    //     }
    //     // console.log('arr,arrRes', arr, arrRes);
    //     obj.imgs = arrRes;

    //     // 头像解析
    //     var portriat = obj.portriat;
    //     console.log('头像解析portriat', portriat);
    //     if (portriat == undefined || portriat.length == 0) {
    //       portriat = '';
    //     } else {
    //       console.log('indexOf', portriat.indexOf('http'));
    //       if (portriat.indexOf('http') < 0) {//不以http开头
    //         portriat = that.data.user_portrait_DownLoad_HostURL + '/' + portriat;
    //       }
    //     }
    //     obj.portriat = portriat;

    //     // 解析点赞人名 nicknames
    //     if (obj.likeCount == 0) {
    //       console.log('likeCount == 0');
    //     } else {
    //       var likeUsuer = obj.likeUsuer;
    //       var nicknames = '';
    //       for (var j = 0; j < likeUsuer.length; j++) {
    //         var user = likeUsuer[j];
    //         var nickname = user.nickName;
    //         nicknames += nickname + '、';
    //       }
    //       nicknames = nicknames.substring(0, nicknames.length - 1);
    //       console.log('nicknames', nicknames);
    //       obj.nicknames = nicknames;
    //     }


    //     // 点赞列表展开状态isMore
    //     obj.isMore = false;

    //   }

    //   callback(res.data);
    // })
  },
  // 判断是否发布 GET /marketing/{uid}/{mid}  1：表示已参加， 0：表示未参加
  judgeRelOrNot: function (uid, mid) {
    var that = this;

    var urlStr = app.basicURL + 'marketing/status/' + uid + '/' + mid;
    hp.request('GET', urlStr, {}, function (res) {
      console.log('判断是否发布', urlStr, res.body);
      if (res.body == 1) {
        that.setData({
          isReleased: true
        })

        // 已发布，判断有没审核通过，通过隐藏悬浮按钮
        that.loadReleasedData(that.data.actId, function (releasedData) {
          // 状态(0 审核中，1 通过，2 审核不通过)
          if (releasedData.status == 1) {
            that.setData({
              isChecked: true
            })
          } else {
            that.setData({
              isChecked: false
            })
          }
        })




      } else {
        that.setData({
          isReleased: false
        })
      }
      console.log('isReleased', that.data.isReleased);
    })

    // var urlStr = app.basicV2Url + 'marketing/' + uid + '/' + mid;
    // hp.ctoRequest('GET', urlStr, {}, function (res) {
    //   console.log('判断是否发布', urlStr, res.data);
    //   if (res.data == 1) {
    //     that.setData({
    //       isReleased: true
    //     })
    //   } else {
    //     that.setData({
    //       isReleased: false
    //     })
    //   }
    //   console.log('isReleased', that.data.isReleased);
    // })
  },
  //加载已发布内容GET /marketing/picture/{marketingId}/{uid}
  loadReleasedData: function (actId, callback) {
    var that = this;
    var uid = app.user.id;


    var urlStr = app.basicURL + 'marketing/picture/' + actId + '/' + uid;
    hp.request('GET', urlStr, {}, function (res) {
      //将数据回调
      // 图片解析imgs
      var imgStr = res.body.picture;
      var images = imgStr.split(',');
      // 去除空元素
      var imgs = [];
      for (var i = 0; i < images.length; i++) {
        var str = images[i];
      }
      res.body.imgs = imgs;

      // 点赞人名解析
      var likeUsuer = res.body.likeUsuer;
      if (likeUsuer.length == 0) {
        res.body.nicknames = "";
      } else {
        var nicknames = "";
        var length = likeUsuer.length;
        for (var i = 0; i < length - 1; i++) {
          nicknames += likeUsuer[i].nickName + '、';
        }
        nicknames += likeUsuer[length - 1].nickName;
        // console.log('nicknames nicknamesLength', nicknames, nicknames.length);

        res.body.nicknames = nicknames;
      }
      callback(res.body);
    });



    // var urlStr = app.basicV2Url + 'marketing/picture/' + actId + '/' + uid;
    // hp.ctoRequest('GET', urlStr, {}, function (res) {
    //   //将数据回调
    //   // 图片解析imgs
    //   var imgStr = res.data.picture;
    //   var images = imgStr.split(',');
    //   // 去除空元素
    //   var imgs = [];
    //   for (var i = 0; i < images.length; i++) {
    //     var str = images[i];
    //   }
    //   res.data.imgs = imgs;

    //   // 点赞人名解析
    //   var likeUsuer = res.data.likeUsuer;
    //   if (likeUsuer.length == 0) {
    //     res.data.nicknames = "";
    //   } else {
    //     var nicknames = "";
    //     var length = likeUsuer.length;
    //     for (var i = 0; i < length - 1; i++) {
    //       nicknames += likeUsuer[i].nickName + '、';
    //     }
    //     nicknames += likeUsuer[length - 1].nickName;
    //     // console.log('nicknames nicknamesLength', nicknames, nicknames.length);

    //     res.data.nicknames = nicknames;
    //   }
    //   callback(res.data);
    // });
  },

  // ------------------------------钓场事件--------------------
  //获取用户地理位置
  getUserLocation: function () {
    var that = this;
    //定位,获取当前经纬度
    wx.getLocation({
      type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function (res) {
        console.log('获取地理位置成功了', res);
        that.setData({
          isGetLocation: true
        });
      },
      fail: function (res) {
        console.log('获取地理位置失败了', res);
        that.setData({
          isGetLocation: false
        });

        wx.showToast({
          title: '您已拒绝授权,请十分钟后尝试',
          icon: 'loading',
          duration: 2000
        })

        that.data.isFirstTimeReq = false;
      }
    })
  },

  // ---------------------------gcjj02转换到百度地图经纬度方法 (这个方法有待验证)----------------------------//
  gcj2bd: function (lat, lon) {

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
  },


  //发布图片
  releasePicsClick: function () {

    var that = this;

    if (app.user) {
      console.log("发布图片");
      wx.navigateTo({
        url: '/pages/activity/activityRelease/activityRelease?actId=' + this.data.actId
      })
    } else {//没登录的处理
      console.log("没登录，发毛啊");
      this.loginMethod(function (res) {
        // console.log(res);
        if (res == 1) {
          wx.navigateTo({
            url: '/pages/activity/activityRelease/activityRelease?actId=' + this.data.actId
          })
        }
      });
    }


  },
  //点击查看内容
  seePicsTapMethod: function () {
    var that = this;
    console.log("查看内容");
    // 加载已发布内容
    this.loadReleasedData(this.data.actId, function (releasedData) {
      // console.log('加载已发布内容', releasedData);

      that.setData({
        releasedData: releasedData
      });

      // 状态(0 审核中，1 通过，2 审核不通过)
      if (releasedData.status == 0) {
        that.seePicsTapChecking();
      } else if (releasedData.status == 1) {
        that.seePicsTapCheckSuccess();
      } else {
        that.seePicsTapCheckFail();
      }
    })
  },
  //审核通过 查看内容
  seePicsTapCheckSuccess: function () {
    console.log("审核通过 查看内容");
    wx.navigateTo({
      url: '/pages/activity/activitySee/activitySee?actId=' + this.data.actId
    })
  },
  //审核中 查看内容
  seePicsTapChecking: function () {
    // console.log("审核中 查看内容 转码前数据", this.data.releasedData);
    wx.navigateTo({
      url: '/pages/activity/activitySee/checking/checking?releasedDataJsonStr=' + JSON.stringify(this.data.releasedData)
    })
  },
  //审核失败 查看内容
  seePicsTapCheckFail: function () {
    console.log("审核失败 查看内容");
    wx.navigateTo({
      url: '/pages/activity/activitySee/checkFail/checkFail?releasedDataJsonStr=' + JSON.stringify(this.data.releasedData)
    })
  },
  // 登录方法
  loginMethod: function (callback) {
    var that = this;

    //判断之前是否绑定了手机号码了
    //回调函数中返回的参数:
    //0:代表请求失败或者用户拒绝授权
    //1:代表之前已经已经绑定了手机号码了,此时回调的时候,app的user对象已经有值了,同时也已经缓存到本地数据了
    //2:代表用户之前未绑定手机号码,需要跳转到绑定界面
    VF.checkUserBindPhoneNumber(function (result) {
      callback(result);
      //如果之前未绑定手机号码的,直接跳入到绑定界面了 或者提示错误信息了
    });
  },
  //点赞事件
  zanMethod: function (e) {

    wx.showToast({
      title: '点赞中...',
      icon: 'loading',
      duration: 1000,
      mask: true
    })

    var that = this;
    var obj = e.currentTarget.dataset.obj;
    var arr = this.data.picsList;


    for (var i = 0; i < arr.length; i++) {
      var item = arr[i];
      if (item.uid == obj.uid) {

        var url = app.basicURL + 'marketing/likeUser';
        var para = {
          "likeUid": app.user.id,
          "marketUid": obj.uid,
          "marketingId": obj.marketingId
        };
        console.log('点赞事件para', para);
        hp.request('POST', url, para, function (res) {
          console.log('点赞事件', res);
          // 点赞成功，刷新列表
          if (res.status == 0) {
            that.loadPicsData(that.data.actId, function (picsList) {
              that.setData({
                picsList: picsList
              });
            })
          }
        })
      }
    }


    // for (var i = 0; i < arr.length; i++) {
    //   var item = arr[i];
    //   if (item.uid == obj.uid) {

    //     var url = app.basicV2Url + 'marketing/likeUser';
    //     var para = {
    //       "likeUid": app.user.id,
    //       "marketUid": obj.uid,
    //       "marketingId": obj.marketingId
    //     };
    //     console.log('点赞事件para', para);
    //     hp.ctoRequest('POST', url, para, function (res) {
    //       console.log('点赞事件', res);
    //       // 点赞成功，刷新列表
    //       if (res.status == 0) {
    //         that.loadPicsData(that.data.actId, function (picsList) {
    //           that.setData({
    //             picsList: picsList
    //           });
    //         })
    //       }
    //     })

    //   }
    // }



  },
  //更多点击事件
  showMoreNicknames: function (e) {
    var obj = e.currentTarget.dataset.obj;
    // console.log('obj', obj);
    var arr = this.data.picsList;
    // console.log('arr', arr);
    for (var i = 0; i < arr.length; i++) {
      var item = arr[i];
      if (item.uid == obj.uid) {
        item.isMore = true;
      }
    }

    // 重新赋值
    this.setData({
      picsList: arr
    });
    console.log('更多点击事件');
  },
  //收起点击事件
  showLessNicknames: function (e) {
    var obj = e.currentTarget.dataset.obj;
    // console.log('obj', obj);
    var arr = this.data.picsList;
    // console.log('arr', arr);
    for (var i = 0; i < arr.length; i++) {
      var item = arr[i];
      if (item.uid == obj.uid) {
        item.isMore = false;
      }
    }

    // 重新赋值
    this.setData({
      picsList: arr
    });
    console.log('收起点击事件');
  },
  // 活动详情界面
  pushToDetail: function () {
    console.log('活动详情界面');
    wx.navigateTo({
      url: '/pages/activity/activitySale/activitySaleDetail/activitySaleDetail?JsonStr=' + JSON.stringify(this.data.info)
    })
  },
  // 帮他点赞界面 点击cell事件
  pushToZan: function (e) {
    console.log('帮他点赞界面', e.currentTarget.dataset.obj);
    var json = e.currentTarget.dataset.obj;
    // 我的内容界面
    // if (json.uid == app.user.id) {
    //   wx.navigateTo({
    //     url: '/pages/activity/activitySee/activitySee?actId=' + this.data.actId
    //   })
    // } else {//帮他点赞界面
    wx.navigateTo({
      url: '/pages/activity/activitySale/activitySaleZan/activitySaleZan?JsonStr=' + JSON.stringify(json)
    })
    // }


  },


  // 切换按钮事件
  activityTap: function (e) {
    console.log('activityTap', e);
    this.setData({
      openType: 1
    })
    this.actMethod();
    console.log('openType', this.data.openType);
  },

  saleTap: function (e) {
    console.log('saleTap', e);

    this.setData({
      openType: 0,
      isLoadMore: false,
      isLoadAllData: false,
      listPage: 1,
      loadMoreState: "点击或上拉可加载更多"
    })
    console.log('openType', this.data.openType);
  },
  releaseViewTouchMove: function (e) {

    var windowWidth = app.sysInfo.windowWidth
    var windowHeight = app.sysInfo.windowHeight

    // 拖动视图尺寸
    let viewW = 44
    let viewH = 100
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

})