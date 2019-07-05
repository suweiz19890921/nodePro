/**
 * Created by suwei on 2019/7/5.
 */
var express = require('express');
var router = express.Router();
var multer = require('multer');
var untilTool = require(ROOT_DIR +'/lib/untilTool.js');
var client = require(ROOT_DIR + '/lib/clientTidePg.js');
var analysisReq = require(ROOT_DIR + '/lib/analysisReqParams.js');

// 上传文件
var uploadFile = multer({dest: 'public/upload/'}).single('filepath');
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

        var url = '/upload/' + req.file.filename
        res.json({
            code : 200,
            data : url
        })

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

module.exports = router;