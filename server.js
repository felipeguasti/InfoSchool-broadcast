const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const sequelize = require('./public/backend/database/db.js');
const sanitizeHtml = require('sanitize-html');
const broadcastRoutes = require('./public/backend/routes/broadcast.js');
const multer = require('multer');
const fs = require('fs');
const Informativo = require('./public/backend/models/informativo');

const storage = multer.diskStorage({
    destination: 'public/img/',
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 3000000 },
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Apenas arquivos de imagem são permitidos!'), false);
        }
        cb(null, true);
    }
});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    if (req.path === '/api/informativo' && req.method === 'POST' && req.is('application/json')) {
        req.body.mensagem = sanitizeHtml(req.body.mensagem, {
            allowedTags: ['b', 'i', 'em', 'strong', 'u', 'br'],
            allowedAttributes: {}
        });
    }
    next();
});

app.post('/api/upload', upload.single('imagem'), (req, res) => {
    if (req.file) {
        const serverBaseUrl = process.env.SERVER_BASE_URL || 'http://localhost:3000/';
        const fullImageUrl = `${serverBaseUrl}img/${req.file.filename}`;
        res.json({ imageUrl: fullImageUrl });
    } else {
        res.status(400).send('Nenhum arquivo foi enviado.');
    }
});

app.get('/api/informativo/:id', async (req, res) => {
    try {
        const informativo = await Informativo.findByPk(req.params.id);
        if (informativo) {
            res.json(informativo);
        } else {
            res.status(404).send({ error: 'Informativo não encontrado.' });
        }
    } catch (error) {
        console.error('Erro ao buscar informativo:', error);
        res.status(500).send({ error: error.message });
    }
});

app.post('/api/informativo', upload.single('imagemFile'), async (req, res) => {
    try {
        let informativoData = {
            titulo: req.body.titulo,
            mensagem: req.is('application/json') ? req.body.mensagem : sanitizeHtml(req.body.mensagem),
            imagemUrl: req.file ? `/img/${req.file.filename}` : req.body.imagemUrl,
            videoUrl: req.body.videoUrl,
            videoComSom: req.body.videoComSom === 'true' || req.body.videoComSom === true,
            turno: req.body.turno
        };

        if (req.body.id) {
            // Atualizar informativo existente
            let informativo = await Informativo.findByPk(req.body.id);
            if (informativo) {
                // Excluir imagem antiga, se houver uma nova
                if (req.file && informativo.imagemUrl) {
                    const oldImagePath = path.join(__dirname, 'public', informativo.imagemUrl);
                    fs.unlinkSync(oldImagePath);
                }
                await informativo.update(informativoData);
            } else {
                res.status(404).send({ error: 'Informativo não encontrado.' });
                return;
            }
        } else {
            // Criar novo informativo
            await Informativo.create(informativoData);
        }
        
        res.status(201).send({ message: 'Informativo salvo com sucesso.' });
    } catch (error) {
        console.error('Erro ao salvar informativo:', error);
        if (req.file) {
            // Excluir a imagem se houve um erro
            const imagePath = path.join(__dirname, 'public/img/', req.file.filename);
            fs.unlinkSync(imagePath);
        }
        res.status(500).send({ error: error.message });
    }
});

app.delete('/api/informativo/:id', async (req, res) => {
    try {
        const informativo = await Informativo.findByPk(req.params.id);
        if (informativo && informativo.imagemUrl) {
            const imagePath = path.join(__dirname, 'public', informativo.imagemUrl);
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error('Erro ao excluir imagem:', err);
                }
            });
        }
        await Informativo.destroy({ where: { id: req.params.id } });
        res.send({ message: 'Informativo deletado com sucesso.' });
    } catch (error) {
        console.error('Erro ao excluir informativo:', error);
        res.status(500).send({ error: error.message });
    }
});

app.use('/api/informativo', broadcastRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

app.get('/', (req, res) => {
    res.send('InfoSchool Broadcast Server está funcionando!');
});

app.use((err, req, res, next) => {
    res.status(err.status || 500).send({
        error: {
            message: err.message
        }
    });
});

module.exports = app;
