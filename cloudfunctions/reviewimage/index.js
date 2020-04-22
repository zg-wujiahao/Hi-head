// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const extCi = require("@cloudbase/extension-ci");
const tcb = require("tcb-admin-node");
tcb.init({
  env: "xly-ictkv"
});
tcb.registerExtension(extCi);
// 云函数入口函数
exports.main = async(event, context) => {
  cloudPath = event.cloudPath
  try {
    const opts = {
      type: "porn,terrorist,politics,ads"
    }
    const res = await tcb.invokeExtension('CloudInfinite', {
      action: 'DetectType',
      cloudPath: cloudPath, // 需要分析的图像的绝对路径，与tcb.uploadFile中一致
      operations: opts
    })
    console.log(JSON.stringify(res.data, null, 4));
    return res.data.RecognitionResult
  } catch (err) {
    console.log(JSON.stringify(err, null, 4));
    return err
  }
}