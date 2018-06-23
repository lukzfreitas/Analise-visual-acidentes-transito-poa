var express = require("express");
var path = require('path');
const pg = require('pg');
const parse = require('pg-connection-string').parse;
const R = require('ramda');
require('./backend/connection');

var app = express();

var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client( {  
  hosts: 'localhost:9200',
  requestTimeout: 90000 
});

var routeapi = require('./backend/routes/api');
app.use('/api', routeapi);

app.set('views', __dirname + '/frontend/views');
app.engine('html', require('ejs').renderFile);  

app.use(express.static(path.join(__dirname, '/frontend/controllers')));
app.use(express.static(path.join(__dirname, '/frontend/services')));  
app.use(express.static(path.join(__dirname, '/frontend/js')));
app.use(express.static(path.join(__dirname, '/frontend/img')));  
app.use('/bower_components',  express.static(__dirname + '/frontend/bower_components'));
app.use(express.static('./node_modules'));   

// app.get('/');
app.get('/', handleDataRequest);
app.get('/:year', handleDataRequest);

function handleDataRequest(req, res) {
  res.header("Content-Type", "text/html; charset=utf-8");

  var ano1 = 2000;  
  var intervaloAnos = [ano1];

  client.search({
    "index": 'acidentes_transito_datapoa',
    "size": 349732,
    "from": 0,
    "body": {      
      "sort" : [
        {"DATA_HORA": {"order": "asc"}}
      ],
      "query": {
        "constant_score": {
          "filter": {
            "terms": {
              "ANO": intervaloAnos
            }
          }
        }
      }
    }
  }, function (error, result, status) {    
    if (error) {
      console.log("deu ruim no search" + error);
    } else {
      var acidentes = result.hits.hits.map(function (item) {                
        var date = new Date(item._source.DATA_HORA);
        return [item._source.LATITUDE, item._source.LONGITUDE, item._source.TIPO_ACID, date.getMonth(), date.getDate()];
      });     
      var anos = [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016];       
      data = {years: anos, crimes: acidentes, year: 2000}      
      console.log(data);
      res.render('index.html', {data: data});
    }
  });
      // data = {};
      // res.render('index.html', {data: data});
}

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});