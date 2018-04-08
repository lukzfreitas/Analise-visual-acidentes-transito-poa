// var express = require('express');
var router = require('express').Router();
var heatMapController = require('../controllers/heatMapController');

router.get('/acidentes', heatMapController.getAcidentes);
// router.get('/acidentes-por-regiao', heatMapController.getAcidentesPorRegiao);
// router.get('/qtd-acidentes-por-regiao', heatMapController.getQtdAcidentesPorRegiao);
// router.get('/acidentes-locais-errados', heatMapController.acidentesLocaisErrados);
module.exports = router;