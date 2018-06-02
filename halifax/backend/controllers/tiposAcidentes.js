var client = require('../connection');
var service = require('../services/service');
var limdu = require('limdu');

module.exports.total = function (request, response) {
    var intervaloAnos = JSON.parse("[" + request.query.anos + "]");
    var fxHora = JSON.parse("[" + request.query.fxHora + "]");
    var condicoesTempo = request.query.condicoesTempo.split(",");
    var veiculos = request.query.veiculos.split(",");
    var filtros = [
        { "terms": { "ANO": intervaloAnos } },
        { "terms": { "FX_HORA.keyword": fxHora } },
        { "terms": { "TEMPO.keyword": condicoesTempo } }
    ];
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
                "TIPO_ACID.keyword": {
                    "terms": {
                        "field": "TIPO_ACID.keyword"
                    }
                }
            }
        }
    }

    client.search(query, function (error, result, status) {
        if (error) {
            console.log("deu ruim no search" + error);
        } else {
            var tiposDeAcidentes = result.aggregations["TIPO_ACID.keyword"].buckets.map(function (item) {
                return { label: item.key, value: item.doc_count }
            });
            resultado = [{ "key": "Tipos de acidentes", "color": "#1f77b4", "values": tiposDeAcidentes }];
            service.sendJSON(response, status, resultado);
        }
    });
}

module.exports.predicao = function (request, response) {
    var intervaloAnos = JSON.parse("[" + request.query.anos + "]");
    var fxHora = JSON.parse("[" + request.query.fxHora + "]");
    var condicoesTempo = request.query.condicoesTempo.split(",");
    var veiculos = request.query.veiculos.split(",");
    var mes = request.query.mes;
    var dia = request.query.dia;
    var filtros = [
        { "terms": { "ANO": intervaloAnos } },
        { "terms": { "FX_HORA.keyword": fxHora } },
        { "terms": { "TEMPO.keyword": condicoesTempo } }
    ];
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
            console.log("deu ruim no search" + error);
        } else {
            var acidentes = result.hits.hits.map(function (item) {
                return {
                    input: {
                        MES: item._source.MES,
                        DIA: item._source.DIA,
                        FX_HORA: parseInt(item._source.FX_HORA)
                    },
                    output: item._source.TIPO_ACID
                }
            });
            var classifier = new limdu.classifiers.Bayesian();
            classifier.trainBatch(acidentes);
            var classify = classifier.classify({ MES: mes, DIA: dia, FX_HORA: fxHora }, 1);
            var values = classify.explanation.map(function (item) {
                var index = item.substring(0, item.indexOf(":"));
                var value = parseFloat(item.substring(item.indexOf(index) + index.length + 1));
                return { label: index, value: value }
            });
            resultado = [{ "key": "Tipos de acidentes", "color": "#1f77b4", "values": values }]
            service.sendJSON(response, status, resultado);
        }
    })
}