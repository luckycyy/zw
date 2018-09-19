// pages/loadrecord/loadrecord.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedRecordId: 0,
    items: [],
    animationData: "",
    animation: "",
    show: "",
    startDate: "0000-00-00",
    endDate: "0000-00-00",
    describe: "",
    productName: "",
    driver: "",
    station: "",
    modelShow: false,
    title: "",
    m_productName: "",
    m_num: "",
    m_station: "",
    markers: "",
    startLongitude: "",
    startLatitude: "",
    endLongitude: "",
    endLatitude: "",
  },
  startDateChange: function(e) {
    console.log(e.detail.value)
    this.setData({
      startDate: e.detail.value
    })
  },
  endDateChange: function(e) {
    console.log(e.detail.value)
    this.setData({
      endDate: e.detail.value
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    //todo 可以增加查询参数 query: "creator:" + wx.getStorageSync("username")
    wx.request({
      url: app.globalData.serverUrl + '/v1/load_record',
      data: {
        limit: -1,
        sortby: "create_time",
        order: "desc",
      },
      success: function(res) {
        console.log("load_record:", res)
        if (res == "") {
          console.log("res is empty")
        }
        that.setData({
          items: res,
        })

      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  filter: function(e) { //点击筛选事件
    var animation = wx.createAnimation({ //创建动画
      duration: 1000,
      timingFunction: 'ease',
      width: 200,
      height: 800,
      top: 0,
      bottom: 0,
      right: 0,
      backgroundColor: '#fff',
      opcity: 0.5
    })

    this.animation = animation

    animation.translateX(0 + 'vh').step() //动画效果向右滑动100vh

    this.setData({
      animationData: animation.export(),
      show: true
    })
  },
  back: function(e) { //点击筛选事件
    var animation = wx.createAnimation({ //创建动画
      duration: 1000,
      timingFunction: 'ease',
      width: 200,
      height: 800,
      top: 0,
      bottom: 0,
      right: 0,
      backgroundColor: '#fff',
      opcity: 0.5
    })

    this.animation = animation

    animation.translateX(100 + 'vh').step() //动画效果向右滑动100vh

    this.setData({
      animationData: animation.export(),
      show: true
    })
  },
  describeInput: function(e) {
    this.setData({
      describe: e.detail.value
    })
  },
  driverInput: function(e) {
    this.setData({
      driver: e.detail.value
    })
  },
  productNameInput: function(e) {
    this.setData({
      productName: e.detail.value
    })
  },
  stationInput: function(e) {
    this.setData({
      station: e.detail.value
    })
  },
  confirm: function(e) {
    var that = this
    var startDate = this.data.startDate
    var endDate = this.data.endDate
    var station = this.data.station
    var driver = this.data.driver
    var productName = this.data.productName
    var describe = this.data.describe


    wx.request({
      url: app.globalData.serverUrl + '/wxmini/filter_load_record',
      data: {
        startDate: startDate,
        endDate: endDate,
        station: station,
        driver: driver,
        productName: productName,
        describe: describe,
        limit: -1,
      },
      success: function(res) {
        console.log("load_record:", res)
        if (res == "") {
          console.log("res is empty")
        }
        that.setData({
          items: res
        })

      }
    })

  },
  clickModify: function(e) {
    let id = e.target.dataset.id;
    console.log("index:" + id)
    this.selectedRecordId = this.data.items.data[id].Id
    console.log("selectedRecordId:" + this.selectedRecordId)
    var vStartLongitude = ""
    var vStartLatitude = ""
    var vEndLongitude = ""
    var vEndLatitude = ""
    try {
      vStartLongitude = JSON.parse(this.data.items.data[id].Location).longitude //装车经度
      vStartLatitude = JSON.parse(this.data.items.data[id].Location).latitude
      vEndLongitude = JSON.parse(this.data.items.data[id].Location2).longitude //卸车经度
      vEndLatitude = JSON.parse(this.data.items.data[id].Location2).latitude
    } catch (err) {
      console.log(err)
    }
    console.log("StartLongitude:" + vStartLongitude)
    console.log("StartLatitude:" + vStartLatitude)
    console.log("EndLongitude:" + vEndLongitude)
    console.log("EndLatitude:" + vEndLatitude)
    var currentMakers = []
    if (("" != vStartLongitude) && ("" != vStartLatitude)) {
      var startMaker = {
        iconPath: "static/red.png",
        id: 0,
        width: 50,
        height: 50,
        title: "装车位置",
        callout: {
          content: "装车位置",
          fontSize: 14,
          color: "#000",
          padding: 8,
          bgColor: "#CCCCCC",
          borderRadius: 4,
          display: "ALWAYS"
        }
      }
      startMaker.latitude = vStartLatitude
      startMaker.longitude = vStartLongitude
      currentMakers.push(startMaker)
    }
    if (("" != vEndLongitude) && ("" != vEndLatitude)) {
      var endMaker = {
        iconPath: "static/green.png",
        id: 1,
        width: 50,
        height: 50,
        title: "卸车位置",
        callout: {
          content: "卸车位置",
          fontSize: 14,
          color: "#000",
          padding: 8,
          bgColor: "#CCCCCC",
          borderRadius: 4,
          display: "ALWAYS"
        }
      }
      endMaker.latitude = vEndLatitude
      endMaker.longitude = vEndLongitude
      currentMakers.push(endMaker)
    }
    var creator = this.data.items.data[id].Creator
    var datetime = this.data.items.data[id].CreateTime
    datetime = datetime.replace("T", " ")
    datetime = datetime.split("+", 1)[0]
    this.setData({
      modelShow: true,
      title: "装车时间:" + datetime + " 司机:" + creator,
      m_productName: this.data.items.data[id].ProductName,
      m_num: this.data.items.data[id].Num,
      m_station: this.data.items.data[id].Station,
      selectedRecordId: this.data.items.data[id].Id,
      startLongitude: vStartLongitude,
      startLatitude: vStartLatitude,
      markers: currentMakers,
    });
  },

  saveModify: function(e) {
    var that = this
    wx.request({
      url: app.globalData.serverUrl + '/v1/load_record/' + this.data.selectedRecordId,
      header: {
        "Content-Type": "application/json;charset=utf-8"
      },
      method: "PUT",
      data: {
        ProductName: that.data.m_productName,
        Num: that.data.m_num,
        "Station": that.data.m_station,
      },
      //this.data.role[e.detail.value.role]
      success: function(res) {
        if (res.data == 'OK') {
          wx.showToast({
            title: "操作成功",
            icon: 'success',
            duration: 2500
          })
          that.goback()
        } else {
          wx.showToast({
            title: "操作失败",
            icon: 'fail',
            duration: 2500
          })
        }
      },
      fail: function() {
        wx.showToast({
          title: '服务器网络错误!',
          icon: 'loading',
          duration: 2500
        })

      }
    })


  },
  m_productNameInput: function(e) {
    this.setData({
      m_productName: e.detail.value
    })
  },
  m_numInput: function(e) {
    this.setData({
      m_num: e.detail.value
    })
  },
  m_stationInput: function(e) {
    this.setData({
      m_station: e.detail.value
    })
  },
  modalBack: function(e) {
    this.goback()
  },
  goback: function() {
    var that = this
    this.setData({
      modelShow: false,
      startLongitude: "",
      startLatitude: "",
      endLongitude: "",
      endLatitude: "",
    });
    wx.request({
      url: app.globalData.serverUrl + '/v1/load_record',
      data: {
        limit: -1,
        sortby: "create_time",
        order: "desc",
      },
      success: function(res) {
        console.log("load_record:", res)
        if (res == "") {
          console.log("res is empty")
        }
        that.setData({
          items: res
        })

      }
    })
  },

})