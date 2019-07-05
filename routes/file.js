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
var uploadFile = multer({dest: 'public/upload/'});
var uploadImport = multer({storage: multer.memoryStorage(), limits: {fileSize: 10 * 1024 * 1024}});

router.post('/addfile', function (req, res) {
    uploadFile.single('filepath')
        var param = util.wrapParams(req);
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

        client.callTidePg('pkg_data.file_add_edit', param, function (ret) {
            ret = untilTool.changeJson(ret);
            if (!!ret && ret.code == 200) {
                res.json(ret);
            } else {
                res.json(ret);
            }
    })
});