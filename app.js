var express = require('express');
var app = express();
global.ROOT_DIR = __dirname;

var indexRouter = require('./routes/index.js');
var weatherRouter = require('./routes/weather.js');
var hascRouter = require('./routes/hasc.js');
var globalConfigRouter = require('./routes/globalConfig.js');
var resourceRouter = require('./routes/resource.js');
var noticeMsgRouter = require('./routes/noticeMsg.js');
var placeRouter = require('./routes/place.js');
var public = require(ROOT_DIR + '/lib/public');
var checkUser = require(ROOT_DIR + '/lib/checkUser');
var feedbackRouter = require('./routes/feedback.js');
var liveListRouter = require('./routes/liveList.js');
var videoRouter = require('./routes/video.js');
var fileRouter = require('./routes/file.js');
var bodyParser = require('body-parser');
//var APNsRouter = require('./routes/APNs.js'); //推送



app.use(bodyParser.json());
if (process.env.NODE_ENV == 'production') {//正式环境才做用户验证
    app.all("/*", checkUser.checkUser);
    app.all("/*", public.parseUserAgent);
}
app.use('/', indexRouter);
app.use('/weather', weatherRouter);
app.use('/hasc', hascRouter);
app.use('/globalConfig', globalConfigRouter);
app.use('/resource', resourceRouter);
app.use('/noticeMsg', noticeMsgRouter);
app.use('/user/place', placeRouter);
app.use('/feedback', feedbackRouter);
app.use('/grab', liveListRouter); //抓取映客服务端拉流地址
app.use('/video', videoRouter);//播放视频
app.use('/data', fileRouter);//上传图片
console.log('dfdfdfd');


app.listen(3389);
console.log('server has begin listen');