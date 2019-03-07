function handleDBFunData(result) {
	// body...
	//由于db中调用函数返回的数据都会被DB强制包一层以函数名为KEY的value为你所需要的数据
	 result = JSON.stringify(result);
     result = JSON.parse(result);//把results字符串转为json对象
        var lastKey= '';
        for (var i = 0; i < result.length; i++) {
        	var temp = result[i];
        	 for (var key in temp){
              lastKey = key;
        }
    }
        console.log(lastKey);
        console.log(result[0][lastKey])
        return result[0][lastKey];
}


function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function changeJson(json) {
    if (Array.isArray(json) && json.length > 0) {
        json.forEach(function (data, i) {
            if (typeof data == 'object'&&!!data) {
                changeJson(data);
            }
        });
    } else {
        try {
            Object.keys(json).forEach(function (key, i) {
                if (/time$/i.test(key) && json[key] instanceof Date) {
                    try {
                        json[key] = json[key].getTime();
                    } catch (e) {
                    }
                }else if(/pos/i.test(key)&&Array.isArray(json[key])&&json[key].length==2){
                    json[key]=ngeohash.encode(json[key][1],json[key][0])
                }else if (typeof json[key] == 'object'&&!!json[key]) {
                    changeJson(json[key]);
                } else if (/time$/i.test(key) && typeof json[key] == 'string') {
                    try {
                        var tempTime = new Date(Date.parse(json[key]));
                        if(!!tempTime.getTime()){
                            json[key] = tempTime.getTime();
                        }
                    } catch (e) {
                        logger.error(e)
                    }
                }
                if (/_/.test(key) && key != 'zh_Hans' && key != 'zh_Hant') {
                    var newKey = upperUnderlineNextLetter(key);
                    json[newKey] = json[key];
                    delete json[key];
                }
                if(/(iszan)/.test(key)){
                    json["isZan"] = json[key];
                }
                if(!!json.storiesPoster && typeof json.storiesPoster === "object"){
                    json.nickname = json.storiesPoster.nickname;
                    json.avatar = json.storiesPoster.avatar;
                }
            });
        } catch (e) {
        }
    }
    return json;
}

//去掉下划线并将下划线后面一位字母大写
function upperUnderlineNextLetter(str){
    var ret = "";
    if(str.match(/_/)){
        str = str.split("_");
        for(var i = 0;i < str.length;i++){
            if(i > 0){
                str[i] = str[i].substr(0,1).toUpperCase() + str[i].substr(1);
            }
            ret += str[i];
        }
    }
    return ret;
}


// function parseUserAgent (req,res, next) {
//     /*
//      * 扫描二维码时，如果请求不是来自于渔获应用，则判断请求来源分别跳转，分以下三种情况:
//      * 1、若是微信来源，则跳转到提示页面，提示用户复制链接去浏览器打开天
//      * 2、若是ios来源，跳ios下载链接
//      * 3、若是安卓来源，跳安卓下载链接
//      * */
//     if(req.url.match(/(qrcode\?method=scanQRCode)/) && !req.header('Authorization')){//外来扫描二维码请求
//         var ua = req.header('User-Agent')?req.header('User-Agent').toLowerCase():'',
//             osName = "";
//         logger.trace("User-Agent:%s,Authorization:%s",ua,req.header('Authorization'));
//         if(ua.match(/((iphone)|(android))/)){
//             osName = ua.match(/((iphone)|(android))/)[1];
//         }else if(ua.match(/((linux)|(window)|(macintosh))/)){
//             osName = ua.match(/((linux)|(window)|(macintosh))/)[1];
//         }
//         if(ua.match(/(MicroMessenger)/ig)){//微信来源
//             res.redirect('http://a.app.qq.com/o/simple.jsp?pkgname=com.saltchucker');
//         }else if(osName == "iphone"){//若是ios来源
//             res.redirect("https://itunes.apple.com/cn/app/id671797170?mt=8");
//         }else if(osName == "android"){//若是安卓来源
//             res.redirect("http://bj.p.solot.com/Angler3.0.0.apk");
//         }else{//其他
//             res.redirect("http://www.solot.com/");
//         }
//         return;
//     }
//     //若是应用请求
//     var userAgent = user_agent.parseUserAgent(req.header('User-Agent'));
//     //兼容网页调用
//     var params = wrap_params.wrapParams(req);
//     if (params && !userAgent.appid) {
//         userAgent = user_agent.parseUserAgent(params['User-Agent']);
//     }
//     if (!!userAgent.code) {
//         logger.trace(new Error('user-agent invalid')+',user-agent:%j',userAgent);
//     }
//     if (userAgent && !!userAgent.appid){
//         userAgent.uip = wrap_params.getClientIp(req);
//         //设备唯一标识
//         var SFDeviceId = req.header('SFDeviceId');
//         if (SFDeviceId){
//             userAgent.SFDeviceId = SFDeviceId;
//             //保存设备标识
//             dao.saveSFDeviceId(userAgent, function (ret) {
//                 if (ret.code == 0) {
//                     logger.trace("SFDeviceId save successful!userAgent:%j", userAgent);
//                 }else{
//                     logger.error("SFDeviceId save error!userAgent:%j", userAgent);
//                 }
//             });
//         }
//     }
//     req.userAgent = userAgent;
//     return next();
//     /*client.parseUserAgent(req.header('User-Agent'), function (val) {
//         req.userAgent = val;
//         return next();
//     }, function (name, err) {
//         logger.error(name, err);
//         return next('parseUserAgent error',{code: errors.INTERNAL_ERROR});
//     });*/
// }

// module.exports.parseUserAgent = parseUserAgent;
module.exports.changeJson = changeJson;
module.exports.upperUnderlineNextLetter = upperUnderlineNextLetter;
module.exports.handleDBFunData = handleDBFunData;
module.exports.pad = pad;