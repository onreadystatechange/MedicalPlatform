// 根据时间戳格式化时间为**分钟前，**天前这种格式
function getFormattedTime(timestamp) {
  let curTime = Date.parse(new Date()) / 1000;
  let delta = curTime - timestamp;
  const hour = 60 * 60;
  const day = 24 * hour;
  const month = 30 * day;
  const year = 12 * month;
  if (delta < hour) {
    // 显示多少分钟前
    let n = parseInt(delta / 60);
    if (n == 0) {
      return "刚刚";
    }
    return n + '分钟前';
  } else if (delta >= hour && delta < day) {
    return parseInt(delta / hour) + '小时前';
  } else if (delta >= day && delta < month) {
    return parseInt(delta / day) + '天前';
  } else if (delta >= month && delta < year) {
    return parseInt(delta / month) + '个月前';
  }
}

function format(date, fmt) {
  var o = {
    "M+": date.getMonth() + 1,                 //月份
    "d+": date.getDate(),                    //日
    "h+": date.getHours(),                   //小时
    "m+": date.getMinutes(),                 //分
    "s+": date.getSeconds(),                 //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    "S": date.getMilliseconds()             //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}

function formatChatTime(timestamp) {
  return format(new Date(timestamp * 1000), 'MM月dd日 hh:mm');
}

function formatMessageTime(timestamp) {
    return format(new Date(timestamp * 1000), 'hh:mm');
}

function currentTime() {
  return Date.parse(new Date()) / 1000 + '';
}

//将时间戳转换为年-月-日格式
function formatTime(timestamp){
    var date = new Date(timestamp);
    Y = date.getFullYear() + '/';
    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '/';
    D = date.getDate();
    return Y+M+D
}

function formattimeStamp(timestamp) {
    var currentTime = Math.round((new Date()).valueOf());
    var nowTime = new Date(currentTime);
    var provideTime = Number(timestamp)*1000;
    var provideDate = new Date(provideTime);
    // 当前时间转换
    var nowY = nowTime.getFullYear();
    var nowM = nowTime.getMonth() + 1;
    var nowD = nowTime.getDate();
    //获取时间转换
    var proY = provideDate.getFullYear();
    var proM = provideDate.getMonth() + 1;
    var proD = provideDate.getDate();

    // 转换时间样式
    var Y = provideDate.getFullYear() + '-';
    var M = (provideDate.getMonth() + 1 < 10 ? '0' + (provideDate.getMonth() + 1) : provideDate.getMonth() + 1) + '-';
    var D = (provideDate.getDate() < 10 ? '0' + provideDate.getDate() : provideDate.getDate()) + ' ';
    var h = (provideDate.getHours() < 10 ? '0' + provideDate.getHours() : provideDate.getHours()) + ':';
    var m = provideDate.getMinutes() < 10 ? '0' + provideDate.getMinutes() : provideDate.getMinutes();
    var weekend = provideDate.getDay();
    switch (weekend){
        case 1 :
            weekend = "星期一";
            break;
        case 2 :
            weekend = "星期二";
            break;
        case 3 :
            weekend = "星期三";
            break;
        case 4 :
            weekend = "星期四";
            break;
        case 5 :
            weekend = "星期五";
            break;
        case 6 :
            weekend = "星期六";
            break;
        case 0 :
            weekend = "星期日";
            break;
    }
    var time;
    if(currentTime >= provideTime){
        if(nowY <= proY){
            if(nowM <= proM){
                if(nowD <= proD){
                    time = h + m;
                }else if(nowD - proD >= 1 && nowD - proD < 2){
                    time = "昨天 " + h + m;
                }else if(nowD - proD >= 2 && nowD - proD < 7){
                    time = weekend + " " + h + m;
                }else {
                    time = M + D + h + m;
                }
            }else {
                time = M + D + h + m;
            }
        }else {
            time = Y + M + D + h + m;
        }
    }else {
        time = h + m;
    }
    return time;
}

module.exports = {
  getFormattedTime: getFormattedTime,
  formatChatTime: formatChatTime,
  currentTime: currentTime,
  formatTime:formatTime,
  formatMessageTime:formatMessageTime,
    formattimeStamp:formattimeStamp
}
