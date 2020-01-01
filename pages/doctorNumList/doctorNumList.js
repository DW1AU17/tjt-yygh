const { axios, dealDate, getWhatDay} = require('../../utils/utils.js')
// const regeneratorRuntime = require('../../utils/regenerator-runtime/runtime.js')
Page({
  data: {
    list: [], // 排班
    surceOfNo: [], // 号源
    doctorInfo: "",
    isModalShow: true,
    threeText: true,
    numFlag: false,
    schId: "",
    orgCode: "",
    ampm: "",
    visitDate: "",
    schedulingList: true, // 排班列表
    numbList: true   // 号源列表
  },
  // 初始化
  async onLoad() {
    wx.showLoading({ title: '加载中' })
    let data = wx.getStorageSync('docInfo');
    let res = await axios("getSchedulingJson",{data})
    if (res.ret !== 1) {
      res.data.map(item => { 
        item.week = getWhatDay(dealDate(item.schdate))  // 得到周几
        item.schdate = dealDate(item.schdate)    // 格式化日期
        return item
      })
      this.setData({
        doctorInfo: data,
        list: res.data,
        schedulingList: true
      })
    } else {
      this.setData({
        doctorInfo: data,
        schedulingList: false
      })
    }
    wx.hideLoading()
  },
  // 展示医生详情
  showDetail() {
    this.setData({
      threeText: !this.data.threeText
    })
  },
  // 确定按钮
  toConfirm(e) {
    let that = this
    let numDetail = e.currentTarget.dataset.info
    let content = ` ${numDetail.doctorName} ( ${numDetail.schedulingDate} / ${numDetail.visitTime} )`
    this.setData({
      isModalShow: true,
      numFlag: true,
      visitDate: numDetail.schedulingDate
    })
    wx.showModal({
      title: '请仔细核对信息!',
      content,
      async success(res) {
        if (res.confirm) {
          let data = {
            regId: numDetail.id,
            schId: that.data.schId,
            ampm: that.data.ampm,
            orgCode: that.data.orgCode,
            numId: numDetail.id,
            patId: wx.getStorageSync("userInfo").id,
            visitDate: that.data.visitDate
          }
          let msg = await axios("registered",{ data })
          if (msg.ret == 1) {
            wx.showToast({
              title: msg.msg,
              icon: 'none',
              duration: 2000
            });
          } else {
            wx.showToast({
              title: "操作成功",
              icon: 'success',
              duration: 2000
            });
            setTimeout(() => {
              wx.navigateTo({ url: '/pages/order/order' })
            }, 1000)
          }
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
    wx.showLoading({ title: '加载中' })
    const { schid, ampm, orgcode} = e.currentTarget.dataset
    let data= {
      schId: schid,
      ampm: ampm,
      orgCode: orgcode
    }
    this.setData({
      isModalShow: !this.data.isModalShow,
      ...data
    })
    let res = await axios("getSchedulingSourceJson",{ data })
    wx.hideLoading()
    this.setData({
      surceOfNo: res.data || [],
      numbList: res.data ? true : false
    })
  },
  // 选择医生
  chooseDoc() {
    wx.navigateTo({
      url: '/pages/order/order'
    })
  }
   
})
