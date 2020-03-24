/**
 * Created by suwei on 2019/7/20.
 */
var apn = require("apn");

// token 数组
//var tokens = ["853d299e2935944484d0ad2202b3f855335d43f2ae70407987a85b07addca896"];
//var tokens = ["9863e255e4f4e4fdff6f33c963c877d16a091314b0a1462f39b4453c40d0b002"];

var tokens = ["1e2c695a584a1e7bace9de7c39efa4fed65bd140c659272a83ec4abe5da36a2e"];
var service = new apn.Provider({
    cert: ROOT_DIR +'/resource/cert.pem',
    key: ROOT_DIR +'/resource/key.pem',
    //cert: ROOT_DIR +'/resource/devAPNs.pem',
    //key: ROOT_DIR +'/resource/devAPNs_Key.pem',
    gateway: "gateway.sandbox.push.apple.com",
     //gateway: "https://gateway.push.apple.com", //线上地址
     //port: 443, //端口
    passphrase: "12345678" //pem证书密码
});
var note = new apn.Notification({
    alert:  {'title' : "开课了", 'body' : "同学们,大学英语第三章直播课就要开课了,大家赶快加入吧!!!"},
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