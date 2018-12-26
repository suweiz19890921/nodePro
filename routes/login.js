var express = require('express');
var router = express.Router();

router.post('/third/login',function (req,res) {
	console.log(req.originalUrl);
	//三方登录接口
	//登录流程 
	//1. 客户端拿到三方授权获取唯一标识，并将唯一标识通过此接口传给服务端。
	//2.通过客户端拿到的唯一标识到user表里面进行查询是否有此用户，如果有说明用户已经注册过，如果没有查询到说明没有注册。
	//3.如果没有注册，服务端通过客户端给的唯一标识调用微信官方API获取用户真实信息，并将用户信息插入到user表中并返回用户信息。
});


	//用户信息接口 客户端通过access_toke 更新用户数据 如果token过期需要让用户重新登录
router.get('/userinfo',function (req. res) {
	console.log(req.originalUrl);
});

moudle.exports = router;
