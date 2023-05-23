// import RPCClient from "@alicloud/pop-core";
// import dotenv from 'dotenv';
const RPCClient = require("@alicloud/pop-core");
const dotenv = require('dotenv');

dotenv.config();

async function main() {
  // 注意，此处实例化的client请尽可能重复使用，避免重复建立连接，提升检测性能。
  var client = new RPCClient({
    accessKeyId: process.env.ALIYUN_ACCESS_ID || '',
    accessKeySecret: process.env.ALIYUN_ACCESS_SECRET || '',
    // green-cip.cn-shanghai.aliyuncs.com
    // green-cip.cn-beijing.aliyuncs.com
    // green-cip.ap-southeast-1.aliyuncs.com
    endpoint: "https://green-cip.cn-shanghai.aliyuncs.com",
    apiVersion: '2022-03-02'
  });
  // 通过以下代码创建API请求并设置参数。
  var params = {
    "Service": "ai_art_detection",
    // 待检测文本内容。
    "ServiceParameters": JSON.stringify({
      "content": "Hello",
    })
  }
  
  var serviceParameters = JSON.parse(params.ServiceParameters);
  if (!serviceParameters.hasOwnProperty("content") || serviceParameters.content.trim().length === 0) {
    console.log("text moderation content is empty")
    return;
  }
  
  var requestOption = {
    method: 'POST',
    formatParams: false,
  };
  
  try {
    // 调用接口获取检测结果。
    var response = await client.request('TextModeration', params, requestOption)
    // 自动路由。
    if (response.Code === 500) {
      console.log("switch to shanghai")
      // 服务端错误，区域切换到cn-beijing。
      client = new RPCClient({
        accessKeyId: process.env.ALIYUN_ACCESS_ID || '',
        accessKeySecret: process.env.ALIYUN_ACCESS_SECRET || '',
        endpoint: "https://green-cip.cn-shanghai.aliyuncs.com",
        apiVersion: '2022-03-02'
      });
      response = await client.request('TextModeration', params, requestOption)
    }
    console.log(JSON.stringify(response))
  } catch (err) {
    console.log(err);
  }
}

main().then(function (response) { });