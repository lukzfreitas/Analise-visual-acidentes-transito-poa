var express = require('express');
var heatMapController = require('../controllers/heatMapController');
var router = express.Router();
router.get('/acidentes', heatMapController.getAcidentes);
router.get('/acidentes-por-regiao', heatMapController.qtdPorRegiao);
// router.get('/acidentes-feridos-mortos', heatMapController.qtdFeridosEMortos);
module.exports = router;