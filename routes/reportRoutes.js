const express = require('express');
const { generateMonthlyReport } = require('../controllers/reportController');

const router = express.Router();

// Rota para gerar relatórios mensais
router.get('/monthly', generateMonthlyReport);

module.exports = router;
