var express = require('express');
var heatMapController = require('../controllers/heatMapController');
var router = express.Router();
router.get('/acidentes', heatMapController.getAcidentes);
router.get('/acidentes-por-regiao', heatMapController.getAcidentesPorRegiao);
router.get('/qtd-acidentes-por-regiao', heatMapController.getQtdAcidentesPorRegiao);
router.get('/acidentes-locais-errados', heatMapController.acidentesLocaisErrados);
module.exports = router;