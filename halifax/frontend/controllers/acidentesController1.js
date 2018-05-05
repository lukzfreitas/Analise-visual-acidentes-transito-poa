'use strict';
angular.module('acidentesController', [])    
    .controller('acidentesController', [
        '$timeout',
        '$scope',
        '$http',
        'Acidentes',        
        '$q',        
        function ($timeout, $scope, $http, Acidentes, $q) {
            
            $scope.veiculo = {
                veiculos: ['Automóvel','Moto','Caminhão','Táxi','Lotação','Ônibus','Bicicleta', 'Outro'],
                veiculoSelecionada: false
            }

            $scope.horario = {                
                horarios: ['Manhã (6h a 12h)', 'Tarde (12h a 18h)', 'Noite (18h a 24h)', 'Madrugada (24h a 6h)'],                
                horarioSelecionada: false
            }

            $scope.tempo = {                
                tempos: ['Bom', 'Chuvoso', 'Nublado'],                
                tempoSelecionada: false
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
                    height: 250,
                    width: 250,
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
    //         $scope.optionsDonut = {
                
    //             "chart": {
    //                 "type": "pieChart",
    //                 "height": 250,
    //                 "width": 250,
    //                 "donut": true,
    //                 "showLabels": true,
    //                 "pie": {},
    //                 "duration": 500,
    //                 "legend": {
    //                 "margin": {
    //                     "top": 0,
    //                     "right": 35,
    //                     "bottom": 0,
    //                     "left": 0
    //                 }
    //                 }
    //             }
                  
    //         };

    //         $scope.dataDonut = [
    //             {
    //                 key: "Norte",
    //                 y: 4
    //             },
    //             {
    //                 key: "Sul",
    //                 y: 4
    //             },
    //             {
    //                 key: "Leste",
    //                 y: 4
    //             },
    //             {
    //                 key: "Centro",
    //                 y: 4
    //             }
    // ];

    //Gráfico Dias da Semana
    $scope.optionsMultiBar = {
        chart: {
            type: 'multiBarHorizontalChart',
            height: 250,
            width: 400,
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

    // Gráfico Meses
//     $scope.optionsBarChart = {
//         chart: {
//             type: 'discreteBarChart',
//             height: 250,
//             width: 400,
//             margin : {
//                 top: 20,
//                 right: 20,
//                 bottom: 50,
//                 left: 55
//             },
//             x: function(d){return d.label;},
//             y: function(d){return d.value;},
//             showValues: true,
//             valueFormat: function(d){
//                 return d3.format(',.4f')(d);
//             },
//             duration: 500,
//             xAxis: {
//                 axisLabel: 'Mês'
//             },
//             yAxis: {
//                 axisLabel: '',
//                 axisLabelDistance: -10
//             }
//         }
//     };

//     $scope.dataBarChart = [
//         {
//             key: "Cumulative Return",
//             values: [
//                 {
//                     "label" : "Jan" ,
//                     "value" : 5
//                 } ,
//                 {
//                     "label" : "Fev" ,
//                     "value" : 0
//                 } ,
//                 {
//                     "label" : "Mar" ,
//                     "value" : 7
//                 } ,
//                 {
//                     "label" : "Abr" ,
//                     "value" : 3
//                 } ,
//                 {
//                     "label" : "Mai" ,
//                     "value" : 12
//                 } ,
//                 {
//                     "label" : "Jun" ,
//                     "value" : 9
//                 } ,
//                 {
//                     "label" : "Jul" ,
//                     "value" : 1
//                 } ,
//                 {
//                     "label" : "Ago" ,
//                     "value" : 15
//                 },
//                 {
//                     "label" : "Set" ,
//                     "value" : 11
//                 },
//                 {
//                     "label" : "Out" ,
//                     "value" : 18
//                 },
//                 {
//                     "label" : "Nov" ,
//                     "value" : 10
//                 },
//                 {
//                     "label" : "Dez" ,
//                     "value" : 8
//                 }
//             ]
//         }
// ];

//Grafico BubbleChart
$scope.optionsBubble = {
    chart: {
        type: 'scatterChart',
        height: 250,
        width: 400,
        color: d3.scale.category10().range(),
        scatter: {
            onlyCircles: false
        },
        showDistX: true,
        showDistY: true,
      //tooltipContent: function(d) {
      //    return d.series && '<h3>' + d.series[0].key + '</h3>';
      //},
        duration: 350,
        xAxis: {
            axisLabel: 'Meses',
            tickFormat: function(d){
                return d3.format('.02f')(d);
            }
        },
        yAxis: {
            axisLabel: 'Y Axis',
            tickFormat: function(d){
                return d3.format('.02f')(d);
            },
            axisLabelDistance: -5
        },
        zoom: {
            //NOTE: All attributes below are optional
            enabled: true,
            scaleExtent: [1, 10],
            useFixedDomain: false,
            useNiceScale: false,
            horizontalOff: false,
            verticalOff: false,
            unzoomEventType: 'dblclick.zoom'
        }
    }
};

$scope.dataBubble = generateData(4,40);

/* Random Data Generator (took from nvd3.org) */
function generateData(groups, points) {
    var data = [],
        shapes = ['circle', 'cross', 'triangle-up', 'triangle-down', 'diamond', 'square'],
        random = d3.random.normal();

    for (var i = 0; i < groups; i++) {
        data.push({
            key: 'Group ' + i,
            values: []
        });

        for (var j = 0; j < points; j++) {
            data[i].values.push({
                x: random()
                , y: random()
                , size: Math.random()
                , shape: shapes[j % 6]
            });
        }
    };
return data;
};
    
}]);