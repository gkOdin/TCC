const express = require('express');
const routes = require('./routes/routes');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt'); // Para verificar a senha

const passport = require('passport'); // Importa o passport
const LocalStrategy = require('passport-local').Strategy; // Importa a estratégia local

const prisma = require('@prisma/client').PrismaClient; // Para acessar o banco de dados

const app = express();
const db = new prisma();





// Configuração do EJS como view engine
app.set('view engine', 'ejs');
// diretório onde  as views estão localizadas (opcional)
app.set('views', path.join(__dirname, 'views'));


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true })); // Para dados de formulários
app.use(express.json()); // Para dados JSON

// Configuração do middleware de sessão
app.use(session({
    secret: 'seu-segredo-aqui', // Troque por um segredo forte
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Defina como true se estiver usando HTTPS
}));





// Inicializa o Passport
app.use(passport.initialize());
app.use(passport.session());

// Configura a estratégia de autenticação local
passport.use(new LocalStrategy(
    async (email, senha, done) => {
        try {
            const usuario = await db.tb_usuarios.findUnique({ where: { email } });
            if (!usuario) return done(null, false, { message: 'Usuário não encontrado.' });

            const match = await bcrypt.compare(senha, usuario.senha);
            if (!match) return done(null, false, { message: 'Senha incorreta.' });

            return done(null, usuario);
        } catch (error) {
            return done(error);
        }
    }
));

// Serializa o usuário na sessão
passport.serializeUser((usuario, done) => {
    done(null, usuario.id);
});

// Deserializa o usuário da sessão
passport.deserializeUser(async (id, done) => {
    const usuario = await db.tb_usuarios.findUnique({ where: { id } });
    done(null, usuario);
});





app.use((req, res, next) => {
  res.locals.usuarioLogado = !!req.session.userId; // Verifica se o usuário está logado
  res.locals.usuarioFoto = req.session.userFoto || ''; // Pega a foto do usuário, se existir
  res.locals.userName = req.session.userName || ''; // Pega o nome do usuário, se existir
  next(); // Chama o próximo middleware ou rota
});

app.use(routes);

app.listen(3000,()=>{
    console.log("Servidor Escutando na porta 3000");
})