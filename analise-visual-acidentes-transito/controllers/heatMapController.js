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

// module.exports.getAcidentes = function (request, response) {            
//     var min = parseInt(request.query.min);
//     var max = parseInt(request.query.max);    
//     console.log(min);
//     console.log(max);    
//     Acidentes.find({ANO: {$gte: min, $lte: max}}, function (error, result) {        
//         if (error) {
//             service.sendJSON(response, 500, error);            
//         } else {            
//             service.sendJSON(response, 200, result);                        
//         }
//     });
// }