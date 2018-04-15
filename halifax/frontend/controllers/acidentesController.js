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

            // Gráfico Feridos e Mortos
            $scope.optionsPie = {
                chart: {
                    type: 'pieChart',
                    height: 300,
                    width: 300,
                    x: function(d){return d.key;},
                    y: function(d){return d.y;},
                    showLabels: true,
                    duration: 500,
                    labelThreshold: 0.01,
                    labelSunbeamLayout: true,
                    legend: {
                        margin: {
                            top: 5,
                            right: 35,
                            bottom: 5,
                            left: 0
                        }
                    }
                }
            };
    
            $scope.dataPie = [
                {
                    key: "Feridos",
                    y: 2
                },
                {
                    key: "Mortos",
                    y: 2
                },
    ];
            
            //Gráfico Região    
            $scope.optionsDonut = {
                
                "chart": {
                    "type": "pieChart",
                    "height": 300,
                    "width": 300,
                    "donut": true,
                    "showLabels": true,
                    "pie": {},
                    "duration": 500,
                    "legend": {
                    "margin": {
                        "top": 0,
                        "right": 35,
                        "bottom": 0,
                        "left": 0
                    }
                    }
                }
                  
            };

            $scope.dataDonut = [
                {
                    key: "Norte",
                    y: 4
                },
                {
                    key: "Sul",
                    y: 4
                },
                {
                    key: "Leste",
                    y: 4
                },
                {
                    key: "Centro",
                    y: 4
                }
    ];

    //Gráfico Dias da Semana
    $scope.optionsMultiBar = {
        chart: {
            type: 'multiBarHorizontalChart',
            height: 250,
            width: 390,
            x: function(d){return d.label;},
            y: function(d){return d.value;},
            //yErr: function(d){ return [-Math.abs(d.value * Math.random() * 0.3), Math.abs(d.value * Math.random() * 0.3)] },
            showControls: false,
            showValues: true,
            duration: 500,
            xAxis: {
                showMaxMin: false
            },
            yAxis: {
                axisLabel: 'Values',
                tickFormat: function(d){
                    return d3.format(',.2f')(d);
                }
            }
        }
    };

    $scope.dataMultiBar = [
        {
            "key": "Dias da Semana",
            "color": "#1f77b4",
            "values": [
                {
                    "label" : "Segunda" ,
                    "value" : 25.307646510375
                } ,
                {
                    "label" : "Terça" ,
                    "value" : 16.756779544553
                } ,
                {
                    "label" : "Quarta" ,
                    "value" : 18.451534877007
                } ,
                {
                    "label" : "Quinta" ,
                    "value" : 8.6142352811805
                } ,
                {
                    "label" : "Sexta" ,
                    "value" : 7.8082472075876
                } ,
                {
                    "label" : "Sábado" ,
                    "value" : 5.259101026956
                } ,
                {
                    "label" : "Domingo" ,
                    "value" : 0.30947953487127
                }
            ]
        }
    ];

    $scope.optionsBarChart = {
        chart: {
            type: 'multiBarChart',
            height: 250,
            width: 390,
            margin : {
                top: 20,
                right: 20,
                bottom: 45,
                left: 45
            },
            clipEdge: true,
            //staggerLabels: true,
            duration: 500,
            stacked: true,
            xAxis: {
                axisLabel: 'Time (ms)',
                showMaxMin: false,
                tickFormat: function(d){
                    return d3.format(',f')(d);
                }
            }
        }
    };

    $scope.dataBarChart = function generateData() {
        return stream_layers(3,50+Math.random()*50,.1).map(function(data, i) {
            return {
                key: 'Stream' + i,
                values: data
            };
        });
    }
    
    function stream_layers(n, m, o) {
        if (arguments.length < 3) o = 0;
        function bump(a) {
            var x = 1 / (.1 + Math.random()),
                y = 2 * Math.random() - .5,
                z = 10 / (.1 + Math.random());
            for (var i = 0; i < m; i++) {
                var w = (i / m - y) * z;
                a[i] += x * Math.exp(-w * w);
            }
        }
        return d3.range(n).map(function() {
            var a = [], i;
            for (i = 0; i < m; i++) a[i] = o + o * Math.random();
            for (i = 0; i < 5; i++) bump(a);
            return a.map(stream_index);
        });
    }
    // function stream_waves(n, m) {
    //     return d3.range(n).map(function(i) {
    //         return d3.range(m).map(function(j) {
    //             var x = 20 * j / m - i / 3;
    //             return 2 * x * Math.exp(-.5 * x);
    //         }).map(stream_index);
    //     });
    // }

    function stream_index(d, i) {
        return {x: i, y: Math.max(0, d)};
}
    
}]);