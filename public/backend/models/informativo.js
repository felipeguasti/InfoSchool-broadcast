const Sequelize = require('sequelize');
const db = require('../database/db');

// Definição do modelo 'Informativo'
const Informativo = db.define('informativo', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    titulo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    mensagem: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    imagemUrl: {
        type: Sequelize.STRING,
        allowNull: true
    },
    videoUrl: {
        type: Sequelize.STRING,
        allowNull: true
    },
    videoComSom: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    turno: { // Novo campo adicionado
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'matutino' // Valor padrão pode ser 'matutino' ou 'vespertino'
    }
}, {
    timestamps: false
});

module.exports = Informativo;
