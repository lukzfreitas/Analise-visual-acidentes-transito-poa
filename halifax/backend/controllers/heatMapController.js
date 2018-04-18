var client = require('../connection');
var service = require('../services/service');

module.exports.getAcidentes = function (request, response) {
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
    console.log(result);
    if (error) {
      console.log("deu ruim no search" + error);
    } else {
      var acidentes = result.hits.hits.map(function (item) {
        return item._source;
      });
      service.sendJSON(response, status, acidentes);
    }
  })
}

module.exports.qtdPorRegiao = function (request, response) {
  client.search({
    "index": 'acidentes_transito_datapoa',
    "size": 0,
    "body": {
      "aggregations": {
        "REGIAO.keyword": {
          "terms": {
            "field": "REGIAO.keyword"
          }
        }
      }
    }
  }, function (error, result, status) {
    if (error) {
      console.log('deu ruim no search', error);
    } else {
      var regioes = result.aggregations["REGIAO.keyword"].buckets.map(function (item) {
        return { key: item.key, y: item.doc_count }
      });
      console.log(regioes);
      service.sendJSON(response, status, regioes);
    }
  });
}
  module.exports.qtdFeridosEMortos = function (request, response) {
    client.search({
      "index": 'acidentes_transito_datapoa',
      "size": 0,
      "body": {
        "aggregations": {
          "REGIAO.keyword": {
            "terms": {
              "field": "REGIAO.keyword"
            }
          }
        }
      }
    }, function (erro, result, status) {
      if (error) {
        console.log('deu ruim no search', error);
      } else {
        var regioes = result.aggregations["REGIAO.keyword"].buckets.map(function (item) {
          return { key: item.key, y: item.doc_count }
        });
        console.log(regioes);
        service.sendJSON(response, status, regioes);
      }
    });
  }
