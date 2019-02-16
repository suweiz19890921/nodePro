'use strict'

function getReqParams(req) {
	console.log('hello  world ' +   JSON.stringify(req));
	var params = extendJson(req.query, req.body, req.params);
	console.log('req.query :' + JSON.stringify(req.query));
	console.log('req.params :' + JSON.stringify(req.params));
	console.log('req.body :' + JSON.stringify(req.body));
	params = JSON.parse(JSON.stringify(params).replace(/'/g, "''"));
	delete params["_dc"];
	delete params.callback;
	//处理时间， 只接受时间戳类型的时间参数
	if (params.before) {
		try{
			params.before = parseInt(params.before);
		} catch(e) {
			console.log("invalid params before : " + params.before + "  error : " + e);
		}
	}

	if (params.after) {
		try {
			params.after = parseInt(params.after);
		} catch (e) {
			console.log("invalid params after : " + params.after + "  error : " + e);
		}
	}

	if (req.userAgent) {
		params.appid = req.userAgent.appid;
		params.language = req.userAgent.language;
		params.os_name = req.userAgent.os_name;
		params.position = req.userAgent.position;
		params.app_version = req.userAgent.app_version;
		params.uip = req.userAgent.uip;
	}

	if (params.uip && params.uip.split(':').length > 0) {
		params.uip = params.uip.split(':')[params.uip.split(':').length - 1];
	}
	if (req.userno) {
		params.userno = req.userno;
	}
	console.log("params : " + JSON.stringify(params));
	console.log("userAgent : " + JSON.stringify(req.userAgent));
}


function extendJson() {
	// body...
	var ret = {};
	for (var i in arguments) {
		if (typeof arguments[i] == "object") {
			for (var k in arguments[i]) {
				if (!!arguments[i][k] || arguments[i][k] == 0 || arguments[i][k] == '0') {
					ret[k] = arguments[i][k];
				}
			} 
		} else {
			console.log("arguments[" + (i - 0 + 1) + "] is not a object argument:", arguments[i]);
		}
	}
}

module.exports.getReqParams = getReqParams;
module.exports.extendJson = extendJson;