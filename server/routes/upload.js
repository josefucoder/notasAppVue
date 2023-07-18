const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

app.use(fileUpload());

app.put('/upload/:tipo/:id', ( req, res )=>{

    const tipo = req.params.tipo;
    const id = req.params.id;

    if(!req.files) {
        return res.status(400)
        .json({
            ok:false,
            err: 'No se ha enviado la imagen.'
        });
    }

    // Validar Tipo

    let tiposValidos = [ 'productos', 'usuarios' ];

    if( tiposValidos.indexOf( tipo ) < 0){

        return res.status(500).json({
            ok: false,
            error: {
                message: 'Los tipos validos son: ' + tiposValidos.join(", ")
            },
            tipoEnviado: tipo
        });

    }

    // req.files.archivo ARCHIVO seria el nombre del atributo name del campo files en html

    let archivo = req.files.archivo;

    let nombreCortado = archivo.name.split('.');
    let extensionArchivo = nombreCortado[ nombreCortado.length - 1 ];

    // extensiones Validas

    extensionesValidas = [ 'png', 'jpeg', 'jpg' , 'gif' ];

    if( extensionesValidas.indexOf( extensionArchivo ) < 0){

        return res.status(500).json({
            ok: false,
            error: {
                message: 'Las extensiones permitidas son: ' + extensionesValidas.join(", ")
            },
            extensionEnviada: extensionArchivo
        });

    }

    // Cambiar Nombre a Archivo, debe ser distinto para que el servidor realice la carga

    let nombreArchivo = `${id}-${ new Date().getMilliseconds() }.${ extensionArchivo }`;

    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err)=>{
        
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        };

        // Aqui ya se cargo la imagen

        if ( tipo === "usuarios"){

            imagenUsuario( id, res, nombreArchivo )

        } else {
            
            imagenProducto( id, res, nombreArchivo )
        }

        

        // res.status(200).json({
        //     ok: true,
        //     message: 'Imagen subida correctamente'
        // });

    });

});

function imagenUsuario( id, res, nombreArchivo ) {

    Usuario.findById(id)
    .then(usuarioDB=>{

        if(!usuarioDB){
            borrarArchivo( nombreArchivo , 'usuarios' )

            res.status(500)
            .json({
                ok: false,
                err,
                message: 'Usuario no encontrado'
            });
        }

        borrarArchivo( usuarioDB.img , 'usuarios' )

        usuarioDB.img = nombreArchivo;

        usuarioDB.save()
        .then(user=> {

            res.status(200).json({
                ok: true ,
                usuarioGuardado: user,
                img: nombreArchivo
            })
        })
        .catch(err=> {

            borrarArchivo( nombreArchivo , 'usuarios' )

            res.status(500)
            .json({
                ok: false,
                err,
                message: 'Usuario con imagen no guardado'
            });
        });


    })
    .catch(err=> {

        borrarArchivo( nombreArchivo , 'usuarios' )

        return res.status(500).json({
            ok: false,
            err
        });

    })

}

function imagenProducto(  id, res, nombreArchivo  ) {

    Producto.findById(id)
    .then(productoDB=>{

        if(!productoDB){
            borrarArchivo( nombreArchivo , 'productos' )

            res.status(500)
            .json({
                ok: false,
                err,
                message: 'Producto no encontrado'
            });
        }

        borrarArchivo( productoDB.img , 'productos' )

        productoDB.img = nombreArchivo;

        productoDB.save()
        .then(producto=> {

            res.status(200).json({
                ok: true ,
                productoGuardado: producto,
                img: nombreArchivo
            })
        })
        .catch(err=> {

            borrarArchivo( nombreArchivo , 'productos' )

            res.status(500)
            .json({
                ok: false,
                err,
                message: 'Producto con imagen no guardado'
            });
        });


    })
    .catch(err=> {

        borrarArchivo( nombreArchivo , 'productos' )

        return res.status(500).json({
            ok: false,
            err
        });

    })

}

function borrarArchivo( nombreImagen, tipo ){

    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImagen }`);

        if( fs.existsSync( pathImagen ) ){
            fs.unlinkSync( pathImagen );
        }
}

module.exports = app;