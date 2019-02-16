var express = require('express');
var router = express.Router();
var untilTool = require(ROOT_DIR +'/lib/untilTool.js');
var client = require(ROOT_DIR + '/lib/clientTidePg.js');
var analysisReq = require(ROOT_DIR + '/lib/analysisReqParams.js');

router.get('/', function (req, res) {
	res.send('全局配置');
});

router.get('/newVersion', function (req, res) {
    // var params = analysisReq.getReqParams(req);
    client.callTidePg('wade_module_version.get_new_version', null, function (ret) {
      res.json(ret);
    })
});

router.get('/review', function (req, res) {
    var params = analysisReq.getReqParams(req);
    client.callTidePg('wade_module_version.get_new_version', params, function (ret) {
      res.json(ret);
    })
	// res.status(500).send({"code":401000});
});

module.exports = router;