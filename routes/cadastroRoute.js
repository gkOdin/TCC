// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const path = require('path');

// const UsuarioController = require('./controllers/usuarioController');
// const usuarioController = new UsuarioController();

// // Configurar o multer
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/'); // Diretório onde os arquivos serão salvos
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`); // Nome do arquivo
//   },
// });
// const upload = multer({ storage });

// // Rota de cadastro com upload de foto
// router.post('/cadastro', upload.single('foto'), usuarioController.cadastrarUsuario);

// module.exports = Router;