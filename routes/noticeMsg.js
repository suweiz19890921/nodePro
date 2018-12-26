var express = require('express');
var router = express.Router();


router.get('/count', function (req, res) {
	console.log('获取通知消息 appToken' + req.query.appToken);
	var data = {'code':0, 'data':{'count' : 0}};
	console.log(data);
	res.send(data);
	// res.status(500).send({"code":401000});
});

module.exports = router;