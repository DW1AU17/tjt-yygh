//index.js
//获取应用实例
const app = getApp()
const axios = require('../../utils/utils.js')
const regeneratorRuntime = require('../../utils/regenerator-runtime/runtime.js')
Page({
  data: {
    outpatient: "",
    idCard: "",
    telephoneNumber: "0571-56095619"
  },
  // 获取门诊号
  getValue(e) {
    this.setData({
      outpatient: e.detail.value
    })
  },
  getValueId(e) {
    this.setData({
      idCard: e.detail.value
    })
  },
  async toDepartment() {
    let numb = this.data.outpatient
    let idCard = this.data.idCard
    if (!numb || !idCard) {
      return wx.showToast({
        title: '输入项均不能为空!',
        icon: 'none',
        duration: 2000
      })
    } else {
      let data = {patCardNum:numb,idCard}
      let res = await axios("checkPatId", { data }) // 调ajax
      if (res.ret === 1) {
        wx.showToast({
          title: '找不到该病人信息或者输入信息有误!',
          icon: 'none',
          duration: 2000
        })
      } else {
        wx.setStorageSync('userInfo', res.data)  // 患者信息存到缓存
        let msg = await axios("getAllRegistered",{data}) // 调ajax
        if (msg.ret == 0) {
          wx.setStorageSync('appointment', msg.data)
          wx.redirectTo({
            url: '/pages/order/order'
          })
        } else {
          wx.redirectTo({
            url: '/pages/department/department'
          })
        }
      }
    }
  },
  // 拨打电话
  callPhone() {
    wx.makePhoneCall({
      phoneNumber: this.data.telephoneNumber //仅为示例，并非真实的电话号码
    })
  }
})