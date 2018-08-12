// pages/truckload/truckload.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index:0,
    productIndex: 0,
    stations: [],
    products: []
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  bindPicker2Change: function (e) {
    console.log('picker2发送选择改变，携带值为', e.detail.value)
    this.setData({
      productIndex: e.detail.value
    })
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)

    var warn = "";//弹框时提示的内容
    var pass = false;//判断信息输入是否完整
    console.log('station:' + e.detail.value.station)
    if (e.detail.value.station == 0) {
      warn = "请选择站点！";
    } else if (e.detail.value.productName == 0) {
      warn = "请选择产品名称！";
    } else if (e.detail.value.num == "") {
      warn = "请填写数量！";
    } else {
      pass = true;
    }
    if (!pass) {
      wx.showModal({
        title: '提示',
        content: warn
      })
    } else {

      
      console.log('写入数据库')
      var l_obj = wx.getStorageSync("location")
      var l_str = JSON.stringify(l_obj)
      console.log('l_str', l_str)
      wx.request({

        url: app.globalData.serverUrl + '/wxmini/load',

        header: {

          "Content-Type": "application/x-www-form-urlencoded"

        },

        method: "POST",

        data: { Station: this.data.stations[e.detail.value.station], ProductName: this.data.products[e.detail.value.productName], Num: e.detail.value.num, Creator: wx.getStorageSync("username"), Location: l_str},

        success: function (res) {

          if (res.data.Code == 1) {

            wx.showModal({
              title: '成功',
              showCancel : false ,
              confirmText: "返回首页",
              content: '数据已保存',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  wx.navigateBack()
                } 
              }
            })
            
          } else {
            wx.showToast({

              title: "提交失败",

              icon: 'fail',

              duration: 2500

            })

          }

        },

        fail: function () {

          wx.showToast({

            title: '服务器网络错误!',

            icon: 'loading',

            duration: 2500

          })

        }

      })

      

    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
   var that = this
    that.setData({
      stations: wx.getStorageSync("stationPicker"),
      products: wx.getStorageSync("productPicker")
    })
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

  }
})