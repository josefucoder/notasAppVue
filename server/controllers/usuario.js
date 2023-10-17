const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require("../models/usuario");


// Lista usuarios

const listaUsuarios = async(req, res)=> {

  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 0;
  limite = Number(limite)

  Usuario.find({ estado: true }, 'nombre email role estado img')
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

  };

  const obtenerUsuarioPorID = async(req, res)=>{

    let id = req.params.id;

    Usuario.findById( id )
    .then(usuario => {
        res.json({
            ok: true,
            usuario
        })
    })
    .catch(err=> {
        return res.status(400).json({
            ok: false,
            err
                });
    })
    
};

// registrar Usuarios
  
const registrarUsuarios = async(req, res)=> {
  
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
    
  };

// EL DE ARRIBA ES PARA EL REGISTRO NORMAL
// EL DE ABAJO ES PARA EL REGISTRO DESDE FORMULARIO

const registrarUsuariosForm = async(req, res)=> {
  
  let body = req.body

  let usuario = new Usuario({
      nombre: body.nombre,
      email: body.email,
      password: bcrypt.hashSync(body.password, 8) ,
      role: body.role
  })

  usuario.save().then((user) => {

    // user.password = null;

    res.status(200).json({
              ok: true,
              usuario: user
          });
        
      

  }).catch((err) => {

    return res.status(400).json({
                  ok: false,
                  err
                });

  });
  
};
  
  /* Asi se obtiene un parametro por ejemplo un id con NodeJS*/

//   Actualizar datos de usuario
  
const actualizarDatosUsuario = async(req, res)=> {
  
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

  };

//   borrar Usuario

const borrarUsuario = async(req, res)=> {
    

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


}; 

  module.exports = {

    listaUsuarios,
    obtenerUsuarioPorID,
    registrarUsuarios,
    registrarUsuariosForm,
    actualizarDatosUsuario,
    borrarUsuario
    
  };