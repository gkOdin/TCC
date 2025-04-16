const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client'); // Importa o Prisma Client
const upload = require('../upload'); // Importa o middleware do multer
const bcrypt = require('bcrypt'); // para hash
const passport = require('passport');
const dns = require('dns');

const db = new PrismaClient();

// Rota para cadastrar usuário
router.post('/cadastro', upload.single('foto'), async (req, res) => {
    const { nome, email, senha } = req.body;
    const arquivo = req.file ? req.file.filename : null; // Salva apenas o nome do arquivo

    // Verifica se o e-mail tem um formato válido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.render('cadastro', { error: 'Por favor, insira um e-mail válido.' });
    }

    // Verifica se o domínio do e-mail existe
    const domain = email.split('@')[1];
    dns.resolveMx(domain, async (err, addresses) => {
        if (err || addresses.length === 0) {
            return res.render('cadastro', { error: 'O domínio do e-mail não é válido.' });
        }

        try {
            // Verifica se o e-mail já existe
            const usuarioExistente = await db.tb_usuarios.findUnique({ where: { email } });
            if (usuarioExistente) {
                return res.render('cadastro', { error: 'E-mail já cadastrado. Por favor, escolha outro.' });
            }

            // Hash da senha
            const hashedPassword = await bcrypt.hash(senha, 10);

            await db.tb_usuarios.create({
                data: {
                    nome,
                    email,
                    senha: hashedPassword,
                    arquivo,
                },
            });
            res.redirect('/login'); // Redireciona após cadastro bem-sucedido
        } catch (error) {
            console.error(error);
            res.status(500).send('Erro ao cadastrar usuário');
        }
    });
});

// verifica código
router.post('/verificar-email', async (req, res) => {
    const { email, code } = req.body;

    try {
        const usuario = await db.tb_usuarios.findUnique({ where: { email } });

        if (!usuario) {
            return res.status(404).send('Usuário não encontrado.');
        }

        if (usuario.verificationCode === parseInt(code)) {
            await db.tb_usuarios.update({
                where: { email },
                data: { isVerified: true }, // Marca como verificado
            });
            return res.send('E-mail verificado com sucesso!');
        } else {
            return res.status(400).send('Código de verificação inválido.');
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('Erro ao verificar e-mail.');
    }
});

// Rota de login
router.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        const usuario = await db.tb_usuarios.findUnique({ where: { email } });

        if (!usuario) {
            return res.render('login', { error: 'Usuário não encontrado.' });
        }

        if (await bcrypt.compare(senha, usuario.senha)) {
            req.session.userId = usuario.id;
            req.session.userName = usuario.nome;
            req.session.userFoto = usuario.arquivo;

            return res.redirect('/'); // Redireciona para a página inicial ou outra página desejada
        } else {
            return res.render('login', { error: 'Senha incorreta.' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('Erro ao fazer login.');
    }
});


// Rota para logout
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/');
        }

        res.clearCookie('connect.sid');
        res.redirect('/');
    });
});

// Outras Rotas
router.get('/cadastro', (req, res) => res.render('cadastro'));
router.get('/login', (req, res) => res.render('login'));
router.get('/', (req, res) => res.render('main.ejs'));

router.get('/futebol', (req, res) => {
    const esporte = req.query.esporte;
    res.render('futebol.ejs', {esporte})
});
router.get('/handebol', (req, res) => {
    const esporte = req.query.esporte;
    res.render('handbol.ejs', {esporte})
} );
router.get('/volei', (req, res) => {
    const esporte = req.query.esporte;
    res.render('volei.ejs', {esporte})
});
router.get('/basquete', (req, res) =>{
    const esporte = req.query.esporte;
    res.render('basquete.ejs', {esporte})
} );

router.get('/esportes', (req, res) => res.render('esportes.ejs'));
router.get('/sobre', (req, res) => res.render('sobre.ejs'));

router.get('/forum', async (req, res) => {
    try {
        const idUser = req.session.userId;
        const esporte = req.query.esporte;

        const perguntas = await db.tb_perguntas.findMany({
            where: {
                categorias: {
                    nomeCat: esporte
                }
            },
            include: {
                usuarios: true,
                categorias: true,
                respostas: {
                    include: {
                        usuarios: true,
                    },
                },
            },
            orderBy: {
                idPer: 'desc'
            }
        });

        // Fetch avaliacoes for each pergunta
        const perguntasComAvaliacoes = await Promise.all(perguntas.map(async (pergunta) => {
            const avaliacoes = await db.tb_avaliacoes.findMany({
                where: {
                    idPost: pergunta.idPer,
                    tipoPost: 'pergunta'
                }
            });
            const likes = avaliacoes.filter(a => a.tipoAva === 'like').length;
            const dislikes = avaliacoes.filter(a => a.tipoAva === 'dislike').length;
            const userAvaliacao = avaliacoes.find(a => a.idUsuAva === idUser)?.tipoAva || null;

            return {
                ...pergunta,
                likes,
                dislikes,
                userAvaliacao
            };
        }));

        return res.render('forum.ejs', {
            perguntas: perguntasComAvaliacoes,
            isLoggedIn: !!idUser,
            idUser,
            esporte,
            semPerguntas: perguntas.length === 0
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send('Erro ao carregar o fórum');
    }
});

router.get('/perfil', (req, res) => res.render('perfil.ejs'));

router.get('/:tipoPost/:idPost/avaliacoes', async (req, res) => {
    const { tipoPost, idPost } = req.params;
    const idUsuAva = req.session.userId;

    try {
        const avaliacoes = await db.tb_avaliacoes.findMany({
            where: {
                idPost: parseInt(idPost),
                tipoPost
            }
        });
        const likes = avaliacoes.filter(a => a.tipoAva === 'like').length;
        const dislikes = avaliacoes.filter(a => a.tipoAva === 'dislike').length;
        const userAvaliacao = avaliacoes.find(a => a.idUsuAva === idUsuAva)?.tipoAva || null;

        res.json({ likes, dislikes, userAvaliacao });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao buscar avaliações');
    }
});

router.post('/avaliar/:tipoPost/:idPost', async (req, res) => {
    const { tipoPost, idPost } = req.params;
    const { tipoAva } = req.body;
    const idUsuAva = req.session.userId;

    if(!idUsuAva) {
        res.redirect('/')
    }

    try {
        // Primeiro, verificamos se já existe uma avaliação
        const existingAvaliacao = await db.tb_avaliacoes.findFirst({
            where: {
                idUsuAva,
                idPost: parseInt(idPost),
                tipoPost
            }
        });

        if (existingAvaliacao) {
            if (existingAvaliacao.tipoAva === tipoAva) {
                // Se o usuário clicou no mesmo botão, removemos a avaliação
                await db.tb_avaliacoes.delete({
                    where: { idAva: existingAvaliacao.idAva }
                });
            } else {
                // Se o usuário mudou sua avaliação, atualizamos
                await db.tb_avaliacoes.update({
                    where: { idAva: existingAvaliacao.idAva },
                    data: { tipoAva }
                });
            }
        } else {
            // Se não existe, criamos uma nova avaliação
            await db.tb_avaliacoes.create({
                data: {
                    idUsuAva,
                    idPost: parseInt(idPost),
                    tipoPost,
                    tipoAva
                }
            });
        }

        // Buscamos as contagens atualizadas
        const avaliacoes = await db.tb_avaliacoes.findMany({
            where: {
                idPost: parseInt(idPost),
                tipoPost
            }
        });
        const likes = avaliacoes.filter(a => a.tipoAva === 'like').length;
        const dislikes = avaliacoes.filter(a => a.tipoAva === 'dislike').length;
        const userAvaliacao = avaliacoes.find(a => a.idUsuAva === idUsuAva)?.tipoAva || null;

        res.json({ likes, dislikes, userAvaliacao });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao avaliar');
    }
});

router.get('/pergunta/:esporte', (req, res) => {
    const { esporte } = req.params;
    res.render('pergunta.ejs', { esporte });
});

// Rota para criar uma nova pergunta
router.post('/perguntas/:esporte', async (req, res) => {
    const { tituloPer, conteudoPer } = req.body;
    const { esporte } = req.params;
    const idUsu = req.session.userId;

    try {
        const categoria = await db.tb_categoria.findFirst({
            where: { nomeCat: esporte }
        });

        if (!categoria) {
            return res.status(404).send('Categoria não encontrada');
        }

        await db.tb_perguntas.create({
            data: {
                tituloPer,
                conteudoPer,
                categorias: {
                    connect: { idCat: categoria.idCat }
                },
                usuarios: {
                    connect: { id: idUsu }
                }
            },
        });
        res.redirect(`/forum?esporte=${esporte}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao criar a pergunta');
    }
});

// Rota para editar uma pergunta
router.put('/perguntas/:id', async (req, res) => {
    const { id } = req.params;
    const { tituloPer, conteudoPer } = req.body;

    try {
        const perguntaAtualizada = await db.tb_perguntas.update({
            where: { idPer: Number(id) },
            data: { tituloPer, conteudoPer },
        });
        res.json(perguntaAtualizada);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao editar a pergunta');
    }
});

// Rota para deletar uma pergunta
router.delete('/perguntas/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await db.tb_perguntas.delete({
            where: { idPer: Number(id) },
        });
        res.json({ message: 'Pergunta deletada com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao deletar a pergunta');
    }
});

router.get('/perguntas/:idPer/respostas', async (req, res) => {
    const { idPer } = req.params;

    try {
        const respostas = await db.tb_respostas.findMany({
            where: {
                idPer: Number(idPer)
            },
            include: {
                usuarios: {
                    select: {
                        nome: true,
                        arquivo: true
                    }
                }
            },
            orderBy: {
                idRes: 'asc'
            }
        });

        const respostasFormatadas = respostas.map(resposta => ({
            idRes: resposta.idRes,
            idUsu: resposta.idUsu,
            conteudoRes: resposta.conteudoRes,
            nomeUsuario: resposta.usuarios.nome,
            arquivoUsuario: resposta.usuarios.arquivo
        }));

        res.json(respostasFormatadas);
    } catch (error) {
        console.error('Erro ao buscar respostas:', error);
        res.status(500).json({ error: 'Erro ao buscar respostas' });
    }
});

router.get('/resposta/:idPer', async (req, res) => {
     const {idPer} = req.params;
    const esporte = req.query.esporte;

    res.render('resposta.ejs', { idPer, esporte });
})

// Rota para criar uma nova resposta
router.post('/respostas/:idPer', async (req, res) => {
    let { idPer } = req.params;
    const { esporte } = req.query; // Pegue o esporte da query
    idPer = Number(idPer);
    const { conteudoRes } = req.body;
    const idUsu = req.session.userId;

    try {
        await db.tb_respostas.create({
            data: {
                conteudoRes,
                perguntas: {
                    connect: { idPer },
                },
                usuarios: {
                    connect: { id: idUsu }
                },
            },
        });
        res.redirect(`/forum?esporte=${esporte}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao criar a resposta');
    }
});

// Rota para editar uma resposta
router.put('/respostas/:id', async (req, res) => {
    const { id } = req.params;
    const { conteudoRes } = req.body;

    try {
        const respostaAtualizada = await db.tb_respostas.update({
            where: { idRes: Number(id) },
            data: { conteudoRes },
        });
        res.json(respostaAtualizada);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao editar a resposta');
    }
});

// Rota para deletar uma resposta
router.delete('/respostas/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await db.tb_respostas.delete({
            where: { idRes: Number(id) },
        });
        res.json({ message: 'Resposta deletada com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao deletar a resposta');
    }
});

router.get('/teste-login', (req, res) => {
   if (req.session.userId) {
       return res.send(`Você está logado como ${req.session.userName}.`);
   }
   return res.send('Você não está logado.');
});

// Exporta o router
module.exports = router;