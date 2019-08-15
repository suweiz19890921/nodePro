/**
 * Created by suwei on 2019/7/20.
 */
var apn = require("apn");

// token 数组
var tokens = ["65049ddb6b5e59bf7c3f097b2a6c77768d409be616cae2c6a563b774c14d1e60"];

var service = new apn.Provider({
    cert: ROOT_DIR +'/resource/devAPNs.pem',
    key: ROOT_DIR +'/resource/devAPNs_Key.pem',
    gateway: "gateway.sandbox.push.apple.com",
    // gateway: "gateway.push.apple.com"; //线上地址
    // port: 2195, //端口
    passphrase: "123456" //pem证书密码
});
var note = new apn.Notification({
    alert:  "同学们,大学英语第三章直播课就要开课了,大家赶快加入吧!!!",
    payload : {'messageFrom': 'John Appleseed','gotoNo': 12, 'messageID' : '109876542341', 'desc' : '这堂课很重要,同学们抓紧学习!'},
});

// 主题 一般取应用标识符（bundle identifier）
note.topic = 'com.huashen.edu';

console.log('Sending: ${note.compile()} to ${tokens}');
service.send(note, tokens).then( (result) =>  {
    console.log("sent:", result.sent.length);
console.log("failed:", result.failed.length);
console.log(result.failed);
});

service.shutdown();