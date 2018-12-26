var express = require('express');
var app = express();
global.ROOT_DIR = __dirname;

var indexRouter = require('./routes/index.js');
var weatherRouter = require('./routes/weather.js');
var hascRouter = require('./routes/hasc.js');
var globalConfigRouter = require('./routes/globalConfig.js');
var resourceRouter = require('./routes/resource.js');
var noticeMsgRouter = require('./routes/noticeMsg.js');

app.use('/', indexRouter);
app.use('/weather', weatherRouter);
app.use('/hasc', hascRouter);
app.use('/globalConfig', globalConfigRouter);
app.use('/resource', resourceRouter);
app.use('/noticeMsg', noticeMsgRouter);


app.listen(80);
console.log('server has begin listen');