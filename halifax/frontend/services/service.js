angular.module('service', [])
    .factory('Acidentes', ['$http', function ($http) {
        return {            
            porRegiao: function (anos, fxHora, condicoesTempo, veiculos) {                     
                return $http.get('/api/acidentes-por-regiao?anos=' + anos + '&fxHora=' + fxHora +
                 '&condicoesTempo=' + condicoesTempo + '&veiculos=' + veiculos);
            },
            porRegiaoPredicao: function (mes, dia, fxHora, anos, condicoesTempo, veiculos) {
                return $http.get('/api/acidentes-por-regiao-predicao?mes=' + mes + '&dia=' + dia +
                 '&fxHora=' + fxHora + '&anos=' + anos + '&condicoesTempo=' + condicoesTempo + '&veiculos=' + veiculos);
            },
            porTipoAcidente: function (anos, fxHora, condicoesTempo, veiculos) {
                return $http.get('/api/acidentes-por-tipo?anos=' + anos + '&fxHora=' + fxHora +
                '&condicoesTempo=' + condicoesTempo + '&veiculos=' + veiculos);
            },            
            porTipoAcidentePredicao: function (mes, dia, fxHora, anos, condicoesTempo, veiculos) {
                return $http.get('/api/acidentes-por-tipo-predicao?mes=' + mes + '&dia=' + dia + '&fxHora=' + fxHora +
                 '&anos=' + anos + '&condicoesTempo=' + condicoesTempo + '&veiculos=' + veiculos);
            },
            porFaixaHora: function (anos, condicoesTempo, veiculos) {
                return $http.get('/api/acidentes-por-faixa-hora?anos=' + anos +'&condicoesTempo=' +
                 condicoesTempo + '&veiculos=' + veiculos);
            },
            porFaixaHoraPredicao: function (mes, dia, fxHora, anos, condicoesTempo, veiculos) {
                return $http.get('/api/acidentes-por-faixa-hora-predicao?mes=' + mes + '&dia=' + dia + '&fxHora=' + fxHora +
                '&anos=' + anos + '&condicoesTempo=' + condicoesTempo + '&veiculos=' + veiculos);
            },
            heatMap: function (anos) {
                return $http.get('/api/heat-map?anos=' + anos);
            }
        }
    }])