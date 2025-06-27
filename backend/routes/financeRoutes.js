const express = require('express');
const router = express.Router();
const { createFinance, getAllFinances, updateFinance, deleteFinance, searchFinances, getFinanceSummary } = require('../controllers/financeController');

router.post('/create', createFinance);
router.get('/all', getAllFinances);
router.put('/update/:id', updateFinance);
router.delete('/delete/:id', deleteFinance);
router.get('/search', searchFinances);
router.get('/summary', getFinanceSummary);

module.exports = router;
