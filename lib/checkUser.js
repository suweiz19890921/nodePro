function checkUser (req, res, next) {
    var auth = req.header('Authorization');
    if (!/Basic\s/.test(auth)) { //Basic 打头的字符串
        console.log('UNAUTHORIZED');
        return res.status(401).jsonp({code: 401000});
    }
    auth = auth.replace(/Basic\s/, '');
    auth = Buffer.from(auth, 'base64').toString('utf8');
    if (!/:/.test(auth)) { //验证分隔符
        console.log('UNAUTHORIZED');
        return res.status(401).jsonp({code: 401000});
    }
    auth = auth.split(':');
    if (auth.length < 3) {
        console.log('UNAUTHORIZED');
        return res.status(401).jsonp({code: getErrorCode("UNAUTHORIZED")})
    }
    var userno = parseInt(auth[0]);
    var accessToken = auth[1];
    var appid = auth[2];
    if (!(/(WorldTide)/.test(appid) || /(GlobalTide)/.test(appid) || /(huashenEdu)/.test(appid) )) { //验证 APPID
        console.log('Authorization appid = ' + appid);
        return res.status(401).jsonp({code: 401000});
    }
    next();
}
module.exports.checkUser = checkUser;