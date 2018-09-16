// pages/truckunload/truckunload.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedRecordId: 0,
    items: [],
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
    wx.request({
      url: app.globalData.serverUrl + '/v1/load_record',
      data: {
        limit: -1,
        query: "creator:" + wx.getStorageSync("username"),
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
  clickUnload: function(e) {
    var that = this
    let id = e.target.dataset.id;
    console.log("index:" + id)
    this.selectedRecordId = this.data.items.data[id].Id
    console.log("selectedRecordId:" + this.selectedRecordId)

    wx.request({
      url: app.globalData.serverUrl + '/wxmini/unload',
      header: {
        "Content-Type": "application/json;charset=utf-8"
      },
      method: "PUT",
      data: {
        Id: this.selectedRecordId,
        IsUnload: 1
      },
      success: function(res) {
        if (res.data.Code == 'OK') {
          wx.showModal({
            title: '成功',
            showCancel: false,
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

    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        wx.setStorageSync('location2', { "latitude": latitude, "longitude": longitude, "speed": speed, "accuracy": accuracy })
        console.log("la:", wx.getStorageSync("location").latitude)
        wx.request({
          url: app.globalData.serverUrl + '/wxmini/unload',
          header: {
            "Content-Type": "application/json;charset=utf-8"
          },
          method: "PUT",
          data: {
            Id: that.selectedRecordId,
            Location2: JSON.stringify(wx.getStorageSync("location2"))
          },
          success: function (res) {
            console.log("卸车地点保存成功")
          },
          
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

  }
})