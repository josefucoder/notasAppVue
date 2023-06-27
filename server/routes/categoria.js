const express = require("express");

let { verificaToken, verificaAdmin_Role } = require("../middlewares/autentication");
const categoria = require("../models/categoria");

let app = express();

let Categoria = require("../models/categoria");

app.get( "/categoria", (req , res)=>{

    Categoria.find({})
    .sort('descripcion')
    .populate('usuario', 'nombre email')
    .then(categorias => {
        res.json({
            ok: true,
            categorias
        })
    })
    .catch(err=> {
        return res.status(400).json({
            ok: false,
            err
                });
    })

});

app.get( "/categoria/:id", (req , res)=>{

    let id = req.params.id;

    Categoria.findById( id )
    .then(categorias => {
        res.json({
            ok: true,
            categorias
        })
    })
    .catch(err=> {
        return res.status(400).json({
            ok: false,
            error: {
                message: 'El id no es correcto.'
            }
                });
    })

});

app.post( "/categoria", verificaToken , (req , res)=>{

    // CREAR UNA NUEVA CATEGORIA

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save().then((categoria) => {
        
        res.json({
            ok: true,
            categoria
        });

    }).catch((err) => {

      return res.status(500).json({
                    ok: false,
                    err
                  });

    });

});

app.put("/categoria/:id", verificaToken, (req, res)=> {

    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(id , descCategoria , { new: true, runValidators: true })
    .then(categoria => {
     
           res.json({
           ok: true,
           categoria
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

app.delete("/categoria/:id", [verificaToken, verificaAdmin_Role ] , (req, res)=>{

    let id = req.params.id;

    Categoria.findByIdAndRemove(id)
        .then(catgDelete => {

          if (!catgDelete) {
             
            return res.status(400).json({
              ok: false,
              error: { 
                message: "Esta Categoria ya fue borrada" }
            })
          }
    
          res.json({
          ok: true,
          categoria: catgDelete,
          messages: "Categoria Borrada"
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
})

module.exports = app;