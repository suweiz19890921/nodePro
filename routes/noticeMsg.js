var express = require('express');
var router = express.Router();


router.get('/count', function (req, res) {
	console.log(req.originalUrl);
	var data = {'code':0, 'data':{'count' : 0}};
	console.log(data);
	res.send(data);
	// res.status(500).send({"code":401000});
});

module.exports = router;