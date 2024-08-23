const express = require('express');
const router = express.Router();
const db = require('../config/firebaseConfig'); // Certifique-se de que o caminho está correto
const { body, validationResult } = require('express-validator');


/**
 * @swagger
 * components:
 *   schemas:
 *     Income:
 *       type: object
 *       required:
 *         - description
 *         - amount
 *         - date
 *         - category
 *         - subcategory
 *       properties:
 *         id:
 *           type: string
 *           description: ID gerado automaticamente pelo Firebase
 *         description:
 *           type: string
 *           description: Descrição da entrada
 *         amount:
 *           type: number
 *           description: Valor da entrada
 *         date:
 *           type: string
 *           format: date
 *           description: Data da entrada
 *         category:
 *           type: string
 *           description: Categoria da entrada
 *         subcategory:
 *           type: string
 *           description: Subcategoria da entrada
 */


// Rota de criação de income com validação


/**
 * @swagger
 * /income:
 *   post:
 *     summary: Adiciona uma nova entrada (income)
 *     tags: [Income]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Income'
 *     responses:
 *       201:
 *         description: Entrada criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Income'
 *       400:
 *         description: Erro ao criar entrada
 */
router.post('/income',
  [
    body('description').isString().withMessage('Descrição deve ser um texto'),
    body('amount').isFloat({ gt: 0 }).withMessage('Valor deve ser um número maior que zero'),
    body('date').isISO8601().withMessage('Data deve estar no formato ISO 8601'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const { description, amount, date, category, subcategory } = req.body; // Adicione campos de categoria e subcategoria
      const incomeRef = db.collection('incomes').doc();
      await incomeRef.set({ description, amount, date, category, subcategory }); // Salve os campos de categoria e subcategoria
      res.status(201).json({ id: incomeRef.id, description, amount, date, category, subcategory });
    } catch (error)  {
      res.status(400).json({ error: error.message });
    }
  }
);


/**
 * @swagger
 * /income:
 *   get:
 *     summary: Retorna todas as entradas (income)
 *     tags: [Income]
 *     responses:
 *       200:
 *         description: Lista de todas as entradas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Income'
 *       400:
 *         description: Erro ao buscar entradas
 */

router.get('/income', async (req, res) => {
  try {
    const snapshot = await db.collection('incomes').get(); // Recupera os documentos da coleção 'incomes'
    const incomes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(incomes);
  } catch (error) {
    console.error("Erro ao buscar entradas:", error);
    res.status(400).json({ error: error.message });
  }
});

router.get('/income', async (req, res) => {
  try {
    let query = db.collection('incomes');

    // Filtragem por data
    if (req.query.startDate) {
      query = query.where('date', '>=', req.query.startDate);
    }
    if (req.query.endDate) {
      query = query.where('date', '<=', req.query.endDate);
    }

    // Filtragem por categoria e subcategoria
    if (req.query.category) {
      query = query.where('category', '==', req.query.category);
    }
    if (req.query.subcategory) {
      query = query.where('subcategory', '==', req.query.subcategory);
    }

    const snapshot = await query.get();
    const incomes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(incomes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/income/:id', async (req, res) => {
  try {
    const incomeRef = db.collection('incomes').doc(req.params.id);
    await incomeRef.update(req.body);
    res.status(200).json({ id: req.params.id, ...req.body });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/income/:id', async (req, res) => {
  try {
    await db.collection('incomes').doc(req.params.id).delete();
    res.status(200).json({ message: 'Entrada excluída com sucesso' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



// Rotas para Expenses (Saídas)
router.post('/expense', async (req, res) => {
  try {
    const expenseRef = db.collection('expenses').doc(); // Certifique-se de que `db.collection` é uma função
    await expenseRef.set(req.body); // Salva os dados no Firestore
    res.status(201).json({ id: expenseRef.id, ...req.body });
  } catch (error) {
    console.error("Erro ao adicionar saída:", error);
    res.status(400).json({ error: error.message });
  }
});

router.get('/expense', async (req, res) => {
  try {
    const snapshot = await db.collection('expenses').get(); // Recupera os documentos da coleção 'expenses'
    const expenses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(expenses);
  } catch (error) {
    console.error("Erro ao buscar saídas:", error);
    res.status(400).json({ error: error.message });
  }
});

// Similarmente, adicione a lógica de filtragem para expenses
router.get('/expense', async (req, res) => {
  try {
    let query = db.collection('expenses');
    if (req.query.startDate) {
      query = query.where('date', '>=', req.query.startDate);
    }
    if (req.query.endDate) {
      query = query.where('date', '<=', req.query.endDate);
    }
    if (req.query.type) {
      query = query.where('type', '==', req.query.type); // Exemplo de filtro adicional
    }

    const snapshot = await query.get();
    const expenses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(expenses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/expense/:id', async (req, res) => {
  try {
    const incomeRef = db.collection('expenses').doc(req.params.id);
    await incomeRef.update(req.body);
    res.status(200).json({ id: req.params.id, ...req.body });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/expense/:id', async (req, res) => {
  try {
    await db.collection('expenses').doc(req.params.id).delete();
    res.status(200).json({ message: 'Saída excluída com sucesso' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



module.exports = router;
