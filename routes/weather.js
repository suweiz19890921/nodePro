var express = require('express');
var router = express.Router();
var url = require('url');
var https = require('https');
var querystring = require('querystring');
var client = require(ROOT_DIR + '/lib/clientTidePg.js');

var headers = {
	'User-Agent' : 'GlobalTide/3.0.0 (iOS 12.1; iPhone8,1; zh_Hans; 750*1334; Scale/2.00;wt3mecmbr)',
	'Authorization' : 'Basic OihudWxsKTpHbG9iYWxUaWRl',
	'Content-Type':'application/x-www-form-urlencoded',
}
var host = 'g.catches.com';
var tideHost = 'app.catches.com';
var	method = 'get';

//批量天气
router.get('/mult', function (req, res) {
	console.log('----------------------------------------------------------------------');
	console.log('url = ' + req.originalUrl);
var post_data = {
	"emptyGeohashs": req.query.emptyGeohashs,
	"update": 0,
	"isvip": 1
}
;//这是需要提交的数据
var content = querystring.stringify(post_data);
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
        console.log('date = ' + new Date() + "\nret = " + body);
        console.log('----------------------------------------------------------------------');
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


//一周天气
router.get('/sevenDays', function (req, res) {
	console.log('----------------------------------------------------------------------');
	console.log('url = ' + req.originalUrl);
	var sevenDaysWeaOption = {
	host :host,
	path :'/v2/weather/'+ req.query.geohash +'?'+'isVip=1&update=0',
	method :method,
	headers : headers
}
var callback = function  (response) {
	var body ='';
	response.on('data', function (data) {
		body += data;
	})
	response.on('end', function  () {
        console.log('date = ' + new Date() + "\nret = " + body);
        console.log('----------------------------------------------------------------------');
		res.send(body);
	})
	response.on('error', function (error) {
		console.error(error);
	})
}
var req = https.request(sevenDaysWeaOption, callback);
req.end();
});


//潮汐
router.get('/tide', function (req, res) {
	console.log('----------------------------------------------------------------------');
	console.log('url = ' + req.originalUrl);
var	path = '/v1/tidal/' + req.query.geohash + '?method=byGeohash&geohash='+req.query.geohash;
	console.log('path = ' + path);
var tideWeaOption = {
	host :tideHost,
	path :path,
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
		var obj = JSON.parse(body);  
		if (obj.code != 0) {
			console.log('date = ' + new Date() + "\nret = " + body);
            console.log('----------------------------------------------------------------------');
			res.status(409).send({'data' : {'data' :'error happen', 'code': obj.code}});
		} else {
			var params = {"id" : obj['id'], "geohash" : obj['geohash'], "latlng" : obj['latlng'], "tide" : obj};
		    client.callTidePg('wade_module_tide.add_tide', params, function (ret) {
            console.log(JSON.stringify(ret));
            })
			res.send(body);
			console.log('date = ' + new Date() + "\nret = " + body);
            console.log('----------------------------------------------------------------------');
			
		}
	})
	response.on('error', function (error) {
		console.error(error);
		res.send(error);
	})
}
var req = https.request(tideWeaOption, callback);
req.end();
});


module.exports = router;