var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
	res.send('全局配置');
});

module.exports = router;