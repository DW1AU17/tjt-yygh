// component/docItem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 医生号源页面
    toDoctorNumList(e) {
      const { sffId: docId, sffName: docName, sffSummary, sffProfessionalWrapper: sffPW } = e.currentTarget.dataset.item
        wx.setStorageSync('docInfo', { docId, docName, sffSummary, sffPW, orgCode: '057196' })
        wx.navigateTo({
          url: '/pages/doctorNumList/doctorNumList'
        })
    },
    _click() {
      //触发点击回调
      this.triggerEvent("click");
    }
  }
})
