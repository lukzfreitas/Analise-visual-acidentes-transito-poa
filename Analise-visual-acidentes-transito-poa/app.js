'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
require('./db');
var routeapi = require('./routes/api');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use('/api', routeapi);
app.use(express.static('./src'));
app.use(express.static('./node_modules'));

var server = app.listen(8080, function () {
    console.log('Express disponível em ' + server.address().port);
});