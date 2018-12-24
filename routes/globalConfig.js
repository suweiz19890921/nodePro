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
	var connection = mysql.createConnection(config);
	connection.connect();
    var sql = 'SELECT reviewConfig()'
    connection.query(sql, function (error, result) {
    if (error) throw error;
        console.log('--------------------------SELECT----------------------------');
        
       result = JSON.stringify(result);
       result = JSON.parse(result);//把results字符串转为json对象
       for(var i=0;i<result.length;i++)
        {
            console.log(result[i]['reviewConfig()']);
        }
        res.send(result[0]['reviewConfig()']);
        connection.end();
        console.log('------------------------------------------------------------\n\n'); 
});
	// res.status(500).send({"code":401000});
});

module.exports = router;