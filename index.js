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


// app.all('/*',function (req, res, next) {
// 	// body...
// 	console.log('hello world ');
// 	return next();
// });
app.all("/*", public.parseUserAgent);
app.use('/', indexRouter);
app.use('/weather', weatherRouter);
app.use('/hasc', hascRouter);
app.use('/globalConfig', globalConfigRouter);
app.use('/resource', resourceRouter);
app.use('/noticeMsg', noticeMsgRouter);
app.use('/user/place', placeRouter);



app.listen(80);
console.log('server has begin listen');