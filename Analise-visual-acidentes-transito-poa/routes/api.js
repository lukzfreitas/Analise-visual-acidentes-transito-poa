var express = require('express');
var heatMapController = require('../controllers/heatMapController');
var router = express.Router();
router.get('/acidentes', heatMapController.getAcidentes);
module.exports = router;