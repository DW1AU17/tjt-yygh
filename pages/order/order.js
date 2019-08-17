const axios = require('../../utils/utils.js')
const regeneratorRuntime = require('../../utils/regenerator-runtime/runtime.js')
Page({
  data: {
    list: []
  },
  // 初始化
  onLoad() {
    this.setData({
      list: wx.getStorageSync('appointment')
    })
  },
  // 取消预约
  cancel(e) {
    let that = this
    let info = e.currentTarget.dataset.info
    let data = {
      orgCode: "057168",
      regId: info.id,
      visitDate: info.visitDate,
      pass: info.password
    }
    let list = this.data.list
    wx.showModal({
      title: '确定要取消预约?',
      async success(res) {
        if (res.confirm) {
          let res = await axios("cancelRegistered", {
            data
          })
          if (res.ret === 0) {
            let data = {
              patCardNum: wx.getStorageSync('userInfo')['patCardNum']
            }
            let msg = await axios("getAllRegistered", {
              data
            })
            that.setData({
              list: msg.data
            })
            wx.showToast({
              title: res.msg,
              icon: 'success',
              duration: 2000
            })
          }

        }
      }
    })
  },
  // 前往科室医生界面
  goDepartment() {
    wx.redirectTo({
      url: '/pages/department/department'
    })
  }
})