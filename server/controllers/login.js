
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Usuario = require("../models/usuario");

const loginForm = async( req, res )=> {
    
    let body = req.body;

    Usuario.findOne({ email: body.email }).then((user)=>{

         if(!user) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o Contraseña incorrectos.'
                }
              });
         }

         if(!bcrypt.compareSync( body.password, user.password) ) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (Contraseña) incorrectos.'
                }
              });
         }

         let token = jwt.sign({
            usuario: user
         }, process.env.SEED , { expiresIn: process.env.CADUCIDAD_TOKEN });

         res.json({
            ok: true,
            usuario: user,
            token
         });

    })
    .catch(err=> {
        
        return res.status(500).json({
            ok: false,
            err
          });
    })

};

module.exports = {

    loginForm
    
};