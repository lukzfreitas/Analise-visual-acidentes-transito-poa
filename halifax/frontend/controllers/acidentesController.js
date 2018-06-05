'use strict';
angular.module('acidentesController', [])
    .controller('acidentesController', [
        '$timeout',
        '$scope',
        '$http',
        'Acidentes',
        '$q',
        '$mdSidenav',
        function ($timeout, $scope, $http, Acidentes, $q, $mdSidenav) {

            $scope.faixasHora = [
                { label: "Manhã (6h a 12h)", selected: false, value: [6, 7, 8, 9, 10, 11] },
                { label: "Tarde (12h a 18h)", selected: false, value: [12, 13, 14, 15, 16, 17] },
                { label: "Manhã (18h a 0h)", selected: false, value: [18, 19, 20, 21, 22, 23] },
                { label: "Manhã (0h a 6h)", selected: false, value: [0, 1, 2, 3, 4, 5] }
            ]

            $scope.condicoesTempo = [
                { label: "Bom", selected: false, value: "BOM" },
                { label: "Chuvoso", selected: false, value: "CHUVOSO" },
                { label: "Nublado", selected: false, value: "NUBLADO" }
            ]

            $scope.veiculos = [
                { label: 'Automóvel', selected: false, value: "AUTOMOVEL" },
                { label: 'Moto', selected: false, value: "MOTO" },
                { label: 'Caminhão', selected: false, value: "CAMINHAO" },
                { label: 'Táxi', selected: false, value: "TAXI" },
                { label: 'Lotação', selected: false, value: "LOTACAO" },
                { label: 'Ônibus', selected: false, value: "ONIBUS" },
                { label: 'Bicicleta', selected: false, value: "BICICLETA" },
                { label: 'Outro', selected: false, value: "OUTRO" }
            ]

            $scope.anos = [];
            for (var i = 2000; i <= 2016; i++) {
                $scope.anos.push({ value: i, selected: false });
            }

            $scope.meses = [
                { label: "Janeiro", value: 1 },
                { label: "Fevereiro", value: 2 },
                { label: "Março", value: 3 },
                { label: "Abril", value: 4 },
                { label: "Maio", value: 5 },
                { label: "Junho", value: 6 },
                { label: "Julho", value: 7 },
                { label: "Agosto", value: 8 },
                { label: "Setembro", value: 9 },
                { label: "Outubro", value: 10 },
                { label: "Novembro", value: 11 },
                { label: "Dezembro", value: 12 }
            ]

            $scope.dias = [];
            for (i = 1; i <= 31; i++) {
                $scope.dias.push({ label: "Dia " + i, value: i });
            }

            $scope.faixasHoraPredicao = [];
            for (i = 0; i <= 23; i++) {
                $scope.faixasHoraPredicao.push({ label: i + "h", value: i });
            }

            $scope.mesSelected = { label: "Janeiro", value: 1 };
            $scope.diaSelected = { label: "Dia 1", value: 1 };
            $scope.faixaHoraSelected = { label: "8h", value: 8 };

            $scope.regiaoPredicao = false;
            $scope.tipoAcidentePredicao = false;
            $scope.faixaHoraPredicao = false;

            $scope.toggleSidenavFiltros = buildToggler('closeEventsDisabledFiltros');

            $scope.toggleSidenavPredicao = buildToggler('closeEventsDisabledPredicao');

            function buildToggler(componentId) {
                return function () {
                    $mdSidenav(componentId).toggle();
                };
            }

            $scope.heatMap = function () {
                var anos = [];
                var anos = [];
                for (var i = 0; i < $scope.anos.length; i++) {
                    if ($scope.anos[i].selected) {
                        anos.push($scope.anos[i].value);
                    }
                }
                if (anos.length == 0) {
                    anos.push(2016);
                }
                Acidentes.heatMap(anos).success(function (data) {
                    console.log(data);
                });
            }

            $scope.porRegiaoPredicao = function () {
                var anos = [];
                for (var i = 0; i < $scope.anos.length; i++) {
                    if ($scope.anos[i].selected) {
                        anos.push($scope.anos[i].value);
                    }
                }
                if (anos.length == 0) {
                    anos.push(2016);
                }
                var condicoesTempo = [];
                for (var i = 0; i < $scope.condicoesTempo.length; i++) {
                    if ($scope.condicoesTempo[i].selected) {
                        condicoesTempo.push($scope.condicoesTempo[i].value);
                    }
                }
                var veiculos = [];
                for (var i = 0; i < $scope.veiculos.length; i++) {
                    if ($scope.veiculos[i].selected) {
                        veiculos.push($scope.veiculos[i].value);
                    }
                }
                var fxHora = [];
                for (var i = 0; i < $scope.faixasHora.length; i++) {
                    if ($scope.faixasHora[i].selected) {
                        fxHora = fxHora.concat($scope.faixasHora[i].value);
                    }
                }
                var loadData = function () {
                    var deferred = $q.defer();
                    Acidentes.porRegiaoPredicao(
                        $scope.mesSelected.value,
                        $scope.diaSelected.value,
                        $scope.faixaHoraSelected.value,
                        anos,
                        condicoesTempo,
                        veiculos
                    ).success(function (data) {
                        deferred.resolve(data);
                    });
                    return deferred.promise;
                }
                var promise = loadData();
                promise.then(function (data) {
                    $scope.optionsPie = {
                        chart: {
                            type: 'pieChart',
                            height: 300,
                            width: 450,
                            x: function (d) { return d.key; },
                            y: function (d) { return d.y; },
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
                    $scope.dataPie = data;
                });
            }


            $scope.porRegiao = function () {
                var anos = [];
                for (var i = 0; i < $scope.anos.length; i++) {
                    if ($scope.anos[i].selected) {
                        anos.push($scope.anos[i].value);
                    }
                }
                if (anos.length == 0) {
                    anos.push(2016);
                }
                var condicoesTempo = [];
                for (var i = 0; i < $scope.condicoesTempo.length; i++) {
                    if ($scope.condicoesTempo[i].selected) {
                        condicoesTempo.push($scope.condicoesTempo[i].value);
                    }
                }
                var veiculos = [];
                for (var i = 0; i < $scope.veiculos.length; i++) {
                    if ($scope.veiculos[i].selected) {
                        veiculos.push($scope.veiculos[i].value);
                    }
                }
                var fxHora = [];
                for (var i = 0; i < $scope.faixasHora.length; i++) {
                    if ($scope.faixasHora[i].selected) {
                        fxHora = fxHora.concat($scope.faixasHora[i].value);
                    }
                }
                var loadData = function () {
                    var deferred = $q.defer();
                    Acidentes.porRegiao(
                        anos,
                        fxHora,
                        condicoesTempo,
                        veiculos
                    ).success(function (data) {
                        deferred.resolve(data);
                    });
                    return deferred.promise;
                }
                var promise = loadData();
                promise.then(function (data) {
                    $scope.optionsPie = {
                        chart: {
                            type: 'pieChart',
                            height: 300,
                            width: 450,
                            x: function (d) { return d.key; },
                            y: function (d) { return d.y; },
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
                    $scope.dataPie = data;
                });
            }

            $scope.porTipoAcidentePredicao = function () {
                var anos = [];
                for (var i = 0; i < $scope.anos.length; i++) {
                    if ($scope.anos[i].selected) {
                        anos.push($scope.anos[i].value);
                    }
                }
                if (anos.length == 0) {
                    anos.push(2016);
                }
                var condicoesTempo = [];
                for (var i = 0; i < $scope.condicoesTempo.length; i++) {
                    if ($scope.condicoesTempo[i].selected) {
                        condicoesTempo.push($scope.condicoesTempo[i].value);
                    }
                }
                var veiculos = [];
                for (var i = 0; i < $scope.veiculos.length; i++) {
                    if ($scope.veiculos[i].selected) {
                        veiculos.push($scope.veiculos[i].value);
                    }
                }
                var fxHora = [];
                for (var i = 0; i < $scope.faixasHora.length; i++) {
                    if ($scope.faixasHora[i].selected) {
                        fxHora = fxHora.concat($scope.faixasHora[i].value);
                    }
                }
                var loadData = function () {
                    var deferred = $q.defer();
                    // mes, dia, fxHora, anos, condicoesTempo, veiculos, regioes
                    Acidentes.porTipoAcidentePredicao(
                        $scope.mesSelected.value,
                        $scope.diaSelected.value,
                        $scope.faixaHoraSelected.value,
                        anos,
                        condicoesTempo,
                        veiculos                        
                    ).success(function (data) {
                        deferred.resolve(data);
                    });
                    return deferred.promise;
                }
                var promise = loadData();
                promise.then(function (data) {
                    $scope.optionsMultiBar = {
                        chart: {
                            type: 'multiBarHorizontalChart',
                            height: 300,
                            width: 450,
                            x: function (d) { return d.label; },
                            y: function (d) { return d.value; },
                            //yErr: function(d){ return [-Math.abs(d.value * Math.random() * 0.3), Math.abs(d.value * Math.random() * 0.3)] },
                            showControls: false,
                            showValues: true,
                            duration: 500,
                            xAxis: {
                                showMaxMin: false
                            },
                            yAxis: {
                                axisLabel: 'Values',
                                tickFormat: function (d) {
                                    return d;
                                }
                            }
                        }
                    };
                    $scope.dataMultiBar = data;
                });
            }

            $scope.porTipoAcidente = function () {
                var anos = [];
                for (var i = 0; i < $scope.anos.length; i++) {
                    if ($scope.anos[i].selected) {
                        anos.push($scope.anos[i].value);
                    }
                }
                if (anos.length == 0) {
                    anos.push(2016);
                }
                var condicoesTempo = [];
                for (var i = 0; i < $scope.condicoesTempo.length; i++) {
                    if ($scope.condicoesTempo[i].selected) {
                        condicoesTempo.push($scope.condicoesTempo[i].value);
                    }
                }
                var veiculos = [];
                for (var i = 0; i < $scope.veiculos.length; i++) {
                    if ($scope.veiculos[i].selected) {
                        veiculos.push($scope.veiculos[i].value);
                    }
                }
                var fxHora = [];
                for (var i = 0; i < $scope.faixasHora.length; i++) {
                    if ($scope.faixasHora[i].selected) {
                        fxHora = fxHora.concat($scope.faixasHora[i].value);
                    }
                }
                var loadData = function () {
                    var deferred = $q.defer();
                    // anos, fxHora, condicoesTempo, veiculos, regioes
                    Acidentes.porTipoAcidente(
                        anos,
                        fxHora,
                        condicoesTempo,
                        veiculos                        
                    ).success(function (data) {
                        deferred.resolve(data);
                    });
                    return deferred.promise;
                }
                var promise = loadData();
                promise.then(function (data) {
                    $scope.optionsMultiBar = {
                        chart: {
                            type: 'multiBarHorizontalChart',
                            height: 300,
                            width: 450,
                            x: function (d) { return d.label; },
                            y: function (d) { return d.value; },
                            //yErr: function(d){ return [-Math.abs(d.value * Math.random() * 0.3), Math.abs(d.value * Math.random() * 0.3)] },
                            showControls: false,
                            showValues: true,
                            duration: 500,
                            xAxis: {
                                showMaxMin: false
                            },
                            yAxis: {
                                axisLabel: 'Total',
                                tickFormat: function (d) {
                                    return d
                                }
                            }
                        }
                    };
                    $scope.dataMultiBar = data;
                });
            }

            $scope.porFaixaHoraPredicao = function () {
                var anos = [];
                for (var i = 0; i < $scope.anos.length; i++) {
                    if ($scope.anos[i].selected) {
                        anos.push($scope.anos[i].value);
                    }
                }
                if (anos.length == 0) {
                    anos.push(2016);
                }
                var condicoesTempo = [];
                for (var i = 0; i < $scope.condicoesTempo.length; i++) {
                    if ($scope.condicoesTempo[i].selected) {
                        condicoesTempo.push($scope.condicoesTempo[i].value);
                    }
                }
                var veiculos = [];
                for (var i = 0; i < $scope.veiculos.length; i++) {
                    if ($scope.veiculos[i].selected) {
                        veiculos.push($scope.veiculos[i].value);
                    }
                }
                var fxHora = [];
                for (var i = 0; i < $scope.faixasHora.length; i++) {
                    if ($scope.faixasHora[i].selected) {
                        fxHora = fxHora.concat($scope.faixasHora[i].value);
                    }
                }
                var loadData = function () {
                    var deferred = $q.defer();
                    console.log($scope.faixaHoraSelected.value);
                    Acidentes.porFaixaHoraPredicao(
                        $scope.mesSelected.value,
                        $scope.diaSelected.value,
                        $scope.faixaHoraSelected.value,
                        anos,
                        condicoesTempo,
                        veiculos                        
                    ).success(function (data) {
                        deferred.resolve(data);
                    });
                    return deferred.promise;
                }
                var promise = loadData();
                promise.then(function (data) {
                    $scope.optionsHistorical = {
                        chart: {
                            type: 'historicalBarChart',
                            height: 300,
                            width: 400,
                            margin: {
                                top: 20,
                                right: 20,
                                bottom: 65,
                                left: 50
                            },
                            x: function (d) { return d[0]; },
                            y: function (d) { return d[1]; },
                            // useVoronoi: false,
                            // showControls: false,
                            // clipEdge: true,

                            duration: 100,
                            xAxis: {
                                axisLabel: 'Faixa Horária',
                                tickFormat: function (d) {
                                    return d;
                                },
                                rotateLabels: 30,
                                showMaxMin: false
                            },
                            yAxis: {
                                axisLabel: 'Total',
                                axisLabelDistance: -10,
                                tickFormat: function (d) {
                                    return d;
                                }
                            },
                            tooltip: {
                                keyFormatter: function (d) {
                                    return d;
                                }
                            },
                            zoom: {
                                enabled: true,
                                scaleExtent: [1, 10],
                                useFixedDomain: false,
                                useNiceScale: false,
                                horizontalOff: false,
                                verticalOff: true,
                                unzoomEventType: 'dblclick.zoom'
                            }
                        }
                    };

                    $scope.dataHistorical = data;
                });
            }

            $scope.porFaixaHora = function () {
                var anos = [];
                for (var i = 0; i < $scope.anos.length; i++) {
                    if ($scope.anos[i].selected) {
                        anos.push($scope.anos[i].value);
                    }
                }
                if (anos.length == 0) {
                    anos.push(2016);
                }
                var condicoesTempo = [];
                for (var i = 0; i < $scope.condicoesTempo.length; i++) {
                    if ($scope.condicoesTempo[i].selected) {
                        condicoesTempo.push($scope.condicoesTempo[i].value);
                    }
                }
                var veiculos = [];
                for (var i = 0; i < $scope.veiculos.length; i++) {
                    if ($scope.veiculos[i].selected) {
                        veiculos.push($scope.veiculos[i].value);
                    }
                }
                var fxHora = [];
                for (var i = 0; i < $scope.faixasHora.length; i++) {
                    if ($scope.faixasHora[i].selected) {
                        fxHora = fxHora.concat($scope.faixasHora[i].value);
                    }
                }
                var loadData = function () {
                    var deferred = $q.defer();
                    // anos, condicoesTempo, veiculos, regioes
                    Acidentes.porFaixaHora(
                        anos,
                        condicoesTempo,
                        veiculos                        
                    ).success(function (data) {
                        deferred.resolve(data);
                    });
                    return deferred.promise;
                }
                var promise = loadData();
                promise.then(function (data) {
                    $scope.optionsHistorical = {
                        chart: {
                            type: 'historicalBarChart',
                            height: 300,
                            width: 400,
                            margin: {
                                top: 20,
                                right: 20,
                                bottom: 65,
                                left: 50
                            },
                            x: function (d) { return d[0]; },
                            y: function (d) { return d[1]; },
                            // useVoronoi: false,
                            // showControls: false,
                            // clipEdge: true,

                            duration: 100,
                            xAxis: {
                                axisLabel: 'Faixa Horária',
                                tickFormat: function (d) {
                                    return d;
                                },
                                rotateLabels: 30,
                                showMaxMin: false
                            },
                            yAxis: {
                                axisLabel: 'Total',
                                axisLabelDistance: -10,
                                tickFormat: function (d) {
                                    return d;
                                }
                            },
                            tooltip: {
                                keyFormatter: function (d) {
                                    return d;
                                }
                            },
                            zoom: {
                                enabled: true,
                                scaleExtent: [1, 10],
                                useFixedDomain: false,
                                useNiceScale: false,
                                horizontalOff: false,
                                verticalOff: true,
                                unzoomEventType: 'dblclick.zoom'
                            }
                        }
                    };

                    $scope.dataHistorical = data;
                });
            }

            $scope.aplicarFiltrosESair = function () {
                $scope.regiaoPredicao ? $scope.porRegiaoPredicao() : $scope.porRegiao();
                $scope.faixaHoraPredicao ? $scope.porFaixaHoraPredicao() : $scope.porFaixaHora();
                $scope.tipoAcidentePredicao ? $scope.porTipoAcidentePredicao() : $scope.porTipoAcidente();
                $scope.toggleSidenavFiltros();
            }

            $scope.aplicarPredicaoESair = function () {
                $scope.regiaoPredicao ? $scope.porRegiaoPredicao() : $scope.porRegiao();
                $scope.faixaHoraPredicao ? $scope.porFaixaHoraPredicao() : $scope.porFaixaHora();
                $scope.tipoAcidentePredicao ? $scope.porTipoAcidentePredicao() : $scope.porTipoAcidente();
                $scope.toggleSidenavPredicao();
            }

            $scope.aplicar = function () {
                $scope.regiaoPredicao ? $scope.porRegiaoPredicao() : $scope.porRegiao();
                $scope.faixaHoraPredicao ? $scope.porFaixaHoraPredicao() : $scope.porFaixaHora();
                $scope.tipoAcidentePredicao ? $scope.porTipoAcidentePredicao() : $scope.porTipoAcidente();
            }

            $scope.$watch('faixaHoraPredicao', function (predicao) {
                if (predicao) {
                    $scope.porFaixaHoraPredicao();
                } else {
                    $scope.porFaixaHora();
                }
            });
            $scope.$watch('regiaoPredicao', function (predicao) {
                if (predicao) {
                    $scope.porRegiaoPredicao();
                } else {
                    $scope.porRegiao();
                }
            });
            $scope.$watch('tipoAcidentePredicao', function (predicao) {
                if (predicao) {
                    $scope.porTipoAcidentePredicao();
                } else {
                    $scope.porTipoAcidente();
                }
            });

            $scope.init = function () {
                $scope.regiaoPredicao ? $scope.porRegiaoPredicao() : $scope.porRegiao();
                $scope.tipoAcidentePredicao ? $scope.porFaixaHoraPredicao() : $scope.porFaixaHora();
                $scope.faixaHoraPredicao ? $scope.porTipoAcidentePredicao() : $scope.porTipoAcidente();
                $scope.heatMap();
            }

            $scope.init();

        }]);