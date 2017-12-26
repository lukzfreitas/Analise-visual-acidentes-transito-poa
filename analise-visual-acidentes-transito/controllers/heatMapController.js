// var mongoose = require('mongoose');
var client = require('../connection');
var service = require('../services/service');
// var Acidentes = mongoose.model('Acidente');

module.exports.getAcidentes = function (request, response) {
  var intervaloAnos = JSON.parse("[" + request.query.anos + "]");
  client.search({
    "index": 'acidentes_transito_datapoa',
    "size": 349732,
    "from": 0,
    "body": {
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
        return { LATITUDE: item._source.LATITUDE, LONGITUDE: item._source.LONGITUDE };
      });
      service.sendJSON(response, status, acidentes);
    }
  })
}

module.exports.getAcidentesPorRegiao = function (request, response) {
  var intervaloAnos = JSON.parse("[" + request.query.anos + "]");  
  client.search({
    "index": 'acidentes_transito_datapoa',
    "size": 349732,
    "from": 0,
    "body": {
      "query": {
        "bool": {
          "must": [
            { "terms": { "ANO": intervaloAnos } },
            { "match": { "REGIAO": request.query.regiao } }
          ]
        }
      }
    }
  }, function (error, result, status) {
    if (error) {
      console.log("deu ruim no search" + error);
    } else {
      var acidentes = result.hits.hits.map(function (item) {
        return { LATITUDE: item._source.LATITUDE, LONGITUDE: item._source.LONGITUDE };
      });
      service.sendJSON(response, status, acidentes);
    }
  })
} 