var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
	res.send('全局配置');
});

router.get('/newVersion', function (req, res) {
	console.log('获取新版本');
	var data = {'code':0, 'data':[], 'languages' : []};
	res.send(data);
});

router.get('/review', function (req, res) {
	console.log('获取审核状态 版本号为' + req.query.version);
	var data = {'code':450, 'data':{'isInReview' : 0}};
	res.send(data);
	// res.status(500).send({"code":401000});
});

module.exports = router;