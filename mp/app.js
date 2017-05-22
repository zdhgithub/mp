//app.js
App({
  onLaunch: function () {
    // wx.clearStorage();
    try {
      this.user = wx.getStorageSync('user');

      this.sysInfo = wx.getSystemInfoSync();

    } catch (e) {
      wx.showToast({
        title: '从文件中取出用户数据失败',
        icon: 'loading'
      })
    }
  },
  // 自定义的全局属性
  //获取系统属性
  sysInfo: null,
  //用户对象
  // user:null,
  //用户地理位置
  location: null,

  //点赞上传图片
  uploadBucket: 'disc.res',
  dlHost: 'https://disc.res.heipiaola.com',



  //注意点:以后切换环境时,只要在这里修改就好了.还需要注意,下面的OSS对象是生产环境的还是测试环境的



  //---------------------------------测试环境主机地址和OSS地址--------------------------------//

  //外网测试
  basicURL: "https://api.heipiaola.cn/v1/",
  //内网测试



  // basicURL: "http://192.168.1.220:8081/v1/",
  OSS: {
    //1.钓场和渔具店主图/图片/视频
    fs_profileBucketName: 'zt-fs-profile',
    fs_profile_UpLoad_HostURL: 'https://oss-cn-shenzhen.aliyuncs.com',
    fs_profile_DownLoad_HostURL: 'https://zt-fs-profile.oss-cn-shenzhen.aliyuncs.com',

    //2.钓场动态(放鱼/渔获/攻略)和渔具店(文章)
    fs_dynamicBucketName: 'zt-fs-dynamic',
    fs_dynamic_UpLoad_HostURL: 'https://oss-cn-shenzhen.aliyuncs.com',
    fs_dynamic_DownLoad_HostURL: 'https://zt-fs-dynamic.oss-cn-shenzhen.aliyuncs.com',

    //3.用户头像
    user_portraitBucketName: 'zt-user-portrait',
    user_portrait_UpLoad_HostURL: 'https://oss-cn-shenzhen.aliyuncs.com',
    user_portrait_DownLoad_HostURL: 'https://zt-user-portrait.oss-cn-shenzhen.aliyuncs.com',

    //4.钓场商品主图
    fs_goodsBucketName: 'zt-fs-goods',
    fs_goods_UpLoad_HostURL: 'https://oss-cn-shenzhen.aliyuncs.com',
    fs_goods_DownLoad_HostURL: 'https://zt-fs-goods.oss-cn-shenzhen.aliyuncs.com',

    //5.合伙人资料库(B端可能用不到)
    fs_discoveryBucketName: 'zt-app-discovery',
    fs_discovery_UpLoad_HostURL: 'https://oss-cn-shenzhen.aliyuncs.com',
    fs_discovery_DownLoad_HostURL: 'https://zt-app-discovery.oss-cn-shenzhen.aliyuncs.com',
  },




  //---------------------------------生产环境主机地址和OSS地址---------------------------------//
  // 生产环境



  // basicURL:"https://api.heipiaola.com/v1/",
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