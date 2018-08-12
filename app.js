//app.js
App({

  onLaunch: function() {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.log('nickName:' + res.userInfo.nickName)

              // 登录
              wx.login({
                success: res => {
                  console.log('code:' + res.code)
                  // 发送 res.code 到后台换取 openId, sessionKey, unionId
                  if (res.code) {
                    //发起网络请求
                    wx.request({
                      url: this.globalData.serverUrl + '/wxmini/login',
                      data: {
                        code: res.code,
                        nickName: this.globalData.userInfo.nickName,
                        avatarUrl: this.globalData.userInfo.avatarUrl
                      },
                      success: function(res) {
                        console.log("role:", res.data.Role, ",openid:", res.data.Openid, "username:", res.data.Username, "pickerItems:", res.data.PickerItems)
                        

                        if (res.data.Role == "") {
                          console.log("res is empty")
                        }
                        wx.getLocation({
                          type: 'wgs84',
                          success: function(res) {
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
                          if (res.data.PickerItems!=""){
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
                console.log('callback')
              }



            }
          })
        }
      }
    })



  },
  globalData: {
    userInfo: null,
    serverUrl: "http://127.0.0.1:8011"
  }
})