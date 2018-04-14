'use strict';
angular.module('acidentesController', [])    
    .controller('acidentesController', [
        '$timeout',
        '$scope',
        '$http',
        'Acidentes',        
        '$q',        
        function ($timeout, $scope, $http, Acidentes, $q) {
            $scope.regiao = {                
                regioes: ['NORTE', 'SUL', 'CENTRO', 'LESTE'],                
                regiaoSelecionada: false
            }

            $scope.carregarHeatmap = function () {                
                var loadData = function () {
                    var deferred = $q.defer();
                    var intervaloAnos = [];
                    for (var i = $scope.slider.min; i <= $scope.slider.max; i++) {
                        i = parseInt(i);
                        intervaloAnos.push(i);
                    }
                    // if ($scope.regiao.regiaoSelecionada) {
                    //     Acidentes.porRegiao(intervaloAnos, $scope.regiao.regiaoSelecionada).success(function (data) {
                    //         $scope.coordenadas = data.map(function (item) {
                    //             return new google.maps.LatLng({ lat: item.LATITUDE, lng: item.LONGITUDE })
                    //         });                            
                    //         if ($scope.coordenadas.length) {
                    //             deferred.resolve($scope.coordenadas);
                    //         }
                    //     });
                    // } else {
                        console.log('intevalo de anos', intervaloAnos);
                        Acidentes.get(intervaloAnos).success(function (data) {
                            console.log('dados', data);
                            $scope.coordenadas = data.map(function (item) {
                                return new google.maps.LatLng({ lat: item.LATITUDE, lng: item.LONGITUDE })
                            });                            
                            if ($scope.coordenadas.length) {
                                deferred.resolve($scope.coordenadas);
                            }
                        });
                    // }
                    return deferred.promise;
                }
                var promise = loadData();
                promise.then(function (data) {
                    console.log(data);
                    // $scope.googleMaps.pauseLoading = false;
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
            
            

        }]);