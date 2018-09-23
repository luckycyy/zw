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
      console.log("if1")
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      console.log(this.data.userInfo)
    } else if (this.data.canIUse) {
      console.log("canIUse")
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        console.log("callback")
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
        if (value == "unregister"||value == "待审核"){
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
    //第一次授权点击允许后 会进这里。已授权之后不会进
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    var that = this
    wx.getUserInfo({
      success: res => {
        // 可以将 res 发送给后台解码出 unionId
        that.globalData.userInfo = res.userInfo
        console.log('nickName:' + res.userInfo.nickName)

        // 登录
        wx.login({
          success: res => {
            console.log('code:' + res.code)
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            if (res.code) {
              //发起网络请求
              wx.request({
                url: that.globalData.serverUrl + '/wxmini/login',
                data: {
                  code: res.code,
                  nickName: that.globalData.userInfo.nickName,
                  avatarUrl: that.globalData.userInfo.avatarUrl
                },
                success: function (res) {
                  console.log("role:", res.data.Role, ",openid:", res.data.Openid, "username:", res.data.Username, "pickerItems:", res.data.PickerItems)


                  if (res.data.Role == "") {
                    console.log("res is empty")
                  }
                  wx.getLocation({
                    type: 'wgs84',
                    success: function (res) {
                      var latitude = res.latitude
                      var longitude = res.longitude
                      var speed = res.speed
                      var accuracy = res.accuracy
                      wx.setStorageSync('location', {
                        "latitude": latitude,
                        "longitude": longitude,
                        "speed": speed,
                        "accuracy": accuracy
                      })
                      console.log("la:", wx.getStorageSync("location").latitude)
                    }
                  })
                  try {
                    wx.setStorageSync('role', res.data.Role)
                    wx.setStorageSync('openid', res.data.Openid)
                    wx.setStorageSync('username', res.data.Username)
                    wx.setStorageSync('describe', res.data.Describe)
                    if (res.data.PickerItems != "") {
                      var itemsJson = JSON.parse(res.data.PickerItems)
                      wx.setStorageSync("productPicker", itemsJson[0])
                      wx.setStorageSync("stationPicker", itemsJson[1])
                    }

                  } catch (e) {
                    console.log("setStroge err,", e)
                  }


                }
              })
            } else {
              console.log('登录失败！' + res.errMsg)
            }
          }
        })

        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        if (this.userInfoReadyCallback) {
          this.userInfoReadyCallback(res)
          console.log('appcallback')
        }
        setTimeout(function () {
          try {
            var value = wx.getStorageSync("role")
            console.log("role in storage is :" + value)
            if (value == "unregister" || value == "待审核") {
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


      }
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

  },
  globalData: {
    userInfo: null,
    serverUrl: "http://39.105.74.138:8011"
  }

})