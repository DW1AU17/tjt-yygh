// 三种情况
/**
 * 1. 地址
 * 2. 地址，对象
 * 3. 对象
 * */

// 导出方法

function axios(url, options = {}) {
  // 公共路径部分
  const BASE_URl = 'http://127.0.0.1:8848/app/register/';
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

module.exports = axios