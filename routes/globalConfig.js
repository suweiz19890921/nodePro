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

module.exports = router;