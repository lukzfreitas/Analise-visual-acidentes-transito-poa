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

            ///// ------------------------ Filtros ------------------------ /////
            $scope.veiculos = [
                { label: 'Automóvel', selected: true, value: "AUTO" },
                { label: 'Moto', selected: false, value: "MOTO" },
                { label: 'Caminhão', selected: false, value: "CAMINHAO" },
                { label: 'Táxi', selected: false, value: "TAXI" },
                { label: 'Lotação', selected: false, value: "LOTACAO" },
                { label: 'Ônibus', selected: false, value: "ONIBUS" },
                { label: 'Bicicleta', selected: false, value: "BICICLETA" },
                { label: 'Outro', selected: false, value: "OUTRO" }
            ]

            $scope.faixasHora = [
                { label: "Manhã (6h a 12h)", selected: true, value: [6, 7, 8, 9, 10, 11] },
                { label: "Tarde (12h a 18h)", selected: true, value: [12, 13, 14, 15, 16, 17] },
                { label: "Noite (18h a 0h)", selected: true, value: [18, 19, 20, 21, 22, 23] },
                { label: "Madrugada (0h a 6h)", selected: true, value: [0, 1, 2, 3, 4, 5] }
            ]

            $scope.condicoesTempo = [
                { label: "Bom", selected: true, value: "BOM" },
                { label: "Chuvoso", selected: true, value: "CHUVOSO" },
                { label: "Nublado", selected: true, value: "NUBLADO" }
            ]

            ///// ------------------------ Atributos Predição ------------------------ /////
            $scope.condicoesTempoPredicao = [
                { label: "Bom", value: "BOM" },
                { label: "Chuvoso", value: "CHUVOSO" },
                { label: "Nublado", value: "NUBLADO" }
            ]
            $scope.condicoesTempoPredicaoSelected = { label: "Chuvoso", value: "CHUVOSO" };

            $scope.noiteOuDiaPredicao = [
                { label: "Noite", value: "NOITE" },
                { label: "Dia", value: "DIA" }
            ]
            $scope.noiteOuDiaPredicaoSelected = { label: "Noite", value: "NOITE" };

            $scope.tiposAcidentesPredicao = [
                { label: "Atropelamento", value: "ATROPELAMENTO" },
                { label: "Capotagem", value: "CAPOTAGEM" },
                { label: "Choque", value: "CHOQUE" },
                { label: "Colisão", value: "COLISAO" },
                { label: "Incêndio", value: "INCENDIO" },
                { label: "Abalroamento", value: "ABALROAMENTO" },
                { label: "Queda", value: "QUEDA" },
                { label: "Tombamento", value: "TOMBAMENTO" }
            ]
            $scope.tiposAcidentesPredicaoSelected = { label: "Atropelamento", value: "ATROPELAMENTO" };

            $scope.diasDaSemanaPredicao = [
                { label: "Domingo", value: "DOMINGO" },
                { label: "Segunda-feira", value: "SEGUNDA-FEIRA" },
                { label: "Terça-feira", value: "TERÇA-FEIRA" },
                { label: "Quarta-feira", value: "QUARTA-FEIRA" },
                { label: "Quinta-feira", value: "QUINTA-FEIRA" },
                { label: "Sexta-feira", value: "SEXTA-FEIRA" },
                { label: "Sábado", value: "SABADO" }
            ]
            $scope.diaDaSemanaPredicaoSelected = { label: "Sexta-feira", value: "SEXTA-FEIRA" };

            $scope.regioesPredicao = [
                { label: "Norte", value: "NORTE" },
                { label: "Sul", value: "SUL" },
                { label: "Leste", value: "LESTE" },
                { label: "Centro", value: "CENTRO" }
            ]
            $scope.regiaoPredicaoSelected = { label: "Centro", value: "CENTRO" };

            $scope.listaUpsPredicao = [
                { label: "1 - Acidentes com danos materiais", value: 1 },
                { label: "5 - Acidentes com feridos", value: 5 },
                { label: "13 - Acidentes com mortes", value: 13 }
            ]
            $scope.upsPredicaoSelected = { label: "1 - Acidentes com danos materiais", value: 1 };                        

            ///// ------------------------ Filtro de anos ------------------------ /////
            $scope.anos = [];
            for (i = 2000; i <= 2016; i++) {
                if (i === 2016) {
                $scope.anos.push({ label: i, value: i, selected: true });
                } else {
                $scope.anos.push({ label: i, value: i, selected: false });
                }
            }

            $scope.totalAnosSelecionados = 1;
            $scope.selecionouAno = function (ano) {
                ano.selected ? $scope.totalAnosSelecionados-- : $scope.totalAnosSelecionados++;                                
                if ($scope.totalAnosSelecionados > 4) {
                    $scope.totalAnosSelecionados--;
                    $scope.desabilitarAnos = true;                    
                } 
            }

            $scope.habilitarAnos = function () {
                $scope.desabilitarAnos = false;
            }

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

            ///// ------------------------ Gráficos ------------------------ /////
            $scope.porRegiaoPredicao = function () {
                var anos = [];
                for (var i = 0; i < $scope.anos.length; i++) {
                    if ($scope.anos[i].selected) {
                        anos.push($scope.anos[i].value);
                    }
                }
                if (anos.length == 0) return;                                
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
                    // anos, veiculos, tempo, noite_dia, tipo_acidente, dia_semana, ups
                    Acidentes.porRegiaoPredicao(
                        [2016],
                        veiculos,
                        $scope.condicoesTempoPredicaoSelected.value,
                        $scope.noiteOuDiaPredicaoSelected.value,
                        $scope.tiposAcidentesPredicaoSelected.value,
                        $scope.diaDaSemanaPredicaoSelected.value,
                        $scope.upsPredicaoSelected.value
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
                            // y: function (d) { return d.y; },
                            y: function (d) { return d.y / 100; },
                            average: function (d) { return d.y / 100; },
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
                if (anos.length == 0) return;
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
                            // y: function (d) { return d.y; },
                            y: function (d) { return d.y; },
                            average: function (d) { return d.y; },
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
                if (anos.length == 0) return;                
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
                    // anos, veiculos, tempo, noite_dia, dia_semana, ups, regiao
                    Acidentes.porTipoAcidentePredicao(
                        [2016],
                        veiculos,
                        $scope.condicoesTempoPredicaoSelected.value,
                        $scope.noiteOuDiaPredicaoSelected.value,
                        $scope.diaDaSemanaPredicaoSelected.value,
                        $scope.upsPredicaoSelected.value,
                        $scope.regiaoPredicaoSelected.value
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
                            // y: function (d) { return d.value; },
                            y: function (d) { return d.value / 100; },
                            average: function (d) { return d.value / 100; },
                            //yErr: function(d){ return [-Math.abs(d.value * Math.random() * 0.3), Math.abs(d.value * Math.random() * 0.3)] },
                            showControls: false,
                            showValues: true,
                            duration: 500,
                            maxKeyLength: 100,
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
                if (anos.length == 0) return;                
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
                    // anos, fxHora, condicoesTempo, veiculos
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
                            // y: function (d) { return d.value; },
                            y: function (d) { return d.value; },
                            average: function (d) { return d.value; },
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
                if (anos.length == 0) return;
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
                    // anos, veiculos, tempo, noite_dia, tipo_acidente, dia_semana, ups, regiao
                    Acidentes.porFaixaHoraPredicao(
                        [2016],
                        veiculos,
                        $scope.condicoesTempoPredicaoSelected.value,
                        $scope.noiteOuDiaPredicaoSelected.value,
                        $scope.tiposAcidentesPredicaoSelected.value,
                        $scope.diaDaSemanaPredicaoSelected.value,
                        $scope.upsPredicaoSelected.value,
                        $scope.regiaoPredicaoSelected.value
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
                            y: function (d) { return d[1] / 100; },
                            average: function (d) { return d[1] / 100; },
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
                if (anos.length == 0) return;
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
                            average: function (d) { return d[1]; },
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
                $scope.tipoAcidentePredicao ? $scope.porTipoAcidentePredicao() : $scope.porTipoAcidente();
                $scope.faixaHoraPredicao ? $scope.porFaixaHoraPredicao() : $scope.porFaixaHora();                
            }

            $scope.init();

        }]);