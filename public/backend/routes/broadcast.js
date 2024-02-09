const express = require('express');
const Informativo = require('../models/informativo');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const sequelize = require('../database/db');
const Mensagem = require('../models/mensagem');

// Função auxiliar para determinar o turno com base no horário de Brasília
function getTurnoAtual() {
    const now = new Date();
    const horaBrasilia = now.getUTCHours() - 3; // Convertendo para o horário de Brasília
    return (horaBrasilia >= 0 && horaBrasilia < 12.5) ? 'matutino' : 'vespertino';
}

// Rota para listar informativos, com opção de filtrar por turno
router.get('/', async (req, res) => {
    try {
        const turnoAtual = getTurnoAtual();
        const filtroTurno = req.query.filtroTurno === 'true';

        let query = 'SELECT * FROM informativos';
        let replacements = {};

        if (filtroTurno) {
            query += ' WHERE turno = :turnoAtual OR turno = "ambos"';
            replacements = { turnoAtual };
        }

        const informativos = await sequelize.query(query, { 
            replacements: replacements,
            type: sequelize.QueryTypes.SELECT 
        });

        res.send(informativos);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Rota para criar um novo informativo
router.post('/', async (req, res) => {
    try {
        const { titulo, mensagem, imagemUrl, videoUrl, videoComSom, turno } = req.body;
        const novoInformativo = await Informativo.create({ 
            titulo, 
            mensagem, 
            imagemUrl, 
            videoUrl, 
            videoComSom, 
            turno 
        });
        res.status(201).send(novoInformativo);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Rota para atualizar um informativo
router.put('/:id', async (req, res) => {
    try {
        const { titulo, mensagem, imagemUrl, videoUrl, videoComSom, turno } = req.body;
        await Informativo.update(
            { titulo, mensagem, imagemUrl, videoUrl, videoComSom, turno }, 
            { where: { id: req.params.id } }
        );
        res.send({ message: 'Informativo atualizado com sucesso.' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Rota para deletar um informativo
router.delete('/:id', async (req, res) => {
    try {
        // Primeiro, obtenha o informativo para acessar o URL da imagem
        const informativo = await Informativo.findByPk(req.params.id);
        if (!informativo) {
            return res.status(404).send({ message: 'Informativo não encontrado.' });
        }

        // Obtenha o URL da imagem e processe para obter o caminho do arquivo
        const imageUrl = informativo.imagemUrl;
        const imagePath = imageUrl ? path.join(__dirname, '..', '..', 'public', 'img', path.basename(imageUrl)) : null;

        // Exclua o informativo do banco de dados
        await Informativo.destroy({ where: { id: req.params.id } });

        // Exclua o arquivo de imagem, se existir
        if (imagePath && fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        res.send({ message: 'Informativo deletado com sucesso.' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Rota para criar/atualizar a mensagem do footer
router.post('/mensagemFooter', async (req, res) => {
    try {
        const { texto } = req.body;

        // Remove a mensagem antiga, se houver
        await Mensagem.destroy({ where: {} });

        // Cria a nova mensagem
        const novaMensagem = await Mensagem.create({ texto });

        res.status(201).json(novaMensagem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
