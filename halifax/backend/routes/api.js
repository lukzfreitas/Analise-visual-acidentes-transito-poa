var express = require('express');
var regioesAcidentes = require('../controllers/regioesAcidentes');
var tiposAcidentes = require('../controllers/tiposAcidentes');
var upsAcidentes = require('../controllers/upsAcidentes')
var router = express.Router();
router.get('/acidentes-por-regiao', regioesAcidentes.total);
router.get('/acidentes-por-regiao-predicao', regioesAcidentes.predicao);
router.get('/acidentes-por-tipo', tiposAcidentes.total);
router.get('/acidentes-por-tipo-predicao', tiposAcidentes.predicao);
router.get('/acidentes-por-ups', upsAcidentes.total);
module.exports = router;