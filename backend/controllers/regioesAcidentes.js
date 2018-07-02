var client = require('../connection');
var service = require('../services/service');
var limdu = require('limdu');
var brain = require('brain.js');


module.exports.total = function (request, response) {

  var filtros = [];

  var intervaloAnos = JSON.parse("[" + request.query.anos + "]");
  if (intervaloAnos.length > 0 && intervaloAnos[0] !== "") {
    filtros.push({ "terms": { "ANO": intervaloAnos } });
  }
  var fxHora = JSON.parse("[" + request.query.fxHora + "]");
  if (fxHora.length > 0 && fxHora[0] !== "") {
    filtros.push({ "terms": { "FX_HORA": fxHora } });
  }
  var condicoesTempo = request.query.condicoesTempo.split(",");
  if (condicoesTempo.length > 0 && condicoesTempo[0] !== "") {
    filtros.push({ "terms": { "TEMPO.keyword": condicoesTempo } });
  }
  var veiculos = request.query.veiculos.split(",");

  veiculos.forEach(veiculo => {
    switch (veiculo) {
      case "AUTO":
        filtros.push({ "range": { "AUTO": { "gte": 1 } } });
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
        break;
      case "ONIBUS":
        filtros.push({ "range": { "ONIBUS_URB": { "gte": 1 } } });
        filtros.push({ "range": { "ONIBUS_INT": { "gte": 1 } } });
        filtros.push({ "range": { "ONIBUS_MET": { "gte": 1 } } });
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
    "index": 'acidentes_transito_datapoa',
    "size": 349729,
    "from": 0,
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
      console.error("Erro consulta regiões" + error);
    } else {
      var cores = ["#0aa2ce", "#d1be9c", "#82b7ad", "#f7c59f", "#c7ccdb"]
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

  var veiculos = request.query.veiculos.split(",");

  veiculos.forEach(veiculo => {
    switch (veiculo) {
      case "AUTO":
        filtros.push({ "range": { "AUTO": { "gte": 1 } } });
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
        filtros.push({ "range": { "ONIBUS_URB": { "gte": 1 } } });
        filtros.push({ "range": { "ONIBUS_INT": { "gte": 1 } } });
        filtros.push({ "range": { "ONIBUS_MET": { "gte": 1 } } });
        break;
      case "BICICLETA":
        filtros.push({ "range": { "BICICLETA": { "gte": 1 } } });
        break;
      case "OUTRO":
        filtros.push({ "range": { "OUTRO": { "gte": 1 } } });
        break;
    }
  });

  var tempo, noite_dia, tipo_acidente, dia_semana, ups = 0;
  switch (parseInt(request.query.ups)) {
    case 1:
      ups = 1;
      break;
    case 5:
      ups = 0.75;
      break;
    case 13:
      ups = 0.5
      break;
    default:
      ups = 0;
  }
  switch (request.query.condicao_tempo) {
    case "CHUVOSO":
      tempo = 0;
      break;
    case "NUBLADO":
      tempo = 0.50;
      break;
    case "BOM":
      tempo = 1;
      break;
    default:
      tempo = 0;
  }
  switch (request.query.noite_dia) {
    case "DIA":
      noite_dia = 1;
      break;
    case "NOITE":
      noite_dia = 0;
      break;
    default:
      noite_dia = 0;
  }
  switch (request.query.tipo_acidente) {
    case "NAO_IDENTIFICADO":
      tipo_acidente = 0;
      break;
    case "ATROPELAMENTO":
      tipo_acidente = 0.10;
      break;
    case "CAPOTAGEM":
      tipo_acidente = 0.20;
      break;
    case "CHOQUE":
      tipo_acidente = 0.30;
      break;
    case "COLISAO":
      tipo_acidente = 0.40;
      break;
    case "EVENTUAL":
      tipo_acidente = 0.50;
      break;
    case "INCENDIO":
      tipo_acidente = 0.60;
      break;
    case "ABALROAMENTO":
      tipo_acidente = 0.70;
      break;
    case "QUEDA":
      tipo_acidente = 0.80;
      break;
    case "TOMBAMENTO":
      tipo_acidente = 0.90;
      break;
    default:
      tipo_acidente = 0;
  }
  switch (request.query.dia_semana) {
    case "SEGUNDA-FEIRA":
      dia_semana = 0.10;
      break;
    case "TERCA-FEIRA":
      dia_semana = 0.20;
      break;
    case "QUARTA-FEIRA":
      dia_semana = 0.30;
      break;
    case "QUINTA-FEIRA":
      dia_semana = 0.40;
      break;
    case "SEXTA-FEIRA":
      dia_semana = 0.50;
      break;
    case "SABADO":
      dia_semana = 0.60;
      break;
    case "DOMINGO":
      dia_semana = 0.70;
      break;
    default:
      dia_semana = 0;
  }
  var query = {
    "index": 'acidentes_transito_datapoa',
    "size": 349729,
    "from": 0,
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
      console.error("Erro consulta predição regiões" + error);
    } else {
      console.log(acidentes);
      var acidentes = result.hits.hits.map(function (item) {
        var tempo_entrada, noite_dia_entrada, tipo_acidente_entrada, dia_semana_entrada, ups_entrada = 0;
        switch (item._source.TEMPO) {
          case "CHUVOSO":
            tempo_entrada = 0;
            break;
          case "NUBLADO":
            tempo_entrada = 0.50;
            break;
          case "BOM":
            tempo_entrada = 1;
            break;
          default:
            tempo_entrada = 0;
        }
        switch (item._source.NOITE_DIA) {
          case "DIA":
            noite_dia_entrada = 1;
            break;
          case "NOITE":
            noite_dia_entrada = 0;
            break;
          default:
            noite_dia_entrada = 0;
        }
        switch (item._source.TIPO_ACID) {
          case "NAO_IDENTIFICADO":
            tipo_acidente_entrada = 0;
            break;
          case "ATROPELAMENTO":
            tipo_acidente_entrada = 0.10;
            break;
          case "CAPOTAGEM":
            tipo_acidente_entrada = 0.20;
            break;
          case "CHOQUE":
            tipo_acidente_entrada = 0.30;
            break;
          case "COLISAO":
            tipo_acidente_entrada = 0.40;
            break;
          case "EVENTUAL":
            tipo_acidente_entrada = 0.50;
            break;
          case "INCENDIO":
            tipo_acidente_entrada = 0.60;
            break;
          case "ABALROAMENTO":
            tipo_acidente_entrada = 0.70;
            break;
          case "QUEDA":
            tipo_acidente_entrada = 0.80;
            break;
          case "TOMBAMENTO":
            tipo_acidente_entrada = 0.90;
            break;
          default:
            tipo_acidente_entrada = 0;
        }
        switch (item._source.DIA_SEM) {
          case "SEGUNDA-FEIRA":
            dia_semana_entrada = 0.10;
            break;
          case "TERCA-FEIRA":
            dia_semana_entrada = 0.20;
            break;
          case "QUARTA-FEIRA":
            dia_semana_entrada = 0.30;
            break;
          case "QUINTA-FEIRA":
            dia_semana_entrada = 0.40;
            break;
          case "SEXTA-FEIRA":
            dia_semana_entrada = 0.50;
            break;
          case "SABADO":
            dia_semana_entrada = 0.60;
            break;
          case "DOMINGO":
            dia_semana_entrada = 0.70;
            break;
          default:
            dia_semana_entrada = 0;
        }
        switch (parseInt(item._source.UPS)) {
          case 1:
            ups_entrada = 1;
            break;
          case 5:
            ups_entrada = 0.75;
            break;
          case 13:
            ups_entrada = 0.5
            break;
          default:
            ups_entrada = 0;
        }
        return {
          input: {
            TEMPO: tempo_entrada,
            NOITE_DIA: noite_dia_entrada,
            TIPO_ACID: tipo_acidente_entrada,
            DIA_SEM: dia_semana_entrada,
            UPS: ups_entrada
          },
          output: { [item._source.REGIAO]: 1 }
        }
      });
      var net = new brain.NeuralNetwork();
      net.train(acidentes, {
        // Defaults values --> expected validation
        iterations: 20000,    // the maximum times to iterate the training data --> number greater than 0
        errorThresh: 0.005,   // the acceptable error percentage from training data --> number between 0 and 1
        log: false,           // true to use console.log, when a function is supplied it is used --> Either true or a function
        logPeriod: 10,        // iterations between logging out --> number greater than 0
        learningRate: 0.3,    // scales with delta to effect training rate --> number between 0 and 1
        momentum: 0.1,        // scales with next layer's change value --> number between 0 and 1
        callback: null,       // a periodic call back that can be triggered while training --> null or function
        callbackPeriod: 10,   // the number of iterations through the training data between callback calls --> number greater than 0
        timeout: Infinity     // the max number of milliseconds to train for --> number greater than 0
      });
      var output = net.run({ TEMPO: tempo, NOITE_DIA: noite_dia, TIPO_ACID: tipo_acidente, DIA_SEM: dia_semana, UPS: ups });
      var cores = ["#FE9A2E", "#5882FA", "#3ADF00", "#4C0B5F", "#1B2A0A"];
      var resultado = Object.keys(output).map(function (item, index) {
        return { key: item, y: output[item], color: cores[index] };
      });

      service.sendJSON(response, status, resultado);
    }
  })
}
