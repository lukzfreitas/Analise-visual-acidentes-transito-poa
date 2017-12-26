var express = require('express');
var heatMapController = require('../controllers/heatMapController');
var router = express.Router();
router.get('/acidentes', heatMapController.getAcidentes);
router.get('/acidentesPorRegiao', heatMapController.getAcidentesPorRegiao);
module.exports = router;