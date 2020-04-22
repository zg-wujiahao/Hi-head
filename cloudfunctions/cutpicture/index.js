// 云函数入口文件
const cloud = require('wx-server-sdk')
const extCi = require("@cloudbase/extension-ci");
const tcb = require("tcb-admin-node");
tcb.init({
  env: "xly-ictkv"
});
tcb.registerExtension(extCi);
cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  let fileId = event.fileID
  // 获取图⽚临时链接
  const getImageUrl = async(fileId) => {
    const {
      fileList
    } = await cloud.getTempFileURL({
      fileList: [fileId]
    })
    return fileList[0].tempFileURL
  }
  let originImageUrl = await getImageUrl(fileId)
  var arr = []
  for (var i = 0; i <= event.pixel.length - 1; i++) {
    let rule = `imageMogr2/thumbnail/!${event.pixel[i].width}x${event.pixel[i].height}r|imageMogr2/scrop/${event.pixel[i].width}x${event.pixel[i].height}/`
    // ⼈脸智能裁剪后的图⽚
    cutImageUrl = originImageUrl + '?' + rule
    arr.push(cutImageUrl)
  }
  return arr
}