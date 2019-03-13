var express = require('express');
var router = express.Router();
var untilTool = require(ROOT_DIR +'/lib/untilTool.js');
var client = require(ROOT_DIR + '/lib/clientTidePg.js');
var analysisReq = require(ROOT_DIR + '/lib/analysisReqParams.js');


router.get('/newVersion', function (req, res) {
    // var params = analysisReq.getReqParams(req);
    client.callTidePg('wade_module_config.get_new_version', null, function (ret) {
      res.json(ret);
    })
});


router.get('/tideconfig', function (req, res) {
    client.callTidePg('wade_module_config.tide_config', null, function (ret) {
      res.json(ret);
    })
  // res.status(500).send({"code":401000});
});

router.get('/privacy/policy', function (req, res) {
  var params = analysisReq.getReqParams(req);
    client.callTidePg('wade_module_config.policy_config', params, function (ret) {
      res.json(ret);
    })
});



module.exports = router;