var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
	res.send('地区列表');
});

module.exports = router;