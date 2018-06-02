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

            $scope.toggleSidenav = buildToggler('closeEventsDisabled');

            function buildToggler(componentId) {
                return function () {
                    $mdSidenav(componentId).toggle();
                };
            }

            $scope.regiaoPredicao = false;
            $scope.tipoAcidentePredicao = false;
            $scope.historicalPredicao = true;

            $scope.anos = [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016];
            $scope.anosSelecionados = [2016];

            $scope.selecionaAno = function (anoSelec, listaAnos) {
                var index = listaAnos.indexOf(anoSelec);
                if (index > -1) {
                    listaAnos.splice(idx, 1);
                }
                else {
                    listaAnos.push(anoSelec);
                }
            };

            $scope.exists = function (anoSelec, listaAnos) {
                return listaAnos.indexOf(anoSelec) > -1;
            }



            $scope.faixasHora = [
                { label: "Manhã (6h a 12h)", selected: true, value: [6, 7, 8, 9, 10, 11] },
                { label: "Tarde (12h a 18h)", selected: true, value: [12, 13, 14, 15, 16, 17] },
                { label: "Manhã (18h a 24h)", selected: false, value: [18, 19, 20, 21, 22, 23] },
                { label: "Manhã (24h a 6h)", selected: false, value: [24, 1, 2, 3, 4, 5] }
            ]

            $scope.condicoesTempo = [
                { label: "Bom", selected: true, value: "BOM" },
                { label: "Chuvoso", selected: false, value: "CHUVOSO" },
                { label: "Nublado", selected: false, value: "NUBLADO" }
            ]

            $scope.veiculos = [
                { label: 'Automóvel', selected: false, value: "AUTOMOVEL" },
                { label: 'Moto', selected: false, value: "MOTO" },
                { label: 'Caminhão', selected: true, value: "CAMINHAO" },
                { label: 'Táxi', selected: false, value: "TAXI" },
                { label: 'Lotação', selected: false, value: "LOTACAO" },
                { label: 'Ônibus', selected: false, value: "ONIBUS" },
                { label: 'Bicicleta', selected: false, value: "BICICLETA" },
                { label: 'Outro', selected: false, value: "OUTRO" }
            ]

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

            $scope.mesSelected = { label: "Janeiro", value: 1 };
            $scope.diaSelected = { label: "Dia 1", value: 1 };

            $scope.aplicar = function () {
                $scope.init();
                $scope.toggleSidenav();
            }

            $scope.init = function () {

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

                var porRegiaoPredicao = function () {
                    var loadData = function () {
                        var deferred = $q.defer();
                        Acidentes.porRegiaoPredicao(
                            $scope.anosSelecionados,
                            $scope.mesSelected.value,
                            $scope.diaSelected.value,
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
                                width: 300,
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

                var porRegiao = function () {
                    var loadData = function () {
                        var deferred = $q.defer();
                        Acidentes.porRegiao(
                            $scope.anosSelecionados,
                            $scope.mesSelected.value,
                            $scope.diaSelected.value,
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
                                width: 300,
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

                var porTipoAcidentePredicao = function () {
                    var loadData = function () {
                        var deferred = $q.defer();
                        Acidentes.porTipoAcidentePredicao(
                            $scope.anosSelecionados,
                            $scope.mesSelected.value,
                            $scope.diaSelected.value,
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
                                width: 350,
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
                                        return d3.format(',.2f')(d);
                                    }
                                }
                            }
                        };
                        $scope.dataMultiBar = data;
                    });
                }

                var porTipoAcidente = function () {
                    var loadData = function () {
                        var deferred = $q.defer();
                        Acidentes.porTipoAcidente(
                            $scope.anosSelecionados,
                            $scope.mesSelected.value,
                            $scope.diaSelected.value,
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
                                width: 350,
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
                                        return d3.format(',.2f')(d);
                                    }
                                }
                            }
                        };
                        $scope.dataMultiBar = data;
                    });
                }

                var porAno = function () {
                    var loadData = function () {
                        var deferred = $q.defer();
                        Acidentes.porUPS(
                            $scope.anosSelecionados,
                            $scope.mesSelected.value,
                            $scope.diaSelected.value,
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
                        $scope.optionsHistorical = {
                            chart: {
                                type: 'historicalBarChart',
                                height: 350,
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
                                    axisLabel: 'Faixa de Horária',
                                    tickFormat: function (d) {
                                        return d;
                                    },
                                    rotateLabels: 30,
                                    showMaxMin: false
                                },
                                yAxis: {
                                    axisLabel: 'Y Axis',
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

                $scope.$watch('historicalPredicao', function (predicao) {
                    console.log("chegou aqui")
                    if (predicao) {
                        porAno();
                    } else {
                        porAno();
                    }
                });
                $scope.$watch('regiaoPredicao', function (predicao) {
                    if (predicao) {
                        porRegiaoPredicao();
                    } else {
                        porRegiao();
                    }
                });
                $scope.$watch('tipoAcidentePredicao', function (predicao) {
                    if (predicao) {
                        porTipoAcidentePredicao();
                    } else {
                        porTipoAcidente();
                    }
                });
            }
            $scope.init();

            // Linha para selecionar período de anos
            $scope.slider = {
                min: 2010,
                max: 2014,
                options: {
                    floor: 2000,
                    ceil: 2016,
                    showTicksValues: true
                }
            };
        }]);