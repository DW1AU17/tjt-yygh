// 三种情况
/**
 * 1. 地址
 * 2. 地址，对象
 * 3. 对象
 * */

let a = 0;
// 定时器 (控制频繁操作)
let timer;
let duration = 180000;
function interval(time = 10000 ) {
  timer = setInterval(() => {
    a = 0
    if (time === duration) {
      clearInterval(timer)
      interval(10000)
    }
  }, time)
}

// 导出方法
function axios(url, options = {}) {
  (a === 0) && interval()
  a++
  if (a > 30) {
    clearInterval(timer)
    interval(duration)
    return wx.showToast({ title: `操作频繁,请3分钟后再试`, icon: 'none', duration, mask:true })
  }
  
  // 公共路径部分
  // const BASE_URl = 'https://ezhenmai.com:7011/app/register/';
  const BASE_URl = 'http://192.168.1.43:8085/app/register/';
  let method = "get";
  let arr = Object.keys(options)
  if (typeof url === "string") {
    options.url = url
  }
  if (typeof url === "object") {
    options = url
    method = "post"
  }
  if (arr.length > 0) {
    method = "post"
  }
  // 返回一个小程序的请求方式  （wx.request）
  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE_URl + options.url,
      method,
      data: options.data || {},
      success(res) {
        resolve(res.data)
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

// 日期格式化
function dealDate(a) {
  return a.substr(0, 4) + "-" + a.substr(4, 2) + "-" + a.substr(6, 2)
}

// 获取星期几
function getWhatDay(date) {
  date = new Date(date)
  let week;
  if (date.getDay() == 0) week = "周日";
  if (date.getDay() == 1) week = "周一";
  if (date.getDay() == 2) week = "周二";
  if (date.getDay() == 3) week = "周三";
  if (date.getDay() == 4) week = "周四";
  if (date.getDay() == 5) week = "周五";
  if (date.getDay() == 6) week = "周六";
  return week
}

// 日期比较, 判断是否为之前的数据
function isHistory(compareDate) {
  let now = new Date()
  let currentDate = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() // 当前日期
  let currentDayTimestamp = new Date(`${currentDate} 00:00:00`).getTime() // 当日时间戳
  let compareTimestamp = new Date(compareDate).getTime() // 比较日期的时间戳
  // 历史数据 返回true 
  if (compareTimestamp < currentDayTimestamp) return true
  return false
}

module.exports = {
  axios,
  dealDate,
  getWhatDay,
  isHistory
}