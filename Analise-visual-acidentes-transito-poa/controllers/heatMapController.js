var mongoose = require('mongoose');
var service = require('../services/service');
var Acidentes = mongoose.model('Acidente');

module.exports.getAcidentes = function (request, response) {            
    var min = parseInt(request.query.min);
    var max = parseInt(request.query.max);    
    console.log(min);
    console.log(max);    
    Acidentes.find({ANO: {$gte: min, $lte: max}}, function (error, result) {        
        if (error) {
            service.sendJSON(response, 500, error);            
        } else {            
            service.sendJSON(response, 200, result);                        
        }
    });
}