const express = require('express');
const app = express();
const { login, loginForm } = require('../controllers/login');

app.post('/login', login );

app.post('/loginForm', loginForm );

module.exports = app;