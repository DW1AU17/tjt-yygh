const { axios } = require('../../utils/utils.js')
// const regeneratorRuntime = require('../../utils/regenerator-runtime/runtime.js')
Page({
  data: {
    doctorList: [],
    depList: [],
    currentNum: 6,
    docListShow: true,
    isModalShow: false,    // 控制搜索页的展示
    searchValue: '',      // 搜索的值
    searchDocList: [],    // 模态层中医生列表
    searchDepList: [],     // ......科室列表
    noneData: false     // 都无数据
  },
  // 初始化
  onLoad() {
    this.getDepList()
    this.getDoctorList()
  },
  // 科室列表
  async getDepList() {
    let res = await axios("getDeptJson")
    this.setData({
      depList: res.data
    })
  },
  // 医生列表
  async getDoctorList(dept) {
    let data = {
      deptId: dept || 6
    }
    let res = await axios("getDoctorJson", { method: "post", data })
    this.setData({
      doctorList: res.data || [],
      docListShow: res.data ? true : false
    })
    wx.hideLoading()
  },
  // 医生列表
  doctorShow(e) {
    wx.showLoading({ title: '加载中' })
    let deptId = e.currentTarget.dataset.deptid
    this.getDoctorList(deptId)
    this.setData({
      currentNum: deptId
    })
  },
  // 医生号源页面
  goDetail(e) {
    this.docItem = this.selectComponent(".docItem");
    // 调用公共组件方法
    this.docItem.toDoctorNumList(e)
  },
  // 展开搜索模态层 / 关闭模态框
  searchModalShow() {
    this.setData({
      isModalShow: !this.data.isModalShow
    })
  },
  // 搜索回车
  async enterConfirm() {
    let { searchValue } = this.data
    if ( !searchValue ) return
    let data = { docName: searchValue, orgCode: '057196'}
    let res = await axios("searchInfo", { method: "post", data})
    if (res.ret === 1) {
      this.setData({
        searchDocList: [],
        searchDepList: [],
        noneData: true
      })
    } else {
      let searchDocList = res.data.filter(item => item.type === "1")
      let searchDepList = res.data.filter(item => item.type === "2")
      this.setData({
        searchDocList,
        searchDepList,
        noneData: false
      })
    }
  },
  // 保存搜索值
  setValue(e) {
    clearTimeout(this.timerId)
    this.timerId = setTimeout(() => {
      this.setData({
        searchValue: e.detail.value
      })
    }, 500)
  },
  // 医生列表页面
  docListPage(e) {
    const { deptid: deptId, depname: depName } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/doctorList/doctorList?deptId=${deptId}&depName=${depName}`
    })
  },
  // 清空搜索框
  clearSearchInput() {
    this.setData({
      searchValue: ''
    })
  }
})