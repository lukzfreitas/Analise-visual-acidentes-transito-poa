var client = require('../connection');
var service = require('../services/service');
var limdu = require('limdu');

module.exports.total = function (request, response) {
    var intervaloAnos = JSON.parse("[" + request.query.anos + "]");
    var fxHora = JSON.parse("[" + request.query.fxHora + "]");
    var condicoesTempo = request.query.condicoesTempo.split(",");
    var veiculos = request.query.veiculos.split(",");
    var ups = request.query.ups;
    var filtros = [
        { "match": { "UPS": ups } },
        { "terms": { "ANO": [2000, 2001] } }
        // { "terms": { "ANO": intervaloAnos } },
        // { "terms": { "FX_HORA": fxHora } },
        // { "terms": { "TEMPO.keyword": condicoesTempo } }
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
        "size": 349732,
        "from": 0,
        "body": {
            "sort": [
                { "DATA_HORA": { "order": "asc" } }
            ],
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
                return [parseInt(item._source.DIA), parseFloat(item._source.FX_HORA)]                
            });        
            
            switch (parseInt(ups)) {
                case 1:
                    service.sendJSON(response, status, {"key": "Danos Materiais", "values": acidentes});
                    break;
                case 5:
                    service.sendJSON(response, status, {"key": "Feridos", "values": acidentes});
                    break;
                case 13:
                    service.sendJSON(response, status, {"key": "Mortes", "values": acidentes});
                    break;
            }
        }
    });
}