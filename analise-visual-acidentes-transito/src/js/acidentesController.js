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
                pauseLoading: true,
                pauseLoadingMarker: true
            }
            $scope.regiao = {                
                regioes: ['NORTE', 'SUL', 'CENTRO', 'LESTE'],                
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

            $scope.carregarRegiao = function () {
                var loadData = function () {
                    var deferred = $q.defer();
                    var intervaloAnos = [];
                    for (var i = $scope.slider.min; i <= $scope.slider.max; i++) {
                        i = parseInt(i);
                        intervaloAnos.push(i);
                    }                    
                    if ($scope.regiao.regiaoSelecionada) {                        
                        Acidentes.qtdPorRegiao(intervaloAnos, $scope.regiao.regiaoSelecionada).success(function (data) {
                            deferred.resolve(data);
                        });
                    }
                    return deferred.promise;                    
                }
                var promise = loadData();
                promise.then(function (data) {
                    console.log(data);
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

            $scope.options = {
                chart: {
                    type: 'discreteBarChart',
                    height: 450,
                    margin: {
                        top: 20,
                        right: 20,
                        bottom: 60,
                        left: 55
                    },
                    x: function (d) { return d.label; },
                    y: function (d) { return d.value; },
                    showValues: true,
                    valueFormat: function (d) {
                        return d3.format(',.4f')(d);
                    },
                    transitionDuration: 500,
                    xAxis: {
                        axisLabel: 'X Axis'
                    },
                    yAxis: {
                        axisLabel: 'Y Axis',
                        axisLabelDistance: 30
                    }
                }
            };

            $scope.data = [{
                key: "Cumulative Return",
                values: [
                    { "label": "A", "value": -29.765957771107 },
                    { "label": "B", "value": 0 },
                    { "label": "C", "value": 32.807804682612 },
                    { "label": "D", "value": 196.45946739256 },
                    { "label": "E", "value": 0.19434030906893 },
                    { "label": "F", "value": -98.079782601442 },
                    { "label": "G", "value": -13.925743130903 },
                    { "label": "H", "value": -5.1387322875705 }
                ]
            }]   
            
            $scope.heatmapData = function generateRandomData(len) {
                var max = 100;
                var min = 1;
                var maxX = 500;
                var maxY = 300;
                var data = [];
                while (len--) {
                    data.push({
                        x: ((Math.random() * maxX) >> 0),
                        y: ((Math.random() * maxY) >> 0),
                        value: ((Math.random() * max + min) >> 0),
                        radius: ((Math.random() * 50 + min) >> 0)
                    });
                }
                return {
                    max: max,
                    min: min,
                    data: data
                }
            };

        }]);