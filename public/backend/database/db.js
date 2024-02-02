const Sequelize = require('sequelize');

// Configuração do banco de dados SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'informativos.db' // Este arquivo será criado automaticamente no diretório raiz do projeto
});

// Testando a conexão com o banco de dados
sequelize.authenticate()
    .then(() => {
        console.log('Conexão com o banco de dados estabelecida com sucesso.');
        // Sincronize aqui se quiser que as tabelas sejam criadas automaticamente
        // Você pode remover este trecho se preferir gerenciar o esquema do banco manualmente
        sequelize.sync().then(() => {
            console.log("Tabelas criadas/atualizadas com sucesso.");
        });
    })
    .catch(err => {
        console.error('Não foi possível conectar ao banco de dados:', err);
    });

module.exports = sequelize;
