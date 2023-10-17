
const Notas = require('../models/notas');


// OBTENER LISTA DE NOTAS

const listaNotas = async(req, res)=>{

    let idUsuario = req.usuario._id;

    Notas.find({ usuario: idUsuario })
    .sort( { fecha: -1 } )
    .then(nota => {
        res.json({
            ok: true,
            nota
        })
    })
    .catch(err=> {
        return res.status(400).json({
            ok: false,
            err
                });
    })

};

// AGREGAR NOTA

const crearNota = async(req, res)=>{

    let body = req.body;

    let nota = new Notas({
        usuario: req.usuario._id,
        titulo: body.titulo,
        contenido: body.contenido
    });

    nota.save()
    .then(nota =>{
        res.status(201).json({
            ok: true,
            nota

        });
    })
    .catch(err => {
        return res.status(500).json({
            ok: false,
            err
          });
    })

    
};

// ACTUALIZAR NOTA

const actualizarNota = async(req, res)=>{


    let id = req.params.id;
    let body = req.body

    Notas.findById(id)
    .then(nota => {
     


        nota.titulo = body.titulo;
        nota.contenido = body.contenido;
        nota.fecha = body.fecha;

         nota.save()
         .then(notaDB =>{
             res.status(200).json({
                 ok: true,
                 nota: notaDB
     
             });
         })
         .catch(err => {
             return res.status(500).json({
                 ok: false,
                 err
               });
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

// BORRAR NOTA

const borrarNota = async(req, res)=>{

        let id = req.params.id;

        Notas.findByIdAndRemove(id)
        .then(notaDelete => {

          if (!notaDelete) {
             
            return res.status(400).json({
              ok: false,
              error: { 
                message: "Nota ya borrada" }
            })
          }
    
          res.json({
          ok: true,
          nota: notaDelete
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

module.exports = {

    crearNota,
    listaNotas,
    actualizarNota,
    borrarNota    
    
};