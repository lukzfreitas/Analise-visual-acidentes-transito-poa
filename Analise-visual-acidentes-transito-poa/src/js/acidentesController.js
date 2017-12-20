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
            $scope.listaAnos = [];
            $scope.addAno = function (item) {
                $scope.listaAnos.push(item);
            }
            $scope.loadHeatmap = function () {
                // $timeout(function () {
                //     $scope.pauseLoading = false;
                // }, 40000);                
                // Acidentes.get($scope.slider.min, $scope.slider.max).success(function (data) {                    
                //     $scope.coordenadas = data.map(function (item) {
                //         return new google.maps.LatLng({ lat: parseFloat(item.LATITUDE), lng: parseFloat(item.LONGITUDE) })
                //     });
                // });
                // console.log($scope.coordenadas);
                // $scope.pauseLoading = true;
                var loadData = function () {
                    var deferred = $q.defer();
                    Acidentes.get($scope.slider.min, $scope.slider.max).success(function (data) {
                        $scope.coordenadas = data.map(function (item) {
                            return new google.maps.LatLng({ lat: parseFloat(item.LATITUDE), lng: parseFloat(item.LONGITUDE) })
                        });
                        if ($scope.coordenadas.length) {
                            console.log($scope.coordenadas);
                            deferred.resolve($scope.coordenadas);
                        }
                    });
                    return deferred.promise;
                }
                var promise = loadData();   
                promise.then(function(data){
                    $scope.pauseLoading = false;
                });
            }
            $scope.slider = {
                min: 2010,
                max: 2015,
                options: {
                    floor: 2000,
                    ceil: 2016,
                    showTicksValues: true
                }
            };
        }]);