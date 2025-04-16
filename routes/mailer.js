// mailer.js
const nodemailer = require('nodemailer');

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // ou outro serviço de e-mail
    auth: {
        user: 'seu-email@gmail.com', // seu e-mail
        pass: 'sua-senha' // sua senha ou app password
    }
});

const sendVerificationEmail = (to, code) => {
    const mailOptions = {
        from: 'seu-email@gmail.com',
        to,
        subject: 'Código de Verificação',
        text: `Seu código de verificação é: ${code}`
    };

    return transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };