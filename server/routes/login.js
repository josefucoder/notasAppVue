const express = require('express');
const app = express();
const { loginForm } = require('../controllers/login');

app.post('/loginForm', loginForm );

module.exports = app;