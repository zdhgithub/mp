//app.js


//---------------------------------测试环境主机地址和OSS地址--------------------------------//

//外网测试
var basicURL = "https://api.heipiaola.cn/v1/";
var basicV2Url = "https://api.heipiaola.cn/v2/";

//内网测试 
// var basicURL = "http://192.168.1.220:8081/v1/",
// var basicV2Url = "http://192.168.1.220:8180/",
var OSS = {
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
  fs_discovery_DownLoad_HostURL: 'https://app-discovery.oss-cn-shenzhen.aliyuncs.com',
  // fs_discovery_DownLoad_HostURL: 'https://zt-app-discovery.oss-cn-shenzhen.aliyuncs.com',
};




//---------------------------------生产环境主机地址和OSS地址---------------------------------//

// var basicURL = "https://api.heipiaola.com/v1/";
// var basicV2Url = "https://api.heipiaola.com/v2/";
// var OSS = {
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
// };


App({
  onLaunch: function () {
    try {
      this.user = wx.getStorageSync('user');
      this.sysInfo = wx.getSystemInfoSync();
    } catch (e) {
      // wx.showToast({ title: '从文件中取出用户数据失败', icon: 'loading' })
    }
    // 重写 console.log
    console.log = (function (oriLogFunc) {
      return function (description, a, b, c) {
        // 生产环境
        if (basicURL.indexOf('com') > 0) { } else {
          // 测试环境
          oriLogFunc.call(console, description, a, b, c);
        }
      }
    })(console.log);
  },
  // ======================自定义的全局属性和方法========================
  //获取系统属性
  sysInfo: null,
  //用户对象
  user: null,
  //用户地理位置
  location: null,

  //自定义打印
  log: function (description, a, b, c) {
    try {
      if (basicURL.indexOf('com') > 0) { }
      else {
        console.log(description, a, b, c);
      }
    } catch (exception) {
      return 'Error:the function  log is not exist.';
    }
  },
  basicURL: basicURL,
  basicV2Url: basicV2Url,
  OSS: OSS,
})