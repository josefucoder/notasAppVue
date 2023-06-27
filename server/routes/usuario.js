const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require("../models/usuario");
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autentication');

const app = express()


app.get('/usuario', verificaToken , (req, res)=> {

  // return res.json({
  //   usuario: req.usuario,
  //   nombre: req.usuario.nombre,
  //   email: req.usuario.email
  // })   
  
  // ASI USAMOS LOS DATOS DEL VERIFICA TOKEN Y EXTRAEMOS PROPIEDADES DE FORMA INDEPENDIENTE
  //  USANDO req.usuario.propiedad

  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 0;
  limite = Number(limite)

  Usuario.find({ estado: true }, 'nombre email role estado google img')
  .skip(desde)
  .limit(limite)
  .then(users=> {

        Usuario.count({ estado: true }).then(conteo=>{
          res.json({
            ok: true,
            users,
            conteo
          }); 
        })
        .catch(err=>{
          return res.status(400).json({
            ok: false,
            err
          });
        })

  })
  .catch(err=> {

    return res.status(400).json({
      ok: false,
      err
    });
      
  })

  });
  
app.post('/usuario', [verificaToken, verificaAdmin_Role] , (req, res)=> {
  
    let body = req.body

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10) ,
        role: body.role
    })

    usuario.save().then((user) => {

      // user.password = null;

      res.json({
                ok: true,
                usuario: user
            });
          
        

    }).catch((err) => {

      return res.status(400).json({
                    ok: false,
                    err
                  });

    });
    
  });

// EL DE ARRIBA ES PARA EL REGISTRO NORMAL
// EL DE ABAJO ES PARA EL REGISTRO DESDE FORMULARIO

app.post('/usuarioform', (req, res)=> {
  
  let body = req.body

  let usuario = new Usuario({
      nombre: body.nombre,
      email: body.email,
      password: bcrypt.hashSync(body.password, 10) ,
      role: body.role
  })

  usuario.save().then((user) => {

    // user.password = null;

    res.json({
              ok: true,
              usuario: user
          });
        
      

  }).catch((err) => {

    return res.status(400).json({
                  ok: false,
                  err
                });

  });
  
});
  
  /* Asi se obtiene un parametro por ejemplo un id con NodeJS*/
  
  app.put('/usuario/:id', [verificaToken, verificaAdmin_Role] , (req, res)=> {
  
    let id = req.params.id;
    let body = _.pick( req.body, [ 'nombre', 'email', 'img', 'role', 'estado' ]);

  Usuario.findByIdAndUpdate(id , body , { new: true, runValidators: true })
   .then(user => {
    
          res.json({
          ok: true,
          usuario: user
        })
  })
   .catch(err => {
      
    if (err) {
        return res.status(400).json({
          ok: false,
          err
              });
             }
  });

  });

  app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role] , (req, res)=> {
    

    let id = req.params.id;
    
    let cambiaEstado = {
      estado: false
    }

    Usuario.findByIdAndUpdate(id, cambiaEstado , { new: true})
    .then(userDelete => {

      res.json({
      ok: true,
      usuario: userDelete
    })
})
    .catch(err => {
  
    return res.status(400).json({
      ok: false,
      err
          });
  
});


}); 

// ASI SERIA PARA BORRAR EL REGISTRO

  // app.delete('/usuario/:id', function (req, res) {
    

  //       let id = req.params.id;

  //       Usuario.findByIdAndRemove(id)
  //       .then(userDelete => {

  //         if (!userDelete) {
             
  //           return res.status(400).json({
  //             ok: false,
  //             error: { 
  //               message: "Usuario ya borrado" }
  //           })
  //         }
    
  //         res.json({
  //         ok: true,
  //         usuario: userDelete
  //       })
  // })
  //       .catch(err => {
      
  //   if (err) {
  //       return res.status(400).json({
  //         ok: false,
  //         err
  //             });
  //            }
  // });


  // });

  module.exports = app;