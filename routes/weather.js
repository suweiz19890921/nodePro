var express = require('express');
var router = express.Router();

router.get('/mult/:posis', function (req, res) {
	res.send('列表多天气' + req.params.posis);
});


router.get('/singal/:posi', function (req, res) {
	res.send('单天气' + req.params.posi);
});


router.get('/tide/:posi', function (req, res) {
	res.send('潮汐天气详情');
});


module.exports = router;