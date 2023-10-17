const jwt = require('jsonwebtoken');

// VERIFICAR TOKEN

let verificaToken = ( req, res, next )=>{

    // el req.get regresa informacion de la cabecera o HEADERS
       
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded)=> {

         if(err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido.'
                }
            });
         }

         req.usuario = decoded.usuario;
         next();

    });

};

// VERIFICA ADMIN ROLE

let verificaAdmin_Role = ( req, res, next)=> {
      
    let usuario = req.usuario;

    if (usuario.role == "ADMIN_ROLE"){
        
        next();

    } else {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador.'
            }
        });
    
    }
    

}

// Verifica token para imagen

let verificaTokenImg = ( req, res, next)=> {

    // el req.query regresa informacion de la URL
    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded)=> {

        if(err) {
           return res.status(401).json({
               ok: false,
               err: {
                   message: 'Token no valido.'
               }
           });
        }

        req.usuario = decoded.usuario;
        next();

   });

}


module.exports = { 
    verificaToken, verificaAdmin_Role, verificaTokenImg }