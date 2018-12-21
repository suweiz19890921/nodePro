var express = require('express');
var router = express.Router();
var url = require('url');
var https = require('https');

var headers = {
	'User-Agent' : 'GlobalTide/1.0.0 (iOS 12.1; iPhone8,1; zh_Hans; 750*1334; Scale/2.00;wt3mecmbr)',
	'Authorization' : 'Basic OihudWxsKTpHbG9iYWxUaWRl',
	'Content-Type':'application/x-www-form-urlencoded',
}

var host = 'testapi.solot.co';
var path ='/angler/v2/stories?method=storiesList&limit=20&receiveType=1';
var	method = 'get';

router.get('/download', function (req, res) {
	console.log('获取资源')
	res.send({'code':204, 'data' : []});
});


module.exports = router;