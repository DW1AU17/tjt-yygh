const {axios} = require('../../utils/utils.js')
// const regeneratorRuntime = require('../../utils/regenerator-runtime/runtime.js')
Page({
  data: {
    doctorList: [],
    docListShow: true,  //默认不展示 暂无数据
    depName: ''
  },
  // 初始化
  onLoad() {
    this.getDoctorList(this.options.deptId)
  },
  // 医生列表
  async getDoctorList(deptId) {
    let data = { deptId }
    let res = await axios("getDoctorJson", { method: "post", data })
    this.setData({
      doctorList: res.data || [],
      docListShow: res.data ? true : false,
      depName: this.options.depName
    })
  },
  // 医生号源页面
  goDetail(e) {
    this.docItem = this.selectComponent(".docItem");
    // 调用公共组件方法
    this.docItem.toDoctorNumList(e)
  }
})