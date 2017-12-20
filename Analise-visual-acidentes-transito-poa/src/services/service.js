angular.module('service', [])
.factory('Acidentes', ['$http', function ($http) {    
    return {
        get : function(min, max) {
            return $http.get('/api/acidentes?min=' + min + '&max=' + max);
        }
    }
}])