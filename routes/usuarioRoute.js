const express = require('express');
const multer = require('multer');
const { cadastrarUsuario } = require('../controllers/usuarioController');

const router = express.Router();
const upload = multer(); // Configuração padrão do multer para armazenar em memória

// Rota para cadastrar um novo usuário
router.post('/cadastrar', upload.single('foto'), cadastrarUsuario);

module.exports = router;