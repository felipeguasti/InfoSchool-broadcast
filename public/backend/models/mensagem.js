const Sequelize = require('sequelize');
const db = require('../database/db');

const Mensagem = db.define('mensagem', {
    texto: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Mensagem;
