const db = require('../config/firebaseConfig');

const generateMonthlyReport = async (req, res) => {
  try {
    const { year, month } = req.query;
    const startOfMonth = `${year}-${month}-01`;
    const endOfMonth = `${year}-${month}-31`;

    // Consulta para entradas (incomes)
    const incomeQuery = db.collection('incomes')
      .where('date', '>=', startOfMonth)
      .where('date', '<=', endOfMonth);
    const incomeSnapshot = await incomeQuery.get();
    const incomes = incomeSnapshot.docs.map(doc => doc.data());

    // Consulta para saídas (expenses)
    const expenseQuery = db.collection('expenses')
      .where('date', '>=', startOfMonth)
      .where('date', '<=', endOfMonth);
    const expenseSnapshot = await expenseQuery.get();
    const expenses = expenseSnapshot.docs.map(doc => doc.data());

    const report = {
      incomes,
      expenses,
      totalIncome: incomes.reduce((sum, income) => sum + income.amount, 0),
      totalExpenses: expenses.reduce((sum, expense) => sum + expense.amount, 0),
    };

    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  generateMonthlyReport,
};
