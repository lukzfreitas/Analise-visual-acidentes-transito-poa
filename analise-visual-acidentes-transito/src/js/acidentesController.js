'use strict';
angular.module('acidentesController', [])
    .controller('acidentesController', [
        '$timeout',
        '$scope',
        '$http',
        'Acidentes',
        'NgMap',
        '$q',
        function ($timeout, $scope, $http, Acidentes, NgMap, $q) {            
            NgMap.getMap().then(function (map) {
                $scope.map = map;                
            });
            $scope.apiKey = "AIzaSyDuD3JW1VXB1XlO7Lrbr6eC8TCun8Yc010";
            $scope.googleMapsUrl = "https://maps.google.com/maps/api/js";
            $scope.pauseLoading = true;
            $scope.slider = {
                min: 2010,
                max: 2014,
                options: {
                    floor: 2000,
                    ceil: 2016,
                    showTicksValues: true
                }
            };
            $scope.loadHeatmap = function () {
                if (!angular.isUndefined($scope.map.heatmapLayers)) {
                    var heatmap = $scope.map.heatmapLayers.cord;
                    heatmap.setMap(null); 
                }                
                NgMap.getMap().then(function (map) {
                    $scope.map = map;                
                });                
                $scope.pauseLoading = true;                  
                var loadData = function () {
                    var deferred = $q.defer();
                    var intervaloAnos = [];
                    for (var i = $scope.slider.min; i <= $scope.slider.max; i++) {
                        i = parseInt(i);
                        intervaloAnos.push(i);
                    }
                    Acidentes.get(intervaloAnos).success(function (data) {
                        $scope.coordenadas = data.map(function (item) {                            
                            return new google.maps.LatLng({ lat: item.LATITUDE, lng: item.LONGITUDE })
                        });
                        console.log($scope.coordenadas.length);
                        if ($scope.coordenadas.length) {
                            deferred.resolve($scope.coordenadas);
                        }
                    });
                    return deferred.promise;
                }
                var promise = loadData();
                promise.then(function (data) {
                    $scope.pauseLoading = false;
                });
            }            
        }]);