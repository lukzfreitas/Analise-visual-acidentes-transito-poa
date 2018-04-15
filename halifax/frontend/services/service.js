angular.module('service', [])
.factory('Acidentes', ['$http', function ($http) {    
    return {
        get : function(anos) {
            console.log('chegou aqui');
            return $http.get('/api/acidentes?anos=' + anos);
        },
        qtdPorRegiao : function(anos, regiao) {
            console.log('chegou aqui');
            return $http.get('/api/acidentes-por-regiao?anos=' + anos + '&regiao=' + regiao);
        },        
    }
}])