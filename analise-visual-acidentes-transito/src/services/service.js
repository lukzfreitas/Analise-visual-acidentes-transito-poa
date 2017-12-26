angular.module('service', [])
.factory('Acidentes', ['$http', function ($http) {    
    return {
        get : function(anos) {
            return $http.get('/api/acidentes?anos=' + anos);
        },
        porRegiao : function(anos, regiao) {
            return $http.get('/api/acidentesPorRegiao?anos=' + anos + '&regiao=' + regiao);
        }
    }
}])