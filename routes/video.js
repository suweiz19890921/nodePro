var express = require('express');
var router = express.Router();
var fs = require('fs');
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



router.get('/v1/videopath', function (req, res) {
    var time = new Date();
    var videoName = req.query.name;
    console.log("-------点击查询下载" + time.getFullYear() + "/" + time.getMonth() + "/" + time.getDate() + "/" + time.getHours() + "/" + time.getMinutes() + "/" + time.getSeconds() + "-------");
    res.writeHead(200, {'Content-Type': 'video/mp4'});
    var rs = fs.createReadStream('/Users/suwei/Downloads/duye' + '.mp4');
    rs.pipe(res);

    rs.on('end', function () {
        res.end();
        console.log('end call');
    });
});


module.exports = router;/**
 * Created by suwei on 2019/6/18.
 */
