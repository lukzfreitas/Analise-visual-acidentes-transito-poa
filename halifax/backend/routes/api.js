var express = require('express');
var regioesAcidentes = require('../controllers/regioesAcidentes');
var tiposAcidentes = require('../controllers/tiposAcidentes');
var faixaHoraAcidentes = require('../controllers/faixaHoraAcidentes');
var heatMap = require('../controllers/heatMapAcidentes');
var router = express.Router();
router.get('/acidentes-por-regiao', regioesAcidentes.total);
router.get('/acidentes-por-regiao-predicao', regioesAcidentes.predicao);
router.get('/acidentes-por-tipo', tiposAcidentes.total);
router.get('/acidentes-por-tipo-predicao', tiposAcidentes.predicao);
router.get('/acidentes-por-faixa-hora', faixaHoraAcidentes.total);
router.get('/acidentes-por-faixa-hora-predicao', faixaHoraAcidentes.predicao);
router.get('/heat-map', heatMap.populate);
module.exports = router;