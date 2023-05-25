
require("./config/config");

const express = require('express')
const mongoose = require('mongoose')

const app = express()

const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.json('get /')
});

app.use( require('./routes/usuario'));

// const database = async () => {
//   await mongoose.connect('mongodb://localhost:27017/cafe')
// }

// database()
// .then(() => console.log('Connected!'))
// .catch(err => console.log(err));

// conectar con DB Local
// mongoose.connect('mongodb://127.0.0.1:27017/cafe')

mongoose.connect(process.env.URLDB)
.then(() => console.log('BASE DE DATOS CONECTADA!'))
.catch(err => console.log(err));

app.listen(process.env.PORT, ()=>{
    console.log("Escuchando en el puerto: ", process.env.PORT)
})
