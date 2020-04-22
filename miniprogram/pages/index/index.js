//index.js
const app = getApp()
Page({
  data: {
    img1: '',
    img2: '',
    img3: '',
    img4: '',
    width:600,
    height:600
  },
  // 上传图片
  doUpload: function() {
    var that = this;
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        console.log(res)
        wx.showLoading({
          title: '上传中',
        })
        const filePath = res.tempFilePaths[0]
        // 上传图片
        const cloudPath = 'Hi-image' + filePath.match(/\.[^.]+?$/)[0]
        //console.log(cloudPath)
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: (res) => {
            let fileID = res.fileID
            console.log('[上传文件] 成功：', res)
            
            //调用图片审查
            wx.cloud.callFunction({
              name: "reviewimage",
              data: {
                cloudPath: cloudPath
              }
            }).then((res) => {
              console.log(res)
              //console.log(res.result.AdsInfo.HitFlag)
              if (res.result.AdsInfo.HitFlag === 0 && res.result.PoliticsInfo.HitFlag === 0 && res.result.PornInfo.HitFlag === 0 && res.result.TerroristInfo.HitFlag === 0) {
                
                //调用智能剪裁
                wx.cloud.callFunction({
                  name: "cutpicture",
                  data: {
                    fileID: fileID,
                    pixel: [{
                      width: 100,
                      height: 100
                    }, {
                      width: 300,
                      height: 202
                    }, {
                      width: 160,
                      height: 88
                    }]
                  }
                }).then(res => {
                  console.log(res)
                  that.setData({
                    img1: fileID,
                    img2: res.result[0],
                    img3: res.result[1],
                    img4: res.result[2],
                    height:400
                  })
                })
              } else {
                wx.showToast({
                  icon: 'none',
                  title: '您上传的图片有敏感信息，请重新上传',
                })
              }
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

})