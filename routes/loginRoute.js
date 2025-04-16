const express = require('express');
const router = express.Router();
const passport = require('passport');
const LoginController = require('../controllers/loginController');
const loginController = new LoginController();

// Rota de login
router.get('/login', loginController.getLogin.bind(loginController));
// router.post('/login', loginController.postLogin.bind(loginController));
router.post(
    '/login',
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true,
    })
  );

// Rota de logout
router.get('/logout', loginController.logout.bind(loginController));

module.exports = router;