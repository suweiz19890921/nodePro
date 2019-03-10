var express = require('express');
var router = express.Router();
var untilTool = require(ROOT_DIR +'/lib/untilTool.js');
var client = require(ROOT_DIR + '/lib/clientTidePg.js');
var analysisReq = require(ROOT_DIR + '/lib/analysisReqParams.js');

router.post('/submit', function (req, res) {
	var params = analysisReq.getReqParams(req);
	var data = {'code':0, 'data':[]};
	console.log(req.body.contact);
	res.json(data);
  // res.status(500).send({"code":401000});
});



module.exports = router;