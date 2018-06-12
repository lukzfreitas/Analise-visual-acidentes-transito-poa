var client = require('../connection');
var service = require('../services/service');
var limdu = require('limdu');

module.exports.total = function (request, response) {
  var filtros = [];
  var intervaloAnos = JSON.parse("[" + request.query.anos + "]");
  if (intervaloAnos.length > 0 && intervaloAnos[0] !== "") {
    filtros.push({ "terms": { "ANO": intervaloAnos } });
  }
  var fxHora = JSON.parse("[" + request.query.fxHora + "]");
  if (fxHora.length > 0 && fxHora[0] !== "") {
    filtros.push({ "terms": { "FX_HORA.keyword": fxHora } });
  }
  var condicoesTempo = request.query.condicoesTempo.split(",");
  if (condicoesTempo.length > 0 && condicoesTempo[0] !== "") {
    filtros.push({ "terms": { "TEMPO.keyword": condicoesTempo } });
  }
  var mes = request.query.mes;
  var dia = request.query.dia;
  var fxHora = request.query.fxHora;

  var veiculos = request.query.veiculos.split(",");

  veiculos.forEach(veiculo => {
    switch (veiculo) {
      case "AUTOMOVEL":
        filtros.push({ "range": { "AUTOMOVEL": { "gte": 1 } } });
        break;
      case "MOTO":
        filtros.push({ "range": { "MOTO": { "gte": 1 } } });
        break;
      case "CAMINHAO":
        filtros.push({ "range": { "CAMINHAO": { "gte": 1 } } });
        break;
      case "TAXI":
        filtros.push({ "range": { "TAXI": { "gte": 1 } } });
        break;
      case "LOTACAO":
        filtros.push({ "range": { "LOTACAO": { "gte": 1 } } });
        break
      case "ONIBUS":
        filtros.push({ "range": { "ONIBUS": { "gte": 1 } } });
        break;
      case "BICICLETA":
        filtros.push({ "range": { "BICICLETA": { "gte": 1 } } });
        break;var cores = ["#0aa2ce", "#d1be9c", "#82b7ad", "#f7c59f", "#c7ccdb"];
      case "OUTRO":
        filtros.push({ "range": { "OUTRO": { "gte": 1 } } });
        break;
    }
  });


  var query = {
    "index": 'acidentes_transito_datapoa_new_2',
    //"size": 349729,
    //"from": 0,
    "body": {
      "sort": [
        { "DATA_HORA": { "order": "asc" } }
      ],
      "query": {
        "bool": {
          "must": filtros
        }
      },
      "aggregations": {
        "REGIAO": {
          "terms": {
            "field": "REGIAO.keyword"
          }
        }
      }
    }
  }

  client.search(query, function (error, result, status) {
    if (error) {
      console.log("deu ruim no search" + error);
    } else {
      var cores = ["#73578e", "#a25e67", "#e1dd8f", "#4c86a8", "#2e4d5c"];
      var regioes = result.aggregations["REGIAO"].buckets.map(function (item, index) {
        return { key: item.key, y: item.doc_count, color: cores[index] }
      });
      service.sendJSON(response, status, regioes);
    }
  });
}

module.exports.predicao = function (request, response) {

  var filtros = [];
  var intervaloAnos = JSON.parse("[" + request.query.anos + "]");
  if (intervaloAnos.length > 0 && intervaloAnos[0] !== "") {
    filtros.push({ "terms": { "ANO": intervaloAnos } });
  }
  var condicoesTempo = request.query.condicoesTempo.split(",");
  if (condicoesTempo.length > 0 && condicoesTempo[0] !== "") {
    filtros.push({ "terms": { "TEMPO.keyword": condicoesTempo } });
  }
  var mes = request.query.mes;
  var dia = request.query.dia;
  var fxHora = request.query.fxHora;

  var veiculos = request.query.veiculos.split(",");

  veiculos.forEach(veiculo => {
    switch (veiculo) {
      case "AUTOMOVEL":
        filtros.push({ "range": { "AUTOMOVEL": { "gte": 1 } } });
        break;
      case "MOTO":
        filtros.push({ "range": { "MOTO": { "gte": 1 } } });
        break;
      case "CAMINHAO":
        filtros.push({ "range": { "CAMINHAO": { "gte": 1 } } });
        break;
      case "TAXI":
        filtros.push({ "range": { "TAXI": { "gte": 1 } } });
        break;
      case "LOTACAO":
        filtros.push({ "range": { "LOTACAO": { "gte": 1 } } });
        break
      case "ONIBUS":
        filtros.push({ "range": { "ONIBUS": { "gte": 1 } } });
        break;
      case "BICICLETA":
        filtros.push({ "range": { "BICICLETA": { "gte": 1 } } });
        break;
      case "OUTRO":
        filtros.push({ "range": { "OUTRO": { "gte": 1 } } });
        break;
    }
  });

  var query = {
    "index": 'acidentes_transito_datapoa_new_2',
    //"size": 349729,
    //"from": 0,
    "body": {
      "query": {
        "bool": {
          "must": filtros
        }
      }
    }
  }

  client.search(query, function (error, result, status) {
    if (error) {
      console.log("deu ruim no search" + error);
    } else {
      var acidentes = result.hits.hits.map(function (item) {
        return {
          input: {
            MES: item._source.MES,
            DIA: item._source.DIA,
            FX_HORA: parseInt(item._source.FX_HORA)
          },
          output: item._source.REGIAO
        }
      });

      var classifier = new limdu.classifiers.Bayesian();
      classifier.trainBatch(acidentes);
      var classify = classifier.classify({ MES: mes, DIA: dia, FX_HORA: fxHora }, 1);
      var cores = ["#FE9A2E", "#5882FA", "#3ADF00", "#4C0B5F", "#1B2A0A"];
      var resultado = classify.explanation.map(function (item, index) {
        var index = item.substring(0, item.indexOf(":"));
        var value = parseFloat(JSON.stringify(eval("{" + item + "}")));
        return { key: index, y: value, color: cores[index] }
      });
      service.sendJSON(response, status, resultado);
    }
  })
}