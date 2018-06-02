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
        { "terms": { "TEMPO.keyword": condicoesTempo } }
    ];
    // veiculos.forEach(veiculo => {
    //     switch (veiculo) {
    //         case "AUTOMOVEL":
    //             filtros.push({ "range": { "AUTOMOVEL": { "gte": 1 } } });
    //             break;
    //         case "MOTO":
    //             filtros.push({ "range": { "MOTO": { "gte": 1 } } });
    //             break;
    //         case "CAMINHAO":
    //             filtros.push({ "range": { "CAMINHAO": { "gte": 1 } } });
    //             break;
    //         case "TAXI":
    //             filtros.push({ "range": { "TAXI": { "gte": 1 } } });
    //             break;
    //         case "LOTACAO":
    //             filtros.push({ "range": { "LOTACAO": { "gte": 1 } } });
    //             break
    //         case "ONIBUS":
    //             filtros.push({ "range": { "ONIBUS": { "gte": 1 } } });
    //             break;
    //         case "BICICLETA":
    //             filtros.push({ "range": { "BICICLETA": { "gte": 1 } } });
    //             break;
    //         case "OUTRO":
    //             filtros.push({ "range": { "OUTRO": { "gte": 1 } } });
    //             break;
    //     }
    // });

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
            result = [{"key": "Quantity", "bar": true, "values": acidentes}];
            console.log(result);
            service.sendJSON(response, status, result);                       
        }
    });
}