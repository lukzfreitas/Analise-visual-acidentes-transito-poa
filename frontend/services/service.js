angular.module('service', [])
    .factory('Acidentes', ['$http', function ($http) {
        return {            
            porRegiao: function (anos, fxHora, condicoesTempo, veiculos) {                                     
                return $http.get('/api/acidentes-por-regiao?anos=' + anos + '&fxHora=' + fxHora +
                 '&condicoesTempo=' + condicoesTempo + '&veiculos=' + veiculos);
            },
            porRegiaoPredicao: function (anos, tempo, noite_dia, tipo_acidente, dia_semana, ups) {                
                return $http.get('/api/acidentes-por-regiao-predicao?anos=' + anos + '&tempo=' + tempo + '&noite_dia=' + noite_dia +
                '&tipo_acidente=' + tipo_acidente + '&dia_semana=' + dia_semana + '&ups=' + ups);
            },
            porTipoAcidente: function (anos, fxHora, condicoesTempo, veiculos) {
                return $http.get('/api/acidentes-por-tipo?anos=' + anos + '&fxHora=' + fxHora +
                '&condicoesTempo=' + condicoesTempo + '&veiculos=' + veiculos);
            },            
            porTipoAcidentePredicao: function (anos, tempo, noite_dia, dia_semana, ups) {
                return $http.get('/api/acidentes-por-tipo-predicao?anos=' + anos + '&tempo=' + tempo + '&noite_dia=' + noite_dia +
                '&dia_semana=' + dia_semana + '&ups=' + ups);
            },
            porFaixaHora: function (anos, condicoesTempo, veiculos) {
                return $http.get('/api/acidentes-por-faixa-hora?anos=' + anos +'&condicoesTempo=' +
                 condicoesTempo + '&veiculos=' + veiculos);
            },
            porFaixaHoraPredicao: function (anos, tempo, noite_dia, tipo_acidente, dia_semana, ups) {
                return $http.get('/api/acidentes-por-faixa-hora-predicao?anos=' + anos + '&tempo=' + tempo + '&noite_dia=' + noite_dia +
                '&tipo_acidente=' + tipo_acidente + '&dia_semana=' + dia_semana + '&ups=' + ups);
            },
            // heatMap: function (anos) {
            //     return $http.get('/api/heat-map?anos=' + anos);
            // }
        }
    }])