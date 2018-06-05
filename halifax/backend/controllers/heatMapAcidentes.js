var express = require("express");
var client = require('../connection');
var service = require('../services/service');
var app = express();



module.exports.populate = function (request, response) {    

    var intervaloAnos = JSON.parse("[" + request.query.anos + "]");

    client.search({
        "index": 'acidentes_transito_datapoa',
        "size": 349732,
        "from": 0,
        "body": {
            "sort": [
                { "DATA_HORA": { "order": "asc" } }
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
            var anos = [];
            for (var i = 2000; i < 2016; i++) {
                anos.push(i);
            }            
            data = { years: anos, crimes: acidentes, year: 2000 }                        
            response.render('index.html', { data: data });
        }
    });
}