// pages/paying/shopDiscount/shopDiscount.js
var app = getApp();
Page({
  data: {
    //优惠券数据
    discountList: null
  },
  onLoad: function (options) {
    // 页面初始化
    //保存传过来的优惠券数据
    var discountStr = decodeURIComponent(options.discount);
    var dArr = JSON.parse(discountStr);
    
    //遍历里面的数据 往里面加一个字段 标识过期时间 同时还加上一个选中标识
    for (var i = 0; i < dArr.length; i++) {
      var dis = dArr[i];
      var newDate = new Date(dis.deadline);
      dis.indateStr = newDate.format('yyyy-MM-dd');
      //添加选中标识
      dis.chooseFlag = false;
    }
    this.setData({
      discountList: dArr
    });
    console.log(this.data.discountList);
  },
  //选中一张券的时候调用
  selectedDiscount: function (e) {
    console.log('选中了:');
    console.log(e.currentTarget.dataset.discount);
    var selDiscount = e.currentTarget.dataset.discount;
    //将选中的票赋值给app 让它保存着
    app.selDiscount = selDiscount;

    var disList = this.data.discountList;

    for (var i = 0; i < disList.length; i++) {
      //将之前的标识都置为false
      var discount = this.data.discountList[i];
      discount.chooseFlag = false;
      //判断一下选中的是哪一张券
      if (discount.cid == selDiscount.cid) {
        discount.chooseFlag = true;
      }
    }
    //设置选中标识
    this.setData(this.data);
    //退出界面
    setTimeout(function () {
      wx.navigateBack({
        delta: 1,
      })
    }, 1000);
  }
})