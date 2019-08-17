const axios = require('../../utils/utils.js')
const regeneratorRuntime = require('../../utils/regenerator-runtime/runtime.js')
Page({
  data: {
    list: [], // 排班
    surceOfNo: [], // 号源
    doctorInfo: "",
    isModalShow: true,
    threeText: true,
    numFlag: false
  },
  // 初始化
  async onLoad() {
    let data = wx.getStorageSync('docInfo');
    this.setData({
      doctorInfo: data
    })
    let res = await axios("getSchedulingJson",{data})
    this.setData({
      list: res.data || []
    })
  },
  // 展示医生详情
  showDetail() {
    this.setData({
      threeText: !this.data.threeText
    })
  },
  // 确定按钮
  toConfirm() {
    this.setData({
      isModalShow: true,
      numFlag: true
    })
    let content = "";
    wx.showModal({
      title: '请仔细核对信息!',
      content,
      success(res) {
        if (res.confirm) {
          wx.showToast({
            title: "操作成功",
            icon: 'success',
            duration: 2000
          });
          setTimeout(() => {
            wx.navigateTo({url: '/pages/order/order'})
          }, 1000)
        } 
      }
    })
  },
  // 模态框打开
  MadolTaggle(){
    this.setData({
      isModalShow: !this.data.isModalShow
    })
  }, 
  // 号源列表
  async chooseNum(e) {
    let data= {
      schId: e.currentTarget.dataset.schid,
      ampm: e.currentTarget.dataset.ampm,
      orgCode: e.currentTarget.dataset.orgcode,
    }
    this.setData({
      isModalShow: !this.data.isModalShow
    })
    let res = await axios("getSchedulingSourceJson",{data})
    this.setData({
      surceOfNo: res.data || []
    })
  }
   
})
