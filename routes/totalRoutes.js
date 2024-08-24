const express = require('express');
const router = express.Router();
const db = require('../config/firebaseConfig');


/**
 * @swagger
 * /total:
 *   get:
 *     summary: Calcula a soma total de todas as entradas (incomes) e saídas (expenses).
 *     tags: [Finance]
 *     responses:
 *       200:
 *         description: Retorna a soma total das entradas e saídas.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalIncome:
 *                   type: number
 *                   description: Soma total de todas as entradas.
 *                   example: 2300.00
 *                 totalExpense:
 *                   type: number
 *                   description: Soma total de todas as saídas.
 *                   example: 3900.00
 *       400:
 *         description: Erro ao calcular as somatórias.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensagem de erro.
 *                   example: "Erro ao buscar dados no banco de dados."
 */

// Rota para calcular a soma de entradas (incomes) e saídas (expenses)
router.get('/total', async (req, res) => {
  try {
    // Calculando a soma das entradas (incomes)
    const incomesSnapshot = await db.collection('incomes').get();
    const totalIncome = incomesSnapshot.docs.reduce((sum, doc) => sum + doc.data().amount, 0);

    // Calculando a soma das saídas (expenses)
    const expensesSnapshot = await db.collection('expenses').get();
    const totalExpense = expensesSnapshot.docs.reduce((sum, doc) => sum + doc.data().amount, 0);

    // Retornando o resultado da soma
    res.json({ totalIncome, totalExpense });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
