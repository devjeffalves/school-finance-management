const express = require('express');
const financeRoutes = require('./routes/financeRoutes');


const app = express();
//Importar o modulo Swagger
const setupSwagger = require('./swagger');

// Configurar Swagger
setupSwagger(app);

app.use(express.json());
app.use('/api', financeRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
