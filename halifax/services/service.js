angular.module('service', [])
.factory('Acidentes', ['$http', function ($http) {    
    return {
        get : function(anos) {
            return $http.get('/api/acidentes?anos=' + anos);
        },
        porRegiao : function(anos, regiao) {
            return $http.get('/api/acidentes-por-regiao?anos=' + anos + '&regiao=' + regiao);
        },
        qtdPorRegiao : function(anos, regiao) {            
            return $http.get('/api/qtd-acidentes-por-regiao?anos=' + anos + '&regiao=' + regiao);
        },
        locaisErrados : function() {
            return $http.get('/api/acidentes-locais-errados');
        }
    }
}])