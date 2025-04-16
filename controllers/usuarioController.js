const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();
const path = require('path');
const fs = require('fs');

exports.cadastrarUsuario = async (req, res) => {
    const { email, nome, senha } = req.body;
    const foto = req.file; // Captura o arquivo enviado

    // Validação dos campos
    if (!email || !nome || !senha) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    try {
        // Verifica se o usuário já existe
        const usuarioExistente = await prisma.tb_usuarios.findUnique({
            where: { email },
        });

        if (usuarioExistente) {
            return res.status(400).json({ error: 'E-mail já cadastrado.' });
        }

        // Criptografar a senha antes de armazenar
        const senhaHash = await bcrypt.hash(senha, 10);

        // Lógica para salvar a imagem
        let caminhoArquivo = '';
        if (foto) {
            const nomeArquivo = Date.now() + path.extname(foto.originalname);
            caminhoArquivo = path.join(__dirname, '../../uploads', nomeArquivo);
            fs.writeFileSync(caminhoArquivo, foto.buffer); // Salva a imagem no diretório 'uploads'
        }

        // Criar novo usuário no banco de dados
        const usuario = await prisma.tb_usuarios.create({
            data: {
                email,
                nome,
                senha: senhaHash,
                arquivo: caminhoArquivo || '', // Armazena o caminho da imagem se existir
            },
        });

        res.status(201).json({ message: 'Usuário cadastrado com sucesso!', usuario });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
    }
};