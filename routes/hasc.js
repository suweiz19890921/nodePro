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

router.get('/', function (req, res) {
	res.send('地区列表');
});

router.get('/ip', function (req, res) {
	console.log('根据用户ip获取用户所在地区' + req.query.geohash);
var hascOption = {
	host :host,
	path :'/v1/geoip/hasc/'+ req.query.geohash,
	method :method,
	headers : headers
}
var callback = function  (response) {
	var body ='';
	response.on('data', function (data) {
		body += data;
	})
	response.on('end', function  () {
		console.log(body);
		res.send(body);
	})
	response.on('error', function (error) {
		console.error(error);
	})
}
var req = https.request(hascOption, callback);
req.end();
});

module.exports = router;