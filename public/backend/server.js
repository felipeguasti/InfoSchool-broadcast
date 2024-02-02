const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const informativoRoutes = require('./routes/broadcast');

// Inicializando o servidor Express
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Rotas
app.use('/api/informativo', informativoRoutes);

// Configuração da porta e inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

// Manipulação de erros
app.use((err, req, res, next) => {
    res.status(err.status || 500).send({
        error: {
            message: err.message
        }
    });
});

