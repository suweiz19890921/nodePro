var express = require('express');
var router = express.Router();

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
	console.log('获取新版本');
	var data = {'code':0, 'data':[], 'languages' : []};
	res.send(data);
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
        result = JSON.stringify(result);
        result = JSON.parse(result);//把results字符串转为json对象
        console.log(result);
        var lastKey= '';
        for (var i = 0; i < result.length; i++) {
        	var temp = result[i];
        	 for (var key in temp){
              lastKey = key;
        }
        }
       
        console.log(lastKey);
        console.log(result[0][lastKey]);
        res.send(result[0][lastKey]);
        connection.end();
        console.log('------------------------------------------------------------\n\n'); 
});
	// res.status(500).send({"code":401000});
});

module.exports = router;