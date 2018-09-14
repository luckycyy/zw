// pages/inventory/inventory.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedRecordId: 0,
    items: [],
    modelShow: false,
    name: "",
    station: "",
    num: 0,
    selectedProductId: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */

  onShow: function () {
    var that = this
   
    //todo 可以增加查询参数 query: "creator:" + wx.getStorageSync("username")
    wx.request({
      url: app.globalData.serverUrl + '/v1/inventory',
      data: {
        limit: -1,
      },
      success: function (res) {
        console.log("inventory:", res)
        if (res == "") {
          console.log("res is empty")
        }
        that.setData({
          items: res
        })

      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  addProduct: function (e) {
    this.setData({
      modelShow: true
    });
  },
  add: function (e) {
    var that = this
    console.log("tianjia")
    wx.request({
      url: app.globalData.serverUrl + '/v1/inventory',
      header: {
        "Content-Type": "application/json;charset=utf-8"
      },
      method: "POST",
      data: {
        ProductName: that.data.name,
        Station: that.data.station,
        "Num": that.data.num
      },
      //this.data.role[e.detail.value.role]
      success: function (res) {
        if (res.statusCode == '201') {
          wx.showToast({
            title: "添加库存成功",
            icon: 'success',
            duration: 2500
          })
          //wx.setStorageSync('role', 100)//设置角色待审批
        } else {
          wx.showToast({
            title: "添加失败",
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

  },
  back: function (e) {
    var that = this
    this.setData({
      modelShow: false
    });
    wx.request({
      url: app.globalData.serverUrl + '/v1/inventory',
      data: {
        limit: -1,
      },
      success: function (res) {
        console.log("inventory:", res)
        if (res == "") {
          console.log("res is empty")
        }
        that.setData({
          items: res
        })

      }
    })
  },
  nameInput: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  numInput: function (e) {
    this.setData({
      num: e.detail.value
    })
  },
  stationInput: function (e) {
    this.setData({
      station: e.detail.value
    })
  }, 
  clickModify: function(e) {
    let id = e.target.dataset.id;
    console.log("index:" + id)
    this.selectedProductId = this.data.items.data[id].Id
    console.log("selectedProductId:" + this.selectedProductId)
    //产品id已选出put修改
  },
})