var client = require('../connection');
var service = require('../services/service');

module.exports.getAcidentes = function (request, response) {
  var intervaloAnos = JSON.parse("[" + request.query.anos + "]");
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
        return { LATITUDE: item._source.LATITUDE, LONGITUDE: item._source.LONGITUDE };
      });
      service.sendJSON(response, status, acidentes);
    }
  })
}

module.exports.getQtdAcidentesPorRegiao = function (request, response) {    
  var intervaloAnos = JSON.parse("[" + request.query.anos + "]");
  console.log(request.query.regiao);
  console.log(intervaloAnos);
  client.search({
    "index": 'acidentes_transito_datapoa_id',
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
      console.log(result.hits.total);
      service.sendJSON(response, status, result.hits.total);
    }
  })
}

module.exports.getAcidentesPorRegiao = function (request, response) {
  var intervaloAnos = JSON.parse("[" + request.query.anos + "]");
  client.search({
    "index": 'acidentes_transito_datapoa_id',
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
        return { LATITUDE: item._source.LATITUDE, LONGITUDE: item._source.LONGITUDE, ID: item._source.ID };
      });
      service.sendJSON(response, status, acidentes);
    }
  });
}

module.exports.acidentesLocaisErrados = function (request, response) {
  client.search({
    "index": 'acidentes_transito_datapoa_id',
    "size": 349732,
    "from": 0,
    "body": {
      "query": {
        "bool": {
          "must": {
            "match": { "REGIAO": "CENTRO" }
          },
          "filter": {
            "range": { "LATITUDE": { "gte": -30.020 } }
          }
        }
      }
    }
  }, function (error, result, status) {
    if (error) {
      console.log("deu ruim no search" + error);
    } else {
      var acidentes = result.hits.hits.map(function (item) {
        return { LATITUDE: item._source.LATITUDE, LONGITUDE: item._source.LONGITUDE, ID: item._source.ID };
      });
      service.sendJSON(response, status, acidentes);
    }
  })
} 