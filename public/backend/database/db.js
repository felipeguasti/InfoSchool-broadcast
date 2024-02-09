const Sequelize = require('sequelize');

// Configuração do banco de dados SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'informativos.db' // Este arquivo será criado automaticamente no diretório raiz do projeto
});

// Testando a conexão com o banco de dados
sequelize
  .authenticate()
  .then(() => {
    console.log("Conexão com o banco de dados MySQL estabelecida com sucesso.");
    // Sincronize aqui se quiser que as tabelas sejam criadas automaticamente
    sequelize.sync().then(() => {
      console.log("Tabelas criadas/atualizadas com sucesso no MySQL.");
    });
  })
  .catch((err) => {
    console.error("Não foi possível conectar ao banco de dados MySQL:", err);
  });

module.exports = sequelize;
