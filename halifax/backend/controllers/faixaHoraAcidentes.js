var client = require('../connection');
var service = require('../services/service');
var limdu = require('limdu');

module.exports.total = function (request, response) {
    var filtros = [];
    var intervaloAnos = JSON.parse("[" + request.query.anos + "]");
    if (intervaloAnos.length > 0 && intervaloAnos[0] !== "") {
        filtros.push({ "terms": { "ANO": intervaloAnos } });
    }    
    var condicoesTempo = request.query.condicoesTempo.split(",");
    if (condicoesTempo.length > 0 && condicoesTempo[0] !== "") {
        filtros.push({ "terms": { "TEMPO.keyword": condicoesTempo } });
    }    

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
                "FX_HORA": {
                    "terms": {
                        "field": "FX_HORA.keyword",
                        "size": 24
                    }
                }
            }
        }
    }    

    client.search(query, function (error, result, status) {
        if (error) {
            console.log("deu ruim no search" + error);
        } else {
            var acidentes = result.aggregations["FX_HORA"].buckets.map(function (item) {
                return [parseInt(item.key), parseInt(item.doc_count)];
            });
            result = [{"key": "Quantity", "bar": true, "values": acidentes, "color": "#2ECCFA"}];                        
            service.sendJSON(response, status, result);                       
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
                    output: item._source.FX_HORA
                }
            });            
            var classifier = new limdu.classifiers.Bayesian();
            classifier.trainBatch(acidentes);                        
            var classify = classifier.classify({ MES: mes, DIA: dia, FX_HORA: fxHora }, 1);            
            var values = classify.explanation.map(function (item) {                                
                var index = item.substring(0, item.indexOf(":"));
                var value = parseFloat(item.substring(item.indexOf(index) + index.length + 1));                
                return [index, value];
            });            
            resultado = [{"key": "Quantity", "bar": true, "values": values, "color": "#5F04B4"}];
            service.sendJSON(response, status, resultado);
        }
    })
}