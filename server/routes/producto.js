const express = require('express');
const { verificaToken } = require('../middlewares/autentication')

let app = express();
let Producto = require('../models/producto');


app.get('/productos', verificaToken , (req, res)=>{

    let desde = req.query.desde || 0;
    desde = Number(desde);
  
    // let limite = req.query.limite || 0;
    // limite = Number(limite)

    Producto.find({ disponible: true })
    .skip(desde)
    .limit(5)
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')
    .then(producto => {
        res.json({
            ok: true,
            producto
        })
    })
    .catch(err=> {
        return res.status(400).json({
            ok: false,
            err
                });
    })

});

app.get('/productos/:id', verificaToken , (req, res)=>{

    let id = req.params.id;

    Producto.findById( id )
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')
    .then(producto => {
        res.json({
            ok: true,
            producto
        })
    })
    .catch(err=> {
        return res.status(400).json({
            ok: false,
            err
                });
    })
    
});

app.get('/productos/buscar/:termino', verificaToken ,(req, res)=>{


    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
    .populate('categoria', 'descripcion')
    .then(busqueda=> {

        res.status(201).json({
            ok: true,
            busqueda

        });
  })
  .catch(err=> {

    res.status(400).json({
      ok: false,
      err
    });
      
  })
});

app.post('/productos', verificaToken ,(req, res)=>{

    let body = req.body;

    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });

    producto.save()
    .then(producto =>{
        res.status(201).json({
            ok: true,
            producto

        });
    })
    .catch(err => {
        return res.status(500).json({
            ok: false,
            err
          });
    })

    
});

app.put('/productos/:id', verificaToken , (req, res)=>{


    let id = req.params.id;
    let body = req.body

    Producto.findById(id)
    .then(producto => {
     


        producto.nombre = body.nombre;
        producto.precioUni = body.precioUni;
        producto.categoria = body.categoria;
        producto.disponible = body.disponible;
        producto.descripcion = body.descripcion;

         producto.save()
         .then(productoDB =>{
             res.status(201).json({
                 ok: true,
                 producto: productoDB
     
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
    

});

app.delete('/productos/:id', verificaToken ,(req, res)=>{

    let id = req.params.id;
    
    let cambiaEstado = {
      disponible: false
    }

    Producto.findByIdAndUpdate(id, cambiaEstado , { new: true})
    .then(producto => {

      res.json({
      ok: true,
      producto,
      mensaje: "Producto Borrado"
    })
})
    .catch(err => {
  
    return res.status(400).json({
      ok: false,
      err
          });
  
});

    
});

module.exports = app;