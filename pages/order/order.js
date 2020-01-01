const { axios, isHistory } = require('../../utils/utils.js')
// const regeneratorRuntime = require('../../utils/regenerator-runtime/runtime.js')
Page({
  data: {
    list: [],
    historyList: [],    // 历史挂号记录
    noneDate: false      // 是否都没有信息 
  },
  // 初始化
  async onLoad() {
    let data = wx.getStorageSync('already')  // 患者信息存到缓存
    if (!data) return 
    let msg = await axios("getAllRegistered", { data }) // 调ajax
    if (msg.data.length === 0) {
      return this.setData({ noneDate: true })
    }
    let list = msg.data.filter(item => !isHistory(item.visitDate))
    list.map(item => item.isHistory = false)
    let historyList = msg.data.filter(item => isHistory(item.visitDate))
    historyList.map(item => item.isHistory = true)
    this.setData({
      list,
      historyList
    })
  },
  // 前往科室医生界面
  goDepartment() {
    wx.redirectTo({
      url: '/pages/department/department'
    })
  },
  // 取消预约
  cancel(e) {
    let that = this
    let info = e.currentTarget.dataset.info
    let data = {
      orgCode: "057168",
      regId: info.appId,
      visitDate: info.visitDate,
      pass: info.password
    }
    wx.showModal({
      title: '确定要取消预约?',
      async success(res) {
        if (res.confirm) {
          let res = await axios("cancelRegistered", { data })
          if (res.ret === 0) {
            let data = {
              patCardNum: wx.getStorageSync('userInfo')['patCardNum']
            }
            let msg = await axios("getAllRegistered", {
              data
            })
            let list = msg.data.filter(item => !isHistory(item.visitDate))
            list.map(item => item.isHistory = false)   // 添加属性
            that.setData({ list })
            wx.showToast({
              title: res.msg,
              icon: 'success',
              duration: 2000
            })
          }

        }
      }
    })
  }
})