const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class UsuarioModel {
    async criarUsuario(nome, email, senha, arquivo) {
      try {
        const usuario = await prisma.tb_usuarios.create({
          data: {
            nome,
            email,
            senha,
            arquivo: arquivo ? arquivo.filename : null,
          },
        });
        return usuario;
      } catch (error) {
        throw error;
      }
    }
  }
  
  module.exports = UsuarioModel;