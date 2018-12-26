var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
	console.log(req.originalUrl);
	res.send('welcome');
});

module.exports = router;