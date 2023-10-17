const express = require('express');
let app = express();
const { verificaToken } = require('../middlewares/autentication');
const { crearNota, listaNotas, actualizarNota, borrarNota } = require('../controllers/notas');


// OBTENER LISTA DE NOTAS

app.get('/notas', verificaToken , listaNotas );

// AGREGAR NOTA

app.post('/notas', verificaToken , crearNota );

// ACTUALIZAR NOTA

app.put('/notas/:id', verificaToken , actualizarNota );

// BORRAR NOTA

app.delete('/notas/:id', verificaToken , borrarNota );

module.exports = app;