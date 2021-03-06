/**
 * Created by suwei on 2019/7/5.
 */
var express = require('express');
var router = express.Router();
var multer = require('multer');
var untilTool = require(ROOT_DIR +'/lib/untilTool.js');
var client = require(ROOT_DIR + '/lib/clientTidePg.js');
var analysisReq = require(ROOT_DIR + '/lib/analysisReqParams.js');
var config = require(ROOT_DIR + '/lib/config.js');
var pathLib = require("path");
var fs = require("fs");

// 上传文件

var nginx_path;

if (process.env.NODE_ENV == 'production') {
    nginx_path = config['product_nginx_image_path'];
} else {
    nginx_path = config['test_nginx_image_path'];
}

var uploadFile = multer({dest: nginx_path.image_dir}).single('filepath');
var uploadImport = multer({storage: multer.memoryStorage(), limits: {fileSize: 10 * 1024 * 1024}});

router.post('/addfile', function (req, res) {
    console.log('xiang ying qing qiu 1');
    uploadFile(req, res, function(err) {
        console.log('xiang ying qing qiu 2');
        var param = analysisReq.getReqParams(req);
        var file = req.file;

        param.name = file.originalname;
        if (file.originalname.lastIndexOf('.') == -1) {
            param.fileSuffix = file.originalname;
        } else {
            param.fileSuffix = file.originalname.substring(file.originalname.lastIndexOf('.'));
        }
        param.folder = file.destination;
        param.filename = file.filename;
        param.property = file;
        console.log('file add')
        console.log(JSON.stringify(param));
        var pathNew = req.file.path + pathLib.parse(req.file.originalname).ext;
        fs.rename(req.file.path, pathNew, function (err) {
            if (err) {
                res.json({
                    code : 405,
                    data : {'message' : '文件上传失败'}
                })
            } else {
                var tempUrl = nginx_path.image_url + req.file.filename + pathLib.parse(req.file.originalname).ext;
                console.log('tempUrl = ' + tempUrl);
                res.json({
                    code : 200,
                    data : {'url' : tempUrl}
                })
            }
        });


        //上库
        //client.callTidePg('pkg_data.file_add_edit', param, function (ret) {
        //    ret = untilTool.changeJson(ret);
        //    if (!!ret && ret.code == 200) {
        //        res.json(ret);
        //    } else {
        //        res.json(ret);
        //    }
        //})
    })


});

router.post('/syncProduct', function (req, res) {
    console.log('welcome product');
    var str_json = JSON.stringify(req.body);
    var file = pathLib.join(__dirname, 'product.json');
    if(req.body['username'] == 'suzhangbao') {
        console.log('有值为' +  req.body['username']);
        fs.writeFile(file, str_json, 'utf8', function(){
            // 保存完成后的回调函数
            console.log("保存完成");
            res.json({
                code : 200,
                data : {'message' : '同步产品成功'}
            })
        });
    } else  {
        res.json({
            code : 400,
            data : {'message' : '同步产品失败'}
        })
    }


});

router.get('/getAllProduct', function (req, res) {
    console.log('welcome get all product');
    var file = pathLib.join(__dirname, 'product.json');
    fs.readFile(file, 'utf-8', function(err, data) {
        if (err) {
            console.log('读取文件失败');
            console.log(file);
            res.json({
                code : 400,
                message : '读取产品文件失败'
            })
        } else {
            console.log('读取文件成功');
            res.json({
                code : 200,
                data : {'allList' : data}
                //data : {'allList' : ''}//先返回空串 等需要的时候打开即可
            })
        }
    });
});






module.exports = router;