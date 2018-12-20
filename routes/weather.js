var express = require('express');
var router = express.Router();
var url = require('url');
var https = require('https');
var querystring = require('querystring');


var headers = {
	'User-Agent' : 'angler/3.8.8 (iOS 12.1; iPhone8,1; zh_Hans; 750*1334; Scale/2.00;wt3mecjzv)',
	'Authorization' : 'Basic MTg5MTYzNjo1Z0l2aVNsbmlvVVZLOVVOazFRRzNpOmFuZ2xlcg==',
	'Content-Type':'application/x-www-form-urlencoded',
}
var host = 'app.solot.co';
var path ='/angler/v2/stories?method=storiesList&limit=20&receiveType=1';
var	method = 'get';

//批量天气
router.get('/mult', function (req, res) {
	console.log(req.query.emptyGeohashs);
var post_data = {
	"emptyGeohashs": req.query.emptyGeohashs,
	"update": 0,
	"isvip": 1
}
;//这是需要提交的数据
var content = querystring.stringify(post_data);
console.log(content);
var multWeaOption = {
	host :host,
	path :'/v2/weather/getMultiWeather',
	method :'POST',
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
var req = https.request(multWeaOption, callback);
req.write(content);
req.end();
});


router.get('/singal', function (req, res) {
	res.send('单天气' + req.params.posi);
});



//一周天气
router.get('/sevenDays', function (req, res) {
	console.log('一周天气' + req.query.geohash);
	var sevenDaysWeaOption = {
	host :host,
	path :'/v2/weather/:geohash?'+'geohash='+req.query.geohash+'isVip='+ 1,
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
var req = https.request(sevenDaysWeaOption, callback);
req.end();
});


router.get('/tide/:posi', function (req, res) {
	res.send('潮汐天气详情');
});


module.exports = router;