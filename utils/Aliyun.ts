import RPCClient from "@alicloud/pop-core";

const aliyunClient = new RPCClient({
  accessKeyId: process.env.ALIYUN_ACCESS_ID || '',
  accessKeySecret: process.env.ALIYUN_ACCESS_SECRET || '',
  endpoint: "https://green-cip.cn-shanghai.aliyuncs.com",
  apiVersion: '2022-03-02'
});

export default aliyunClient;
