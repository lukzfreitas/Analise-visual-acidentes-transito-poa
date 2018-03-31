var express = require("express");

var path = require('path');

const pg = require('pg');
const parse = require('pg-connection-string').parse;
const R = require('ramda');

var app = express();

var elasticsearch=require('elasticsearch');

var client = new elasticsearch.Client( {  
  hosts: 'localhost:9200',
  requestTimeout: 90000 
});

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.engine('html', require('ejs').renderFile);

  app.use(express.static(path.join(__dirname, 'js')));
  app.use(express.static(path.join(__dirname, 'img')));
  app.use(express.favicon(__dirname + '/images/favicon.ico'));

  app.use(express.logger());
});

const crimeTypes = {'THEFT FROM VEHICLE':0, 'THEFT OF VEHICLE': 1, 'BREAK AND ENTER':2, 'ASSAULT': 3, 'ROBBERY': 4};
app.get('/', handleDataRequest);
app.get('/:year', handleDataRequest);

function handleDataRequest(req, res) {
  res.header("Content-Type", "text/html; charset=utf-8");

  // pool.connect(function(err, client, done) {
  //   if(err) {
  //     return console.error('error fetching client from pool', err);
  //   }

  //   const currentYear = new Date().getFullYear();
  //   const requestedYear = Number(req.params.year) || currentYear;
  //   console.log(requestedYear);
  //   client.query(`SELECT * from crimes where at between '${requestedYear}-01-01'::DATE and '${requestedYear+1}-01-01'::DATE order by at`, function(err, result) {
  //     done();

  //     if(err) {
  //       return console.error('error running query', err);
  //     }

  //     const crimes = R.map((c) => {
  //       const date = new Date(c.at);
  //       return [Number(c.latitude), Number(c.longitude), crimeTypes[c.type], date.getMonth(), date.getDate()];
  //     }, result.rows);

  //     const years = R.prepend(2013, R.range(2017, currentYear+1));
  //     const data = {
  //       years: years,
  //       crimes: crimes,
  //       year: requestedYear,
  //     };
      

  client.search({
    "index": 'acidentes_transito_datapoa',
    "size": 349732,
    "from": 0,
    "body": {
      "sort" : [
        {"DATA_HORA": {"order": "asc"}}
      ],
      "query": {
        "bool": {
          "must": {
            "match": { "ANO": 2000 }
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
        return [item._source.LATITUDE, item._source.LONGITUDE, 'AUTO', date.getMonth(), date.getDate()];
      });     
      var anos = [2000];       
      data = {years: anos, crimes: acidentes, year: 2000}
      res.render('index.html', {data: data});
    }
  }); 
  
  
  //   });
  // });
}

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});