//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    // console.log('来到这里了那??');
    try {
      this.user = wx.getStorageSync('user');
      // console.log('来到??');
      // console.log(this);
      this.sysInfo = wx.getSystemInfoSync();
    } catch (e) {
      wx.showToast({
        title: '从文件中取出用户数据失败',
        icon: 'loading'
      })
    }
  },
  // 自定义的全局属性
  sysInfo:null,
  //用户对象
  // user:null,
  //用户地理位置
  location:null,

  //-----------------主机地址-------------------//

  //内网测试
  // basicURL:"http://192.168.1.220:8081/v1/",

  //外网测试
  basicURL:"https://api.heipiaola.cn/v1/",

  // 生产环境
  // basicURL:"https://api.heipiaola.com/v1/",


  //------------------OSS地址-------------------//

  //========测试环境======//
  OSS:{
    //1.钓场和渔具店主图/图片/视频
    fs_profileBucketName:'zt-fs-profile',
    fs_profile_UpLoad_HostURL:'https://oss-cn-shenzhen.aliyuncs.com',
    fs_profile_DownLoad_HostURL:'https://zt-fs-profile.oss-cn-shenzhen.aliyuncs.com',

    //2.钓场动态(放鱼/渔获/攻略)和渔具店(文章)
    fs_dynamicBucketName:'zt-fs-dynamic',
    fs_dynamic_UpLoad_HostURL:'https://oss-cn-shenzhen.aliyuncs.com',
    fs_dynamic_DownLoad_HostURL:'https://zt-fs-dynamic.oss-cn-shenzhen.aliyuncs.com',

    //3.用户头像
    user_portraitBucketName:'zt-user-portrait',
    user_portrait_UpLoad_HostURL:'https://oss-cn-shenzhen.aliyuncs.com',
    user_portrait_DownLoad_HostURL:'https://zt-user-portrait.oss-cn-shenzhen.aliyuncs.com',

    //4.钓场商品主图
    fs_goodsBucketName:'zt-fs-goods',
    fs_goods_UpLoad_HostURL:'https://oss-cn-shenzhen.aliyuncs.com',
    fs_goods_DownLoad_HostURL:'https://zt-fs-goods.oss-cn-shenzhen.aliyuncs.com',

    //5.合伙人资料库(B端可能用不到)
    fs_discoveryBucketName:'zt-app-discovery',
    fs_discovery_UpLoad_HostURL:'https://oss-cn-shenzhen.aliyuncs.com',
    fs_discovery_DownLoad_HostURL:'https://zt-app-discovery.oss-cn-shenzhen.aliyuncs.com',
  },


  //========生产环境======//
  // OSS:{
  //   //1.钓场和渔具店主图/图片/视频
  //   fs_profileBucketName:'fs-profile',
  //   fs_profile_UpLoad_HostURL:'https://oss-cn-shenzhen.aliyuncs.com',
  //   fs_profile_DownLoad_HostURL:'https://fs-profile.oss-cn-shenzhen.aliyuncs.com',

  //   //2.钓场动态(放鱼/渔获/攻略)和渔具店(文章)
  //   fs_dynamicBucketName:'fs-dynamic',
  //   fs_dynamic_UpLoad_HostURL:'https://oss-cn-shenzhen.aliyuncs.com',
  //   fs_dynamic_DownLoad_HostURL:'https://fs-dynamic.oss-cn-shenzhen.aliyuncs.com',

  //   //3.用户头像
  //   user_portraitBucketName:'user-portrait',
  //   user_portrait_UpLoad_HostURL:'https://oss-cn-shenzhen.aliyuncs.com',
  //   user_portrait_DownLoad_HostURL:'https://user-portrait.oss-cn-shenzhen.aliyuncs.com',

  //   //4.钓场商品主图
  //   fs_goodsBucketName:'fs-goods',
  //   fs_goods_UpLoad_HostURL:'https://oss-cn-shenzhen.aliyuncs.com',
  //   fs_goods_DownLoad_HostURL:'https://fs-goods.oss-cn-shenzhen.aliyuncs.com',

  //   //5.合伙人资料库(B端可能用不到)
  //   fs_discoveryBucketName:'app-discovery',
  //   fs_discovery_UpLoad_HostURL:'https://oss-cn-shenzhen.aliyuncs.com',
  //   fs_discovery_DownLoad_HostURL:'https://app-discovery.oss-cn-shenzhen.aliyuncs.com',
  // },



})