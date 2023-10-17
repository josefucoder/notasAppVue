const express = require('express');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autentication');
const { listaUsuarios, obtenerUsuarioPorID ,registrarUsuarios, registrarUsuariosForm, actualizarDatosUsuario, borrarUsuario } = require('../controllers/usuario');

const app = express();

app.get('/usuario', verificaToken , listaUsuarios);

app.get('/usuario/:id', verificaToken, obtenerUsuarioPorID)
  
app.post('/usuario', [verificaToken, verificaAdmin_Role] , registrarUsuarios);

app.post('/usuarioForm', registrarUsuariosForm);
  
app.put('/usuario/:id', [verificaToken, verificaAdmin_Role] , actualizarDatosUsuario);

app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role] , borrarUsuario); 

module.exports = app;