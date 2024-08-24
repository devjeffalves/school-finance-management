const express = require('express');
const { generateMonthlyReport } = require('../controllers/reportControllers');

const router = express.Router();

// Rota para gerar relatórios mensais
router.get('/monthly', generateMonthlyReport);

module.exports = router;
