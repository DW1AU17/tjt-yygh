const app = getApp()
const { axios } = require('../../utils/utils.js')
// const regeneratorRuntime = require('../../utils/regenerator-runtime/runtime.js')
Page({
  data: {
    outpatient: "",
    idCard: "",
    telephoneNumber: "0571-56095619",
    readRequired: false,
    checked: false
  },
  onLoad() {
    // 启动参数
    let res = wx.getLaunchOptionsSync()
    if (Object.keys(res.query).length !== 0) {
      let { outpatient, idCard } = res.query
      return this.setData({
        outpatient,
        idCard
      })
    }
    // 获取本地
    let ptInfo = wx.getStorageSync('userInfo')
    if (!ptInfo) return
    this.setData({
      outpatient: ptInfo.patCardNum,
      idCard: ptInfo.patCertifiNum
    })
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
      let data = { patCardNum: numb, idCard }
      wx.setStorageSync('already', data) // 已预约的参数
      let res = await axios("checkPatId", { data }) // 调ajax
      if (res.ret === 0) {
        wx.setStorageSync('userInfo', res.data)  // 患者信息存到缓存
        let msg = await axios("getAllRegistered", { data }) // 调ajax
        if (msg.ret === 0) {
          wx.redirectTo({
            url: '/pages/order/order'
          })
        } else {
          wx.redirectTo({
            url: '/pages/department/department'
          })
        }
      } else {
        wx.showToast({
          title: '找不到该病人信息或者输入信息有误!',
          icon: 'none',
          duration: 2000
        })
      }
    }
  },
  // 拨打电话
  callPhone() {
    wx.makePhoneCall({
      phoneNumber: this.data.telephoneNumber //仅为示例，并非真实的电话号码
    })
  },
  // 关闭预约须知
  closeRead() {

    if (!this.data.checked) {
      return wx.showToast({
        title: '请阅读并勾选',
        image: '../../assets/error.png',
        duration: 2000
      　　　});

    }
    this.setData({
      readRequired: true
    })
  },
  // 是否选中
  changeCheck() {
    this.setData({
      checked: !this.data.checked
    })
  }
})