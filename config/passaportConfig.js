// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
// const { PrismaClient } = require('@prisma/client');

// const prisma = new PrismaClient();

// // Configuração da estratégia de autenticação local
// passport.use(new LocalStrategy(
//   async (username, password, done) => {
//     try {
//       // Buscar o usuário no banco de dados usando o Prisma
//       const user = await prisma.user.findUnique({ where: { username } });
//       if (!user || user.password !== password) {
//         return done(null, false, { message: 'Credenciais inválidas' });
//       }
//       return done(null, user);
//     } catch (err) {
//       return done(err);
//     }
//   }
// ));

// // Serializar e deserializar o usuário
// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await prisma.user.findUnique({ where: { id } });
//     done(null, user);
//   } catch (err) {
//     done(err);
//   }
// });

// module.exports = passport;