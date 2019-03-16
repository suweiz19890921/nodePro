var express = require('express');
var router = express.Router();
var untilTool = require(ROOT_DIR +'/lib/untilTool.js');
var client = require(ROOT_DIR + '/lib/clientTidePg.js');
var analysisReq = require(ROOT_DIR + '/lib/analysisReqParams.js');

router.post('/submit', function (req, res) {
	var params = analysisReq.getReqParams(req);
	client.callTidePg('wade_module_feedback.add_contact', params, function (ret) {
      res.json(ret);
    })
  // res.status(500).send({"code":401000});
});



module.exports = router;