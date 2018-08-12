// pages/register/register.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['钲旺', '供应商', '其他'],
    index: 0
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },

  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)

    var warn = "";//弹框时提示的内容
    var pass = false;//判断信息输入是否完整
    if (e.detail.value.name == "") {
      warn = "请填写您的姓名！";
    } else if (e.detail.value.tel == "") {
      warn = "请填写您的手机号码！";
    } else {
      pass = true;
    }
    if (!pass) {
      wx.showModal({
        title: '提示',
        content: warn
      })
    }else{
      console.log("sU:"+app.globalData.serverUrl)
      wx.request({

        url: app.globalData.serverUrl +'/wxmini/register',

        header: {

          "Content-Type": "application/x-www-form-urlencoded"

        },

        method: "POST",

        data: { Username: e.detail.value.name, "Openid": wx.getStorageSync('openid'), "Tel": e.detail.value.tel, "Company": this.data.array[e.detail.value.company]},

        success: function (res) {

          if (res.data.Code == 1) {

            wx.showToast({

              title: "注册成功",

              icon: 'success',

              duration: 2500

            })
            wx.setStorageSync('role', '待审核')//设置角色待审批
            wx.navigateBack()
          } else{
            wx.showToast({

              title: "注册失败",

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

  }
})