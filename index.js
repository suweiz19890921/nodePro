var express = require('express');
var app = express();

var indexRouter = require('./routes/index.js');
var weatherRouter = require('./routes/weather.js');
var hascRouter = require('./routes/hasc.js');
var appReviewRouter = require('./routes/appReviewStatu.js');
var globalConfigRouter = require('./routes/globalConfig.js');


app.use('/', indexRouter);
app.use('/weather', weatherRouter);
app.use('/hasc', hascRouter);
app.use('/globalConfig', globalConfigRouter);
app.use('/appReviewStatu', appReviewRouter);


app.listen(3000);