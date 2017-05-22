// pages/fishSite/siteDetail/picsDetail/picsDetail.js
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    console.log(options.pics);

    //分隔成图片数组
    var picArr = options.pics.split(",");

    var newPicsArr = [];

    for(var i = 0; i < picArr.length; i++){
      if(picArr[i].length > 0){
        newPicsArr.push(picArr[i]);
      }
    }
    //将数据保存起来
    this.setData({pics:newPicsArr});
    //console.log(this.data);
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})