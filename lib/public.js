var analysisReq = require(ROOT_DIR + '/lib/analysisReqParams.js');


exports.parseUserAgent=function(req,res, next) {
    /*
     * 扫描二维码时，如果请求不是来自于渔获应用，则判断请求来源分别跳转，分以下三种情况:
     * 1、若是微信来源，则跳转到提示页面，提示用户复制链接去浏览器打开天
     * 2、若是ios来源，跳ios下载链接
     * 3、若是安卓来源，跳安卓下载链接
     * */
    if(req.url.match(/(qrcode\?method=scanQRCode)/) && !req.header('Authorization')){//外来扫描二维码请求
        var ua = req.header('User-Agent')?req.header('User-Agent').toLowerCase():'',
            osName = "";
            console.log("User-Agent: = " + JSON.stringify(ua) + "Authorization = " + JSON.stringify(req.header('Authorization')) );
        if(ua.match(/((iphone)|(android))/)){
            osName = ua.match(/((iphone)|(android))/)[1];
        }else if(ua.match(/((linux)|(window)|(macintosh))/)){
            osName = ua.match(/((linux)|(window)|(macintosh))/)[1];
        }
        if(ua.match(/(MicroMessenger)/ig)){//微信来源
            res.redirect('http://a.app.qq.com/o/simple.jsp?pkgname=com.saltchucker');
        }else if(osName == "iphone"){//若是ios来源
            res.redirect("https://itunes.apple.com/cn/app/id671797170?mt=8");
        }else if(osName == "android"){//若是安卓来源
            res.redirect("http://bj.p.solot.com/Angler3.0.0.apk");
        }else{//其他
            res.redirect("http://www.solot.com/");
        }
        return;
    }
    //若是应用请求


    var userAgent = analysisReq.getParseUserAgent(req.header('User-Agent'));
    //兼容网页调用
    if (!!userAgent.code) {
        console.log('user-agent invalid' + 'user-agent = ' + JSON.stringify(userAgent));
    }
    if (userAgent && !!userAgent.appid){
        userAgent.uip = analysisReq.getClientIp(req);
        //设备唯一标识
        var SFDeviceId = req.header('SFDeviceId');
        if (SFDeviceId){
            userAgent.SFDeviceId = SFDeviceId;
        }
    }
    req.userAgent = userAgent;
    return next();
}