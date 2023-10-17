
require("./config/config");

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express()

app.use( express.urlencoded({ extended: true }) );
app.use( express.json() );

// HABILITAR LA CARPETA PUBLIC PARA SER ACCEDIDA DESDE CUALQUIER LUGAR

app.use( express.static( path.resolve(  __dirname, '../public')  ) );

// CONFIGURACION GLOBAL DE RUTAS

app.use( require('./routes/index'));

mongoose.connect(process.env.URLDB)
.then(() => console.log('BASE DE DATOS CONECTADA!'))
.catch(err => console.log(err));

app.listen(process.env.PORT, ()=>{
    console.log("Escuchando en el puerto: ", process.env.PORT)
})
