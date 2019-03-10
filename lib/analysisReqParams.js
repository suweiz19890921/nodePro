'use strict'

var until = require(ROOT_DIR + '/lib/untilTool.js');
var geohash = require('ngeohash');

function getReqParams(req) {
	var params = extendJson(req.query, req.body, req.params);
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
		params.os_version = req.userAgent.os_version;
		params.device_name = req.userAgent.device_name;
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
	return params;
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
	return ret;
}






var userAgent_re = '^\\s*'
        + '(\\w+)'                          // app_name
        + '\\/'                             // /
        + '([\\d\\.]+)'                     // app_version
        + '\\s*\\('                         // (
        + '(\\w+)'                          // os_name
        + '\\s+([\\d\\.]+);'                // os_version
        + '\\s*([^;]+);'                    // device_name
        + '\\s*([\\w-]+);'                  // language
        + '\\s*([\\d\\*]+)'                 // resolution
        + '(?:;\\s*Scale\\/([\\d\\.]+))?\\s*'   // Scale/scale (可选的)
        + '(?:;\\s*(\\[[-]?(\\d|([1-9]\\d)|(1[0-7]\\d)|(180))(\\.?\\d*)\\,[-]?(\\d|([1-8]\\d)|(90))(\\.?\\d*)\\]|(\\w+)))?'  // [经,纬] (可选的)
        + '.*\\)$',                           // )
    re = new RegExp(userAgent_re, 'i');

    var deviceModule ={
    "iPad1,1":"iPad",
    "iPad1,2":"iPad",
    "iPad2,1":"iPad 2",
    "iPad2,2":"iPad 2",
    "iPad2,3":"iPad 2",
    "iPad2,4":"iPad 2",
    "iPad2,5":"iPad Mini",
    "iPad2,6":"iPad Mini",
    "iPad2,7":"iPad Mini",
    "iPad3,1":"iPad 3",
    "iPad3,2":"iPad 3",
    "iPad3,3":"iPad 3",
    "iPad3,4":"iPad 4",
    "iPad3,5":"iPad 4",
    "iPad3,6":"iPad 4",
    "iPad4,1":"iPad Air",
    "iPad4,2":"iPad Air",
    "iPad4,3":"iPad Air",
    "iPad4,4":"iPad Mini 2",
    "iPad4,5":"iPad Mini 2",
    "iPad4,6":"iPad Mini 2",
    "iPad5,1":"iPad Air 2",
    "iPad5,2":"iPad Air 2",
    "iPad5,3":"iPad Air 2",
    "iPhone2,1":"iPhone 3GS",
    "iPhone3,1":"iPhone 4",
    "iPhone3,2":"iPhone 4",
    "iPhone3,3":"iPhone 4",
    "iPhone4,1":"iPhone 4s",
    "iPhone5,1":"iPhone 5",
    "iPhone5,2":"iPhone 5",
    "iPhone5,3":"iPhone 5c",
    "iPhone5,4":"iPhone 5c",
    "iPhone6,1":"iPhone 5s",
    "iPhone6,2":"iPhnoe 5s",
    "iPhone7,1":"iPhone 6 Plus",
    "iPhone7,2":"iPhone 6"
};
//Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36
//FishGame/1.0 (Mac OS X 10.12.5; fuck; zh_Hans; 1024*768; Scale/1.00)
//angler/2.0.0 (iOS 10.3.2; iPhone8,1; zh_Hans; 750*1334; Scale/2.00;wtte56pzk)
function getParseUserAgent (ua) {
    var matches;
    if(ua){
        if (matches = ua.match(re)) {
            var userAgent = {
                appid: matches[1].toLowerCase(),
                app_version: matches[2],
                os_name: matches[3],
                os_version: matches[4],
                device_name: matches[5],
                language: matches[6],
                resolution: matches[7],
                scale: matches[8],
                position: matches[9]
            };
            var language = userAgent.language;
            if (language == 'zh_CN' || /Hans/i.test(language)) {
                language = 'zh_Hans';
            } else if (/^zh/.test(language)) {
                language = 'zh_Hant';
            } else if (/^ja/.test(language)) {
                language = 'ja';
            } else {
                language = 'en';
            }
            userAgent.language = language;
            userAgent.device_name = deviceModule[userAgent.device_name] || userAgent.device_name;
            if (userAgent.app_version&&/\./.test(userAgent.app_version)&&userAgent.app_version.split('.').length>2) {
                //userAgent.app_version = parseInt(userAgent.app_version.replace(/\./g, ''), 10);
                userAgent.app_version=userAgent.app_version.split('.')[0]+ until.pad(userAgent.app_version.split('.')[1],2)+until.pad(userAgent.app_version.split('.')[2],2)
            } else {
                userAgent.app_version = 10000;
            }
            if (!!userAgent.position) {
                var lng, lat;
                try {
                    if ((/\[*\]/).test(userAgent.position)) {
                        userAgent.position = JSON.parse(userAgent.position);
                    } else {
                        var temp = geohash.decode(userAgent.position);
                        userAgent.position = [temp.longitude, temp.latitude];
                    }
                    lng = userAgent.position[0],
                        lat = userAgent.position[1];
                    if (lng < 180 && lng > -180 && lat < 90 && lat > -90) {

                    } else {
                        delete userAgent.position;
                    }
                } catch (e) {
                    delete userAgent.position;
                }
            }
            return userAgent;
        } else {
            console.log("ua : " + JSON.stringify(ua));
            return {code:400000};
        }
    } else {
        console.log('user-agent invalid' + 'user-agent = ' + JSON.stringify(userAgent));
        return {code:400000};
    }
}

function getClientIp(req) {
    var ipAddress = req.header('X-REAL-IP');
    var forwardedIpsStr = req.header('x-forwarded-for');
    if (forwardedIpsStr) {
        var forwardedIps = forwardedIpsStr.split(',');
        ipAddress = forwardedIps[0];
    }
    if (!ipAddress) {
        ipAddress = req.connection.remoteAddress;
    }
    return ipAddress;
}


module.exports.getReqParams = getReqParams;
module.exports.getParseUserAgent = getParseUserAgent;
module.exports.extendJson = extendJson;
module.exports.getClientIp = getClientIp;


