var express = require('express');
var router = express.Router();
var url = require('url');
var https = require('https');
var geoip=require('geoip-lite');


var hascHeaders = {
	'User-Agent' : 'GlobalTide/1.0.0 (iOS 12.1; iPhone8,1; zh_Hans; 750*1334; Scale/2.00;wt3mecmbr)',
	'Authorization' : 'Basic OihudWxsKTpHbG9iYWxUaWRl',
	'Content-Type':'application/x-www-form-urlencoded',
}

router.get('/geoip',function(req,res){
  var ip = req.query.ip||req.header('X-REAL-IP')||req.ip;
  console.log(req.originalUrl);
  var country = geoip.lookup(ip);
  console.log('country =' + country);
  if(country){
    country= country.country;
  }else{
    country='CN';
  }
  res.jsonp({code:0,country:country});
});

router.get('/posi', function (req, res) {
   var hascOption = {
	host :"api.catches.com",
	path :'/v1/geoip/hasc/'+ req.query.geohash,
	method :"get",
	headers : hascHeaders
   }
var callback = function  (response) {
	var body ='';
	response.on('data', function (data) {
		body += data;
	})
	response.on('end', function  () {
		console.log(body);
		console.log(req.originalUrl);
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