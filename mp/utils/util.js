function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}


// ---------------------------gcjj02转换到百度地图经纬度方法 (这个方法有待验证)----------------------------//
// gcj2bd: function (lat, lon) {

//   var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
//   var x = lon, y = lat;
//   var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
//   var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
//   var bd_lon = z * Math.cos(theta) + 0.0065;
//   var bd_lat = z * Math.sin(theta) + 0.006;
//   var result = [];
//   result.push(bd_lat);
//   result.push(bd_lon);

//   return result;
// },

module.exports = {
  formatTime: formatTime
}
