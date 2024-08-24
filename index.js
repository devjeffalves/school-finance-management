const express = require('express');
const financeRoutes = require('./routes/financeRoutes');
const reportRoutes = require('./routes/reportRoutes');
const totalRoutes = require ('./routes/totalRoutes');


const app = express();
//Importar o modulo Swagger
const setupSwagger = require('./swagger');

// Configurar Swagger
setupSwagger(app);

app.use(express.json());
app.use('/api', financeRoutes);
app.use('/api', reportRoutes);
app.use('/api', totalRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
