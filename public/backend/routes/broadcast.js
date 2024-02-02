const express = require('express');
const Informativo = require('../models/informativo');
const router = express.Router();

// Função auxiliar para determinar o turno com base no horário de Brasília
function getTurnoAtual() {
    const now = new Date();
    const horaBrasilia = now.getUTCHours() - 3; // Convertendo para o horário de Brasília
    return (horaBrasilia >= 0 && horaBrasilia < 12.5) ? 'matutino' : 'vespertino';
}

// Rota para listar informativos, com opção de filtrar por turno
router.get('/', async (req, res) => {
    try {
        let condition = {};
        const filtroTurno = req.query.filtroTurno;

        if (filtroTurno === 'true') {
            const turnoAtual = getTurnoAtual();
            condition = { where: { turno: turnoAtual } };
        }

        const informativos = await Informativo.findAll(condition);
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
        await Informativo.destroy({ where: { id: req.params.id } });
        res.send({ message: 'Informativo deletado com sucesso.' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;