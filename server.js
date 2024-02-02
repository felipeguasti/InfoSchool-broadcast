const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const sequelize = require('./public/backend/database/db.js'); // Verifique o caminho

// Criando a aplicação Express
const app = express();

// Aplicando middlewares
app.use(bodyParser.json());
app.use(cors());

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Importando as rotas do informativo
const broadcastRoutes = require('./public/backend/routes/broadcast.js'); // Verifique o caminho
app.use('/api/informativo', broadcastRoutes);

// Sincronizando o Sequelize com o banco de dados - Desmarque caso resincronizar o banco de dados.
sequelize.sync({ force: true }) // ATENÇÃO: Isso recriará suas tabelas!
    .then(() => {
        console.log("Banco de dados sincronizado.");
    })
    .catch(error => {
        console.error('Erro ao sincronizar o banco de dados:', error);
    });

// Inicializando o servidor na porta 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

// Definindo uma rota de teste
app.get('/', (req, res) => {
    res.send('InfoSchool Broadcast Server está funcionando!');
});

// Manipulação de erros
app.use((err, req, res, next) => {
    res.status(err.status || 500).send({
        error: {
            message: err.message
        }
    });
});
