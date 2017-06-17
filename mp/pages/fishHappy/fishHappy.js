var hp = require('../../utils/HPUtils.js');
var VF = require('../verify/verifyNum/verify.js');
var ajax = require('../../utils/ajax.js');

var app = getApp();
Page({
  data: {
    // 悬浮视图初始位置
    left: app.sysInfo.windowWidth - 54,
    top: 240,

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


    app.log('app.log_openType', this.data.openType);


    var employees = []
    employees[0] = { name: "George", age: 32, retiredate: "March 12, 2014" }
    employees[1] = { name: "Edward", age: 18, retiredate: "June 2, 2023" }
    employees[2] = { name: "Christine", age: 18, retiredate: "December 20, 2036" }
    employees[3] = { name: "Sarah", age: 62, retiredate: "April 30, 2020" }

    app.log('app.log_employees', employees);
    // employees.sort(function (v1, v2) {
    //   // 如果年龄相同，则按姓名排序
    //   if (v1.age === v2.age) {
    //     return v1.name > v2.name ? 1 : -1;
    //   } else {
    //     return v1.age > v2.age ? 1 : -1;
    //   }
    // })
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
  //页面分享按钮
  onShareAppMessage: function () {
    return {
      title: '黑漂钓鱼邀您一起鱼乐！',
      path: '/pages/fishHappy/fishHappy'
    }
  },




  // ****************************************营销活动************************************************

  // 加载营销活动列表
  loadSaleList: function (index, callback) {
    ajax.marketing.getActList(index, function (res) {
      callback(res.body)
    })
  },
  //加载图片列表数据
  loadPicsData: function (mid, callback) {
    var that = this;
    ajax.marketing.getPicsList(mid, function (res) {
      for (var i = 0; i < res.body.length; i++) {
        var obj = res.body[i];

        // 解析图片字符串成数组
        var picStr = obj.picture;
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
      callback(res.body);
    })
  },
  // 判断是否发布 GET /marketing/{uid}/{mid}  1：表示已参加， 0：表示未参加
  judgeRelOrNot: function (uid, mid) {
    var that = this;

    ajax.marketing.isJoinAct(uid, mid, function (res) {
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
    })
  },
  //加载已发布内容GET /marketing/picture/{marketingId}/{uid}
  loadReleasedData: function (mid, callback) {
    var that = this;
    var uid = app.user.id;

    ajax.marketing.getPersonalPics(mid, uid, function (res) {
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
        res.body.nicknames = nicknames;
      }
      callback(res.body);
    })
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

        var para = {
          "likeUid": app.user.id,
          "marketUid": obj.uid,
          "marketingId": obj.marketingId
        };
        console.log('点赞事件para', para);
        ajax.marketing.zan(para, function (res) {
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
  },
  //发布图片
  releasePicsClick: function () {
    wx.navigateTo({
      url: '/pages/activity/activityRelease/activityRelease?actId=' + this.data.actId
    })
  },
  //点击查看内容
  seePicsTapMethod: function () {
    var that = this;
    console.log("查看内容");
    // 加载已发布内容
    this.loadReleasedData(this.data.actId, function (releasedData) {
      that.setData({
        releasedData: releasedData
      })

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

  //更多点击事件
  showMoreNicknames: function (e) {
    var obj = e.currentTarget.dataset.obj;
    var arr = this.data.picsList;
    for (var i = 0; i < arr.length; i++) {
      var item = arr[i];
      if (item.uid == obj.uid) {
        item.isMore = true;
      }
    }
    this.setData({
      picsList: arr
    });
  },
  //收起点击事件
  showLessNicknames: function (e) {
    var obj = e.currentTarget.dataset.obj;
    var arr = this.data.picsList;
    for (var i = 0; i < arr.length; i++) {
      var item = arr[i];
      if (item.uid == obj.uid) {
        item.isMore = false;
      }
    }
    this.setData({
      picsList: arr
    });
  },
  // 营销活动详情界面
  pushToDetail: function () {
    console.log('活动详情界面');
    wx.navigateTo({
      url: '/pages/activity/activitySale/activitySaleDetail/activitySaleDetail?JsonStr=' + JSON.stringify(this.data.info)
    })
  },
  // 营销活动帮他点赞界面 点击cell事件
  pushToZan: function (e) {
    console.log('帮他点赞界面', e.currentTarget.dataset.obj);
    var json = e.currentTarget.dataset.obj;
    var mid = json.marketingId
    var uid = json.uid
    wx.navigateTo({
      url: '/pages/activity/activitySale/activitySaleZan/activitySaleZan?mid=' + mid + '&uid=' + uid
    })
  },

  // ********************************************活动************************************************

  // 活动方法
  actMethod: function () {
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
  //加载活动列表
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
  //进入活动详情页面
  gotoActivityDetail: function (e) {
    var act = e.currentTarget.dataset.act
    var actId = act.id
    var status = act.status

    // 活动结束，直接进入活动回顾
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
  // 显示真实图片比例
  changeImgSize: function (e) {
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

  // 拖动参加活动按钮事件
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