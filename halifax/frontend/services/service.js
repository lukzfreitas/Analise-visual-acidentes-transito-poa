angular.module('service', [])
    .factory('Acidentes', ['$http', function ($http) {
        return {            
            porRegiao: function (anos, mes, dia, fxHora, condicoesTempo, veiculos) {                     
                return $http.get('/api/acidentes-por-regiao?anos=' + anos + '&mes=' + mes +
                    '&dia=' + dia + '&fxHora=' + fxHora + '&condicoesTempo=' + condicoesTempo + '&veiculos=' + veiculos);
            },
            porRegiaoPredicao: function (anos, mes, dia, fxHora, condicoesTempo, veiculos) {
                return $http.get('/api/acidentes-por-regiao-predicao?anos=' + anos + '&mes=' + mes +
                    '&dia=' + dia + '&fxHora=' + fxHora + '&condicoesTempo=' + condicoesTempo + '&veiculos=' + veiculos);
            },
            porTipoAcidente: function (anos, mes, dia, fxHora, condicoesTempo, veiculos) {
                return $http.get('/api/acidentes-por-tipo?anos=' + anos + '&mes=' + mes +
                    '&dia=' + dia + '&fxHora=' + fxHora + '&condicoesTempo=' + condicoesTempo + '&veiculos=' + veiculos);
            },            
            porTipoAcidentePredicao: function (anos, mes, dia, fxHora, condicoesTempo, veiculos) {
                return $http.get('/api/acidentes-por-tipo-predicao?anos=' + anos + '&mes=' + mes +
                    '&dia=' + dia + '&fxHora=' + fxHora + '&condicoesTempo=' + condicoesTempo + '&veiculos=' + veiculos);
            },
            porUPS: function (anos, mes, dia, fxHora, condicoesTempo, veiculos) {
                return $http.get('/api/acidentes-por-ups?anos=' + anos + '&mes=' + mes +
                    '&dia=' + dia + '&fxHora=' + fxHora + '&condicoesTempo=' + condicoesTempo + '&veiculos=' + veiculos);
            }
        }
    }])