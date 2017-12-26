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
            $scope.googleMaps = {
                apiKey: "AIzaSyDuD3JW1VXB1XlO7Lrbr6eC8TCun8Yc010",
                googleMapsUrl: "https://maps.google.com/maps/api/js",
                pauseLoading: true
            }
            $scope.regiao = {
                regioesDisable: true,
                regioes: ['NORTE', 'SUL', 'CENTRO', 'LESTE'],
                label: "habilitar",
                regiaoSelecionada: false
            }

            NgMap.getMap().then(function (map) {
                $scope.map = map;
            });

            $scope.loadHeatmap = function () {
                if (!angular.isUndefined($scope.map.heatmapLayers)) {
                    var heatmap = $scope.map.heatmapLayers.cord;
                    heatmap.setMap(null);
                }
                NgMap.getMap().then(function (map) {
                    $scope.map = map;
                });
                $scope.googleMaps.pauseLoading = true;
                var loadData = function () {
                    var deferred = $q.defer();
                    var intervaloAnos = [];
                    for (var i = $scope.slider.min; i <= $scope.slider.max; i++) {
                        i = parseInt(i);
                        intervaloAnos.push(i);
                    }
                    if ($scope.regiao.regiaoSelecionada) {
                        Acidentes.porRegiao(intervaloAnos, $scope.regiao.regiaoSelecionada).success(function (data) {
                            $scope.coordenadas = data.map(function (item) {
                                return new google.maps.LatLng({ lat: item.LATITUDE, lng: item.LONGITUDE })
                            });
                            console.log($scope.coordenadas.length);
                            if ($scope.coordenadas.length) {
                                deferred.resolve($scope.coordenadas);
                            }
                        });                        
                    } else {
                        Acidentes.get(intervaloAnos).success(function (data) {
                            $scope.coordenadas = data.map(function (item) {
                                return new google.maps.LatLng({ lat: item.LATITUDE, lng: item.LONGITUDE })
                            });
                            console.log($scope.coordenadas.length);
                            if ($scope.coordenadas.length) {
                                deferred.resolve($scope.coordenadas);
                            }
                        });
                    }
                    return deferred.promise;
                }
                var promise = loadData();
                promise.then(function (data) {
                    $scope.googleMaps.pauseLoading = false;
                });
            }

            $scope.slider = {
                min: 2010,
                max: 2014,
                options: {
                    floor: 2000,
                    ceil: 2016,
                    showTicksValues: true
                }
            };

            $scope.habilitarRegioes = function () {
                $scope.regiao.regioesDisable = !$scope.regiao.regioesDisable;
                if ($scope.regiao.regioesDisable) {
                    $scope.regiao.label = "habilitar";
                    $scope.regiao.regiaoSelecionada = false;
                } else {
                    $scope.regiao.label = "desabilitar";
                }
            }
        }]);