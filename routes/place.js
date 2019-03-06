var express = require('express');
var router = express.Router();
var untilTool = require(ROOT_DIR +'/lib/untilTool.js');
var client = require(ROOT_DIR + '/lib/clientTidePg.js');
var analysisReq = require(ROOT_DIR + '/lib/analysisReqParams.js');

router.get('/v1/place', function (req, res) {
	var method = req.query.method;
	switch(method) {
		case "addPlace":
		var params = req.query;
		var spot = JSON.parse(params.spot);
		console.log(JSON.stringify(spot));
		client.callTidePg('wade_module_place.add_place', spot, function (ret) {
           res.json(ret);
        })
		break;
		case "updatePlace":
		var params = req.query;
		var spot = JSON.parse(params.spot);
		console.log(JSON.stringify(spot));
		client.callTidePg('wade_module_place.add_place', spot, function (ret) {
           res.json(ret);
        })
        break;
		case "deletePlace":
		var spotid = req.query.spotid;
		var sql = "update wade_module_place set state = -1 where spotid = " + "'"+ spotid + "'";
		console.log(sql);
		client.callTidePg(sql,[], function (ret) {
           res.json(ret);
        })
		break;

		case "syncPlace" :
res.status(500).send({"code":400000, 'data' : 'NOT FOUND'});
		break;

		default:
		res.status(500).send({"code":400000, 'data' : 'NOT FOUND'});
	}
});

module.exports = router;