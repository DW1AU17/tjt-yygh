const axios = require('../../utils/utils.js')
const regeneratorRuntime = require('../../utils/regenerator-runtime/runtime.js')
Page({
  data: {
    doctorList: [],
    depList: [],
    currentNum: 5
  },
  // 医生列表
  doctorShow(e) {
    let deptId = e.currentTarget.dataset.deptid
    this.getDoctorList(deptId)
    this.setData({
      currentNum: deptId
    })
  },
  // 医生号院页面
  toDoctorNumList(e) {
    let docId = e.currentTarget.dataset.docid
    let docName = e.currentTarget.dataset.docname
    let sffSummary = e.currentTarget.dataset.sffsummary
    wx.setStorageSync('docInfo', { docId, docName, sffSummary, orgCode: '057168' })
    wx.navigateTo({
      url: '/pages/doctorNumList/doctorNumList'
    })
  },
  // 初始化
  onLoad: function(options) {
    this.getDepList()
    this.getDoctorList()
  },
  async getDepList() {
    let res = await axios("getDeptJson")
    this.setData({
      depList: res.data
    })
  },
  async getDoctorList(dept) {
    let data = {
      deptId: dept || 5
    }
    let res = await axios("getDoctorJson", { method: "post",data})
    this.setData({
      doctorList: res.data || []
    })
  }
})