// pages/staff/staff.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbar: ['访问审批', '员工信息'],
    currentTab: 0,
    items: [{
        message: "foo"
      },
      {
        message: "bar"
      }
    ],
    show: false,
    modalData: 1,
    pickerIndex: 0,
    role: ["司机", "职员"],
    selectedUserId: 0,
    name: "",
    tel: "",
    company: "",
    describe: "",
    users:""
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
      url: app.globalData.serverUrl + '/v1/apply',
      data: {
        limit: -1,
        sortby: "create_time",
        order: "desc",
      },
      success: function(res) {
        console.log("applys:", res)
        if (res == "") {
          console.log("res is empty")
        }
        that.setData({
          items: res
        })

      }
    })
    wx.request({
      url: app.globalData.serverUrl + '/v1/user',
      data: {
        limit: -1,
        sortby: "create_time",
        order: "desc",
      },
      success: function (res) {
        console.log("users:", res)
        if (res == "") {
          console.log("res is empty")
        }
        that.setData({
          users: res
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
  navbarTap: function(e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },
  applyDetail: function(e) {

    // this.setData({
    //   currentTab: e.currentTarget.dataset.idx
    // })
    let id = e.target.dataset.id;
    console.log("index:" + id)
    this.selectedUserId = this.data.items.data[id].Id
    console.log("selectedUserId:" + this.selectedUserId)


    this.setData({
      modalData: this.data.items.data[id],
      show: true
    });

  },
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      pickerIndex: e.detail.value
    })
  },

  closeModel: function(e) {
    console.log("close modal:")
    this.setData({
      show: false
    });
  },

  permitApply: function(e) {
    var that = this
    console.log("permitApply")
    wx.request({
      url: app.globalData.serverUrl + '/v1/apply/' + this.selectedUserId,
      header: {
        "Content-Type": "application/json;charset=utf-8"
      },
      method: "PUT",
      data: {
        Username: that.data.modalData.Username,
        Openid: that.data.modalData.Openid,
        "Tel": that.data.modalData.Tel,
        "Company": that.data.modalData.Company,
        Status: 1
      },
      //this.data.role[e.detail.value.role]
      success: function(res) {
        if (res.data == 'OK') {
          wx.showToast({
            title: "操作成功",
            icon: 'success',
            duration: 2500
          })
          
          console.log("describe:" + that.data.describe)
          wx.request({
            url: app.globalData.serverUrl + '/v1/user',
            header: {
              "Content-Type": "application/json;charset=utf-8"
            },
            method: "POST",
            data: {
              Username: that.data.name,
              Openid: that.data.modalData.Openid,
              "Tel": that.data.tel,
              "Company": that.data.company,
              "Describe": that.data.describe,
              "Role": that.data.role[that.data.pickerIndex]
            },
            //this.data.role[e.detail.value.role]
            success: function(res) {
              if (res.statusCode == '201') {
                wx.showToast({
                  title: "添加用户成功",
                  icon: 'success',
                  duration: 2500
                })
                
                wx.request({
                  url: app.globalData.serverUrl + '/v1/apply',
                  data: {
                    limit: -1,
                    sortby: "create_time",
                    order: "desc",
                  },
                  success: function (res) {
                    console.log("applys:", res)
                    if (res == "") {
                      console.log("res is empty")
                    }
                    that.setData({
                      items: res
                    })

                  }
                })
                that.setData({
                  show: false,
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
            fail: function() {
              wx.showToast({
                title: '服务器网络错误!',
                icon: 'loading',
                duration: 2500
              })

            }
          })
          //wx.setStorageSync('role', 100)//设置角色待审批
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
  denyApply: function(e) {
    console.log("denyApply")
    this.setData({
      show: false
    });
    //todo 发送
  },
 
  nameInput: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  telInput: function (e) {
    this.setData({
      tel: e.detail.value
    })
  },
  companyInput: function (e) {
    this.setData({
      company: e.detail.value
    })
  },
  describeInput: function (e) {
    this.setData({
      describe: e.detail.value
    })
  },
  delUser: function (e) {
    console.log("del modal:")
    var that = this
    let id = e.target.dataset.id;
    var selectedUserId = this.data.users.data[id].Id
    var selectedOpenId = this.data.users.data[id].Openid
    console.log("selectedUserId:" + selectedUserId)
    console.log("selectedOpenId:" + selectedOpenId)
    wx.showModal({
      title: '警告',
      content: '确定要删除此用户吗?',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.serverUrl + '/v1/user/' + selectedUserId,
            header: {
              "Content-Type": "application/json;charset=utf-8"
            },
            method: "DELETE",

            success: function (res) {
              if (res.data == 'OK') {
                wx.showToast({
                  title: "操作成功",
                  icon: 'success',
                  duration: 2500
                })
              } else {
                wx.showToast({
                  title: "操作失败",
                  icon: 'fail',
                  duration: 2500
                })
              }
              
              wx.request({
                url: app.globalData.serverUrl + '/v1/apply',
                data: {
                  limit: -1,
                  sortby: "create_time",
                  order: "desc",
                },
                success: function (res) {
                  console.log("applys:", res)
                  if (res == "") {
                    console.log("res is empty")
                  }
                  that.setData({
                    items: res
                  })

                }
              })
              wx.request({
                url: app.globalData.serverUrl + '/v1/user',
                data: {
                  limit: -1,
                  sortby: "create_time",
                  order: "desc",
                },
                success: function (res) {
                  console.log("users:", res)
                  if (res == "") {
                    console.log("res is empty")
                  }
                  that.setData({
                    users: res
                  })

                }
              })

            },
            fail: function () {
              wx.showToast({
                title: '服务器网络错误!',
                icon: 'loading',
                duration: 2500
              })

            }
          })
          wx.request({
            url: app.globalData.serverUrl + '/v1/apply/' + selectedOpenId,
            header: {
              "Content-Type": "application/json;charset=utf-8"
            },
            method: "DELETE"
          })
        }
      }
    })
  },
})