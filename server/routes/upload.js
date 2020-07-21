const express = require('express');
const fileUpload = require('express-fileupload');
const app= express();


const Usuario = require('../models/user');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');

app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req,res){
    let tipo =req.params.tipo;
    let id = req.params.id;

    if(!req.files){
        return res.status(400)
                    .json({
                        ok:false,
                        err:{
                            message: 'No se ha seleccionado ningun archivo'
                        }
                    })
    }

//validar tipo

    let tiposValidos = ['productos','usuarios'];
    if(tiposValidos.indexOf(tipo)<0){
        return res.status(400).json({
            ok:false,
            err:{
                message:'Los tipos permitidos son: ' + tiposValidos.join(', '),
            }
        })
    }


    let archivo = req.files.archivo;
    //Extenciones permitidas
    let extencionesValidas =['png', 'jpg', 'gif', 'jpeg'];
    let nombreCortado = archivo.name.split('.');
    let extencion = nombreCortado[nombreCortado.length-1];

    if(extencionesValidas.indexOf(extencion)<0){
        return res.status(400).json({
            ok:false,
            err:{
                message:'Las estenciones permitidas son: ' + extencionesValidas.join(', '),
                ext: extencion
            }
        })
    }


    //Cambiar nombre al archivo
    let nombreArchivo = `${ id }-${new Date().getMilliseconds()}.${extencion}`;


    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err)=>{
        if(err)
            return res.status(500).json({
                ok:false,
                err
            });

        if(tipo === 'usuarios'){
            imagenUsuario(id,res, nombreArchivo);
        }else{
            imagenProducto(id,res, nombreArchivo);
        }
        //Imagen argada
    })
});


function imagenUsuario(id,res, nombreArchivo){
    Usuario.findById(id, (err,usuarioDB)=>{
        if(err){
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500)
                        .json({
                            ok:false,
                            err
                        });
        }

        if(!usuarioDB){
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(400)
                        .json({
                            ok:false,
                            err:{
                                message: 'El usario no existe.'
                            }
                        });
        }


        borraArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err,usuarioGuardado)=>{
            res.json({
                ok:true,
                usuario: usuarioGuardado,
                img:nombreArchivo
            })
        })

    })
}


function imagenProducto(id,res, nombreArchivo){
    Producto.findById(id, (err,productoDB)=>{
        if(err){
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500)
                        .json({
                            ok:false,
                            err
                        });
        }

        if(!productoDB){
            borraArchivo(nombreArchivo, 'productos');
            return res.status(400)
                        .json({
                            ok:false,
                            err:{
                                message: 'El productos no existe.'
                            }
                        });
        }


        borraArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;

        productoDB.save((err,productoGuardado)=>{
            res.json({
                ok:true,
                producto: productoGuardado,
                img:nombreArchivo
            })
        })

    })
}

function borraArchivo(nombreImg, tipo){
        
    let pathImg = path.resolve( __dirname, `../../uploads/${tipo}/${ nombreImg }`);

    if(fs.existsSync(pathImg)){
        fs.unlinkSync(pathImg);
    }
}
module.exports = app;