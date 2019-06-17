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
var host = 'app.catches.com';
var	method = 'get';



router.get('/live/list', function (req, res) {
    console.log('----------------------------------------------------------------------');
    console.log('url = ' + req.originalUrl);
    var liveHost = 'service.inke.cn';
    var	path = '/api/live/theme_card_recommend?user_level=4&longitude=114.436067&live_uid=0&stay_time=0&latitude=30.461765&type=1&slide_pos=0';
    console.log('path = ' + path);
    var liveOption = {
        host :liveHost,
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

                res.send(body);
                console.log('date = ' + new Date() + "\nret = " + body);
                console.log('----------------------------------------------------------------------');

        })
        response.on('error', function (error) {
            console.error(error);
            res.send(error);
        })
    }
    var req = https.request(liveOption, callback);
    req.end();
});


module.exports = router;/**
 * Created by suwei on 2019/6/17.
 */
