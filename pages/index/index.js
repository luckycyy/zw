//index.js
//获取应用实例
const app = getApp()

Page({
  // onTabItemTap(item) {
  //   console.log("tab click")

  // },
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    role: 555,
    tab1text: "..",
    tab2text: "..",
    tab3text: "..",
    tabWidth: "49%"
  },

  onLoad: function() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      console.log(this.data.userInfo)
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    var that = this
    setTimeout(function() {
      try {
        var value = wx.getStorageSync("role")
        console.log("role in storage is :" + value)
        if (value == "unregister"){
          that.setData({
            role: value
          })
        }
        if (value == "司机") {
          console.log("is driver")
          var tab1t = "装车"
          var tab2t = "卸车"
          that.setData({
            role: value,
            tab1text: tab1t,
            tab2text: tab2t,
            tabWidth: "49%"
          })
        }
        if (value == "职员") {
          console.log("is staff")
          var tab1t = "库存信息"
          var tab2t = "装卸记录"
          var tab3t = "人员管理"
          that.setData({
            role: value,
            tab1text: tab1t,
            tab2text: tab2t,
            tab3text: tab3t,
            tabWidth: "33%"
          })
        }

      } catch (e) {
        // Do something when catch error
        console.log("getStorge err", e)
      }


    }, 2000)



  },

  onShow: function() {
    console.log("onshow")
    this.onLoad()
  },

  register: function() {
    wx.navigateTo({
      url: '/pages/register/register'
    })
  },

  refreshRole: function() {},

  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  tab1click: function(e) {
    console.log("tab1click")
    if (wx.getStorageSync("role") == "司机") {
      wx.navigateTo({
        url: '/pages/truckload/truckload'
      })
    }
    if (wx.getStorageSync("role") == "职员") {
      wx.navigateTo({
        url: '/pages/inventory/inventory'
      })
    }

  },
  tab2click: function(e) {
    console.log("tab2click")
    if (wx.getStorageSync("role") == "司机") {
      wx.navigateTo({
        url: '/pages/truckunload/truckunload'
      })
    }
    if (wx.getStorageSync("role") == "职员") {
      wx.navigateTo({
        url: '/pages/loadrecord/loadrecord'
      })
    }

  },
  tab3click: function (e) {
    console.log("tab3click")
    if (wx.getStorageSync("role") == "职员") {
      wx.navigateTo({
        url: '/pages/staff/staff'
      })
    }

  }

})