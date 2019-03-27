
var pg = require('pg');
var until = require(ROOT_DIR + '/lib/untilTool.js');
var config = require(ROOT_DIR + '/lib/config.js');

function callTidePg(select, data, cb) {
    // body...
   var date = new Date();//.转换成毫秒
   if (data) {
    var url = data.originalUrl;
   }
    if (/^select|^update|^insert|^delete|^refresh/i.test(select)) {
        //直接执行sql数据查询操作
        query(select, data, function (err, ret) {
            // body...
            if (err || (ret.code != undefined && ret.code != 0)) {
                console.log('error happen ' + err.message);
            }
            cb(ret);
        });
    } else {
        if (data&& !/^\(/.test(data)) {
            // data = "(('"+ JSON.stringify(data).replace(/(\')/g, "'||chr(39)||'") + "')::json)";
            data = "(('" + JSON.stringify(data).replace(/(\')/g, "'||chr(39)||'") + "')::json)";
        } else {
            data = "()";
        }
        callFun(select, data, function (err, ret) {
            if (err || (ret.code != undefined && ret.code != 0)) {
                console.log('----------------------------------------------------------------------');
                console.log('url ' + url + '\ndate = ' + date + '\n查询报错 ' + err.message);
                console.log('----------------------------------------------------------------------');
            } else {
                console.log('----------------------------------------------------------------------');
                console.log('url ' + url + '\ndate = ' + date + '\nselect = ' + select + "\nret = " + JSON.stringify(ret));
                console.log('----------------------------------------------------------------------');
            }
            cb(ret);
        });

    }
}


function callFun(select, data, cb) {
    // body...
    var ret = {err: 500};
    var code;
    var pgConfig;
    if (process.env.NODE_ENV == 'production') {
        pgConfig = config['productConfig'];
    } else {
        pgConfig = config['testPgconfig'];
    }
    var pgPool = new pg.Pool(pgConfig);
        pgPool.connect(function (error, client, done) {
        if (error) {
            done();
            cb(error, {code:500});
            console.log('connect query:' + error.message);
            return;
        }
        //开始调用数据库方法
        var sqlString = "select " + select + data;
        console.log(sqlString);
        client.query(sqlString, function (err, rows) {
            // body...
            done();
            if (err) {
                var dbError = err.stack.substr(6, err.stack.indexOf('\n') - 1);
                console.log("database error: ", err.stack);
                try {
                    dbError = JSON.parse(dbError);
                } catch (e) {
                }
                if (!!dbError) {
                    ret = dbError;
                } else {
                    ret = {code: errors.INTERNAL_SERVER_ERROR};
                }
            } else if (rows && rows.rows && rows.rows[0]) {
                ret = rows.rows[0][select.substr(select.indexOf(".") + 1)];
                if (!!ret && ret != 'null' && typeof ret == 'string') {
                    try{
                        ret = JSON.parse(ret);
                    } catch (e) {
                        err = e;
                        ret = {code: 500};
                    }
                }
                var data = until.changeJson(ret);
                if (!!data && !! data.data) {
                    ret = data;
                } else {
                    code = data.code || 0;
                    delete data.code;
                    if (Object.keys(data).length > 0) {
                        ret = {code : code, data: data};
                    } else {
                        ret = {code: 0};
                    }
                }
            }
            cb(err, ret);
            
        });
    });

}


function query(select, data, cb) {
    // body...
    var ret = {code:500};
    if (process.env.NODE_ENV == 'production') {
        pgConfig = config['productConfig'];
    } else {
        pgConfig = config['testPgconfig'];
    }
    var pgPool = new pg.Pool(pgConfig);
    pgPool.connect(function (error, client, done) {
        if (error) {
            done();
            cb(error, {code:500});
            console.log('connect query:' + error.message);
            return;
        }
        //开始查询
        client.query(select, data, function (err, rows) {
            // body...
            done();
            if (err) {
                ret = {code: 500};
            } else if (/^select/gi.test(select) && rows && rows.rows) {
                ret = {code: 0, data: until.changeJson(rows.rows)};
            } else if (/^update|^insert|^delete/i.test(select)) {
                ret = {code: 0, data:{count: rows.rowCount}};
            } else if (/^refresh/i.test(select)) {
                ret = {code: 0};
            }
            cb(err, ret);
        });
    });
}

module.exports.callTidePg = callTidePg;

callTidePg('SELECT * FROM "public"."solot_points" LIMIT 10 OFFSET 0',null,function (ret) {
    // body...
    console.log(ret);
});

// /*
//  * 使用连接池
//  * */
// function connectPgWithPool() {
//     var pgConfig = {
//         user: 'suwei',
//         database: 'wade_tide',
//         password: '123456',
//         host: '127.0.0.1',
//         port: '5432',
//         poolSize: 5,
//         poolIdleTimeout: 30000,
//         reapIntervalMillis: 10000
//     };
//     var pgPool = new pg.Pool(pgConfig);
//     // var pgPool = new pgOpt.pools.getOrCreate(pgConfig);// 低版本的pg模块需要这样来创建连接池
    
//     pgPool.connect(function (error, client, done) {
//         if (error) {
//             console.log('connect query:' + error.message);
//             return;
//         }
//        var sqlSel = 'select wade_module_version.get_new_version()';
//        var select = 'wade_module_version.get_new_version';
//         client.query(sqlSel, [], function (errors, rows) {
//         if (errors) {
//             done();
//             console.log('error happen' + errors.message);
//             return;
//         } else {
//         	console.log('query success original data is' + JSON.stringify(rows));
//         	console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
//         	ret = rows.rows[0][select.substr(select.indexOf(".") + 1)];
//         	ret = JSON.stringify(ret);
//             console.log('query success, data is: ' + ret);
//             console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
//             }
//         });
//     });
// }

// connectPgWithPool();


// {"lo0":[{"address":"127.0.0.1","netmask":"255.0.0.0","family":"IPv4","mac":"00:00:00:00:00:00","internal":true,"cidr":"127.0.0.1/8"},
// {"address":"::1","netmask":"ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff","family":"IPv6","mac":"00:00:00:00:00:00","scopeid":0,"internal":true,"cidr":"::1/128"},
// {"address":"fe80::1","netmask":"ffff:ffff:ffff:ffff::","family":"IPv6","mac":"00:00:00:00:00:00","scopeid":1,"internal":true,"cidr":"fe80::1/64"}],
// "en1":[{"address":"fe80::c6b:9b72:1f56:ed35","netmask":"ffff:ffff:ffff:ffff::","family":"IPv6","mac":"00:00:00:00:00:00","scopeid":8,"internal":false,"cidr":"fe80::c6b:9b72:1f56:ed35/64"},
// {"address":"192.168.2.17","netmask":"255.255.255.0","family":"IPv4","mac":"00:00:00:00:00:00","internal":false,"cidr":"192.168.2.17/24"}],
// "awdl0":[{"address":"fe80::98c4:ddff:fe1f:9a86","netmask":"ffff:ffff:ffff:ffff::","family":"IPv6","mac":"00:00:00:00:00:00","scopeid":10,"internal":false,"cidr":"fe80::98c4:ddff:fe1f:9a86/64"}],
// "en5":[{"address":"fe80::456:b5e:afd2:ba9a","netmask":"ffff:ffff:ffff:ffff::","family":"IPv6","mac":"00:00:00:00:00:00","scopeid":11,"internal":false,"cidr":"fe80::456:b5e:afd2:ba9a/64"},
// {"address":"169.254.55.160","netmask":"255.255.0.0","family":"IPv4","mac":"00:00:00:00:00:00","internal":false,"cidr":"169.254.55.160/16"}],
// "utun0":[{"address":"fe80::62f7:fb22:b914:41ab","netmask":"ffff:ffff:ffff:ffff::","family":"IPv6","mac":"00:00:00:00:00:00","scopeid":15,"internal":false,"cidr":"fe80::62f7:fb22:b914:41ab/64"}],
// "utun1":[{"address":"fe80::2e16:6420:fb:bba8","netmask":"ffff:ffff:ffff:ffff::","family":"IPv6","mac":"00:00:00:00:00:00","scopeid":16,"internal":false,"cidr":"fe80::2e16:6420:fb:bba8/64"}],
// "utun2":[{"address":"fe80::92d2:4d46:4c76:24c5","netmask":"ffff:ffff:ffff:ffff::","family":"IPv6","mac":"00:00:00:00:00:00","scopeid":17,"internal":false,"cidr":"fe80::92d2:4d46:4c76:24c5/64"}]}
// var os = require("os");
// var localHost1,localHost127,internetHost;//内网,127,外网
// var hostName = os.hostname();
// var interfaces = os.networkInterfaces();
// for (var devName in interfaces) {
//     var iface = interfaces[devName];
//     for (var i = 0; i < iface.length; i++) {
//         var ifaceArray = iface[i];
//         //logger.trace("ifaceArray:%j",ifaceArray)
//         if (ifaceArray.family === 'IPv4') {
//             var ipAddress = ifaceArray.address;
//             if (ipAddress === '127.0.0.1' && ifaceArray.internal) {
//                 localHost127 = ipAddress;
//             } else if (!ifaceArray.internal) {
//                 if (ipAddress.indexOf('10.') == 0 ||
//                     /*ipAddress.indexOf('172.') == 0 ||*/ipAddress.indexOf('11.') == 0 ||
//                     ipAddress.indexOf('192.') == 0 ||ipAddress.indexOf('100.') == 0){
//                     localHost1 = ifaceArray.address;
//                 }else {
//                     internetHost = ipAddress;
//                 }
//             }
//         }
//     }
// }
// console.log('localHost1,localHost127,internetHost' + localHost1 + localHost127 + internetHost);



//app.use(morgan(localip + '\t:proxy\t' + appname + '\t:remote-addr\t:host\t:userno\t:date[iso]\t:path\t:query-method\t:request-body\t:request-query\t:request-params\t:authorization\t:user-agent\t:method\t:url\t
//	:status\t:res[content-length]\t:response-time', {stream: logfile}));



































// var pg = require('pg');

// /*
//  * 使用连接池
//  * */
// function connectPgWithPool() {
//     var pgConfig = {
//         user: 'suwei',
//         database: 'wade_tide',
//         password: '123456',
//         host: '127.0.0.1',
//         port: '5432',
//         poolSize: 5,
//         poolIdleTimeout: 30000,
//         reapIntervalMillis: 10000
//     };
//     var pgPool = new pg.Pool(pgConfig);
//     // var pgPool = new pgOpt.pools.getOrCreate(pgConfig);// 低版本的pg模块需要这样来创建连接池
    
//     pgPool.connect(function (error, client, done) {
//         if (error) {
//             console.log('connect query:' + error.message);
//             return;
//         }
//        var sqlSel = 'select wade_module_version.get_new_version()';
//        var select = 'wade_module_version.get_new_version';
//         client.query(sqlSel, [], function (errors, rows) {
//             if (errors) {
//             done();
//             console.log('error happen' + errors.message);
//             return;
//         } else {
//         	console.log('query success original data is' + JSON.stringify(rows));
//         	console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
//         	ret = rows.rows[0][select.substr(select.indexOf(".") + 1)];
//         	ret = JSON.stringify(ret);
//             console.log('query success, data is: ' + ret);
//             console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
//             }
//         });
//     });
// }

// connectPgWithPool();