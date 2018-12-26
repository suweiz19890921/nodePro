var express = require('express');
var router = express.Router();
var untilTool = require(ROOT_DIR +'/lib/untilTool.js');
var mysql = require('mysql');
var JSON = require('JSON');

var config = {
  host     : 'localhost',
  user     : 'root',
  password : '123456',
  database : 'base',
  stringifyObjects : 'TRUE'
}

router.get('/', function (req, res) {
	res.send('全局配置');
});

router.get('/newVersion', function (req, res) {
	console.log('获取新版本 是否为需要强制升级的版本');
	var connection = mysql.createConnection(config)
	connection.connect();
    var sql = 'select getNewVersion()'
    connection.query(sql, function (error, result) {
    if (error) throw error;
        console.log('--------------------------SELECT----------------------------');
        res.send(untilTool.handleDBFunData(result));
        connection.end();
        console.log('------------------------------------------------------------\n\n'); 
});
});

router.get('/review', function (req, res) {
	console.log('获取审核状态 版本号为' + req.query.version);
	var connection = mysql.createConnection(config)
	connection.connect();
    var sql = 'select reviewConfig(?)'
    var params = [req.query.version];
    connection.query(sql, params, function (error, result) {
    if (error) throw error;
        console.log('--------------------------SELECT----------------------------');
        res.jsonp(untilTool.handleDBFunData(result));
        connection.end();
        console.log('------------------------------------------------------------\n\n'); 
});
	// res.status(500).send({"code":401000});
});

module.exports = router;