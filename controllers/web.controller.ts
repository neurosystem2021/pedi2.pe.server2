import { Request, Response } from 'express';
import Database from "../classes/database";
const database = Database.instance;

export async function obtenerTodosPedidos(req: Request, res: Response): Promise<Response> {

    try {
        let conn = await database.conexionObtener();
        let resultadoPedido = await conn.query("SELECT Gen_Pedido.*,CONCAT(Gen_Cliente.Nombres,' ',Gen_Cliente.Apellidos) AS Cliente," +
        " IF(ISNULL(Gen_Pedido.IdMotorizado), NULL, CONCAT(Gen_Motorizado.Nombres,' ',Gen_Motorizado.Apellidos)) AS Motorizado, Gen_Empresa.RazonSocial,Gen_Empresa.Direccion AS EmpresaDireccion,"+
        " Gen_Empresa.Latitud AS EmpresaLatitud, Gen_Empresa.Longitud AS EmpresaLongitud, Gen_Pedido.IdMotorizado,Gen_Pedido.IdCliente, Gen_Cliente.Telefono AS TelefonoCliente, Gen_Pedido.Referencia "+
        " FROM Gen_Pedido INNER JOIN Gen_Cliente ON Gen_Pedido.IdCliente = Gen_Cliente.IdCliente "+
        " LEFT JOIN Gen_Motorizado ON Gen_Pedido.IdMotorizado = Gen_Motorizado.IdMotorizado "+
        " INNER JOIN Gen_Empresa ON Gen_Pedido.IdEmpresa = Gen_Empresa.IdEmpresa "+
        " WHERE (Gen_Pedido.Estado <> 'F' AND Gen_Pedido.Estado <> 'C')");
        let resultadofinalPedido = JSON.parse(JSON.stringify(resultadoPedido[0]));

        if (resultadofinalPedido.length > 0) {
               
            return res.json({ success: true, data:resultadofinalPedido });

        } else {

            return res.json({ success: false, msg:'No existe ningun pedido' });

        }

    } catch (error) {
        return res.sendStatus(400);
    }
}


//Plataforma

export async function PedidoAsignacion(req: Request, res: Response): Promise<Response> {
    
    if (req.body.IdPedido != undefined ) {
            let IdPedido = req.body.IdPedido;
            try {
                let conn = await database.conexionObtener();
                let resultado = await conn.query("SELECT Estado FROM Gen_Pedido WHERE IdPedido="+IdPedido);
                let resultadofinal = JSON.parse(JSON.stringify(resultado[0]));
                
                if (resultadofinal.length > 0) {
                    if(resultadofinal[0].Estado=='E'){
                        await conn.query("UPDATE Gen_Pedido SET Estado ='PE' WHERE IdPedido = "+IdPedido);
                        return res.json({ success: true, msg: "El pedido en proceso de asignacion" });
                    }else{
                        return res.json({ success: false, msg: "El pedido ya esta en proceso" });
                    }
                } else {
                    return res.sendStatus(400);
                }

            } catch (error) {
                return res.sendStatus(400);
            }

    } else {
        return res.sendStatus(400);
    }

}


export async function PedidoDetallePlataforma(req: Request, res: Response): Promise<Response> {

    if (req.query.IdPedido != undefined ) {

        let IdPedido = req.query.IdPedido;
        try {
            let conn = await database.conexionObtener();
            let resultadoPedido = await conn.query("SELECT Gen_Pedido.* FROM Gen_Pedido WHERE (Gen_Pedido.Estado <> 'F' AND Gen_Pedido.Estado <> 'C') "+
            " AND Gen_Pedido.IdPedido="+IdPedido);
            let resultadofinalPedido = JSON.parse(JSON.stringify(resultadoPedido[0]));

            if (resultadofinalPedido.length > 0) {
                let pedido = resultadofinalPedido[0];
                //Cliente
                let resultadoCliente = await conn.query("SELECT IdCliente, Nombres, Apellidos,Dni,Telefono, Email, Direccion, Direccion2, Direccion3,"+
                " Latitud, Longitud,Puntos FROM Gen_Cliente WHERE IdCliente="+pedido.IdCliente);
                let resultadofinalCliente = JSON.parse(JSON.stringify(resultadoCliente[0]));

                let resultadoEmpresa = await conn.query("SELECT Gen_Empresa.IdEmpresa,Gen_EmpresaCategoria.EmpresaCategoria, Gen_Empresa.RazonSocial, Gen_Empresa.Ruc, Gen_Empresa.Direccion, Gen_Empresa.ImagenUrl, Gen_Empresa.Latitud, Gen_Empresa.Longitud "+
                " FROM Gen_Empresa INNER JOIN Gen_EmpresaCategoria ON Gen_Empresa.IdEmpresaCategoria = Gen_EmpresaCategoria.IdEmpresaCategoria"+
                " WHERE Gen_Empresa.IdEmpresa="+pedido.IdEmpresa);
                let resultadofinalEmpresa = JSON.parse(JSON.stringify(resultadoEmpresa[0]));
                
                let resultadoMotorizado = await conn.query("SELECT Gen_Motorizado.IdMotorizado, Gen_Motorizado.Nombres, Gen_Motorizado.Apellidos, Gen_Motorizado.Dni, Gen_Motorizado.Telefono,Gen_Motorizado.Password,Gen_Motorizado.Email,Gen_Motorizado.Direccion,"+
                " Gen_Motorizado.VehiculoPlaca,Gen_Motorizado.VehiculoColor FROM Gen_Motorizado WHERE Gen_Motorizado.IdMotorizado="+pedido.IdMotorizado);
                let resultadofinalMotorizado = JSON.parse(JSON.stringify(resultadoMotorizado[0]));

                let resultadoProducto = await conn.query("SELECT IdPedidoDet, IdPedido, IdProducto, Producto, Descripcion, Cantidad,"+
                " ProductoImagenUrl, Precio, Indicacion FROM Gen_PedidoDet WHERE IdPedido="+pedido.IdPedido);
                let resultadofinalProducto = JSON.parse(JSON.stringify(resultadoProducto[0]));

                pedido.Cliente=resultadofinalCliente[0];
                pedido.Empresa=resultadofinalEmpresa[0];
                pedido.Motorizado=resultadofinalMotorizado[0] || {};
                pedido.DetallePedido=resultadofinalProducto;
                return res.json({ success: true, data:pedido  });

            } else {

                return res.json({ success: false, msg:'No existe',data:{} });

            }

        } catch (error) {
            return res.sendStatus(400);
        }

    } else {
        return res.json({ success: false, msg:'No se porcionaron parametros correctos' });
    }

}

export async function Motorizados(req: Request, res: Response): Promise<Response> {

    if (req.query.IdEmpresa != undefined) {

        let IdEmpresa = req.query.IdEmpresa;
        try {
            let conn = await database.conexionObtener();
            let resutaldoMotorizado = await conn.query("SELECT Empresa_Has_Motorizado.IdMotorizado,CONCAT(Gen_Motorizado.Nombres,' ',Gen_Motorizado.Apellidos) AS Motorizado,Gen_Motorizado.Telefono, IFNULL(Viajes.Contador,0) AS ContadorViajes FROM Empresa_Has_Motorizado "+
            "INNER JOIN Gen_Motorizado ON Empresa_Has_Motorizado.IdMotorizado = Gen_Motorizado.IdMotorizado "+
            "LEFT JOIN (SELECT IdMotorizado,COUNT(*) AS Contador FROM Gen_Pedido WHERE (Gen_Pedido.Estado <> 'F' AND Gen_Pedido.Estado <> 'C') "+
            "GROUP BY IdMotorizado) AS Viajes ON Empresa_Has_Motorizado.IdMotorizado = Viajes.IdMotorizado WHERE Empresa_Has_Motorizado.IdEmpresa="+IdEmpresa);
            let resutaldoMotorizadoFinal = JSON.parse(JSON.stringify(resutaldoMotorizado[0]));

            if (resutaldoMotorizadoFinal.length > 0) {
                return res.json({ success: true, motorizados:resutaldoMotorizadoFinal });
            } else {

                return res.json({ success: false, msg:"No hay motorizados en su empresa" });

            }

        } catch (error) {
            return res.sendStatus(400);
        }

    } else {
        return res.sendStatus(400);
    } 
}


export async function PedidoPreparar(req: Request, res: Response): Promise<Response> {

    if (req.body.IdPedido != undefined) {

        let IdPedido = req.body.IdPedido;
        try {
            let conn = await database.conexionObtener();
            let resultadoPedido = await conn.query("SELECT EnviarPreparar,IdMotorizado FROM Gen_Pedido WHERE IdPedido="+IdPedido+" AND EnviarPreparar=0");
            let resultadofinalPedido = JSON.parse(JSON.stringify(resultadoPedido[0]));

            if (resultadofinalPedido.length > 0) {

                if(resultadofinalPedido[0].IdMotorizado==null){
                    return res.json({ success: 2, msg:'Debe asignar un motorizado primero'});
                }else{
                    let resultado1 = await conn.query("UPDATE Gen_Pedido SET  EnviarPreparar = 1 WHERE IdPedido ="+IdPedido);    
                    return res.json({ success: 1, msg:'Pedido enviado a ordenes!!',data:resultadofinalPedido[0] });
                }

            } else {

                return res.json({ success: 3, msg:"El pedido ya esta registrado" });

            }

        } catch (error) {
            return res.json({ error });
        }

    } else {
        return res.json({ success: false, msg:'No se porcionaron parametros correctos' });
    }
}

//var upload = multer({ dest: __dirname + '/../public/upload/' });
/*
export async function obtenerTodosPedidos(req: Request, res: Response): Promise<Response> {
    //console.log(req.header('APP-Signature'));
    if (req.header('APP-Signature') != undefined) {
        if (req.header('APP-Signature') == 'renzo') {

            try {
                const conn = await database.conexionObtener();
                const pedidos = await conn.query("SELECT p.idpedidos as idpedido,p.estado,p.cliente,CONCAT(c.apellidos,' ',c.nombres) AS cliente_nombre," +
                    "p.motorizado,CONCAT(m.apellidos,' ',m.nombres) AS motorizado_nombre,p.precio_productos,p.precio_delivery,p.ubi_lat,p.ubi_lon,p.fecha,(p.precio_productos+p.precio_delivery) AS total " +
                    " FROM pedidos p INNER JOIN cliente c ON p.cliente=c.celular LEFT JOIN motorizados m ON p.motorizado=m.dni WHERE (p.estado <> 'F' AND p.estado <> 'C')");
                let pedidosfinal = JSON.parse(JSON.stringify(pedidos[0]));
                if (pedidosfinal.length > 0) {
                    return res.json(pedidosfinal);
                } else {
                    return res.json({ success: false });
                }
            } catch (error) {
                return res.sendStatus(400);
            }
        } else {
            return res.sendStatus(400);
        }
    } else {
        return res.sendStatus(400);
    }

}

export async function cambiarEstadoPedidoWeb(req: Request, res: Response): Promise<Response> {

    if (req.header('APP-Signature') != undefined && req.body.code != undefined
        && req.body.idpedido != undefined && req.body.estadopedido != undefined) {
        if (req.header('APP-Signature') == 'renzo') {


            let idpedidobody = req.body.idpedido;
            let estadopedidobody = req.body.estadopedido;

            try {
                let conn = await database.conexionObtener();
                let resultado = await conn.query("SELECT idpedidos as idpedido FROM pedidos  WHERE idpedidos='" + idpedidobody + "'");
                let resultadofinal = JSON.parse(JSON.stringify(resultado[0]));

                if (resultadofinal.length > 0) {
                    let idpedido = resultadofinal[0].idpedido;
                    let resultado1 = await conn.query("UPDATE pedidos SET estado ='" + estadopedidobody + "' WHERE idpedidos = '" + idpedido + "'");
                    return res.json({ success: true });

                } else {

                    return res.json({ success: false });

                }

            } catch (error) {
                return res.sendStatus(400);
            }

        } else {
            return res.sendStatus(400);
        }
    } else {
        return res.sendStatus(400);
    }
}

export async function traerTodasEmpresasWeb(req: Request, res: Response): Promise<Response> {

    if (req.header('APP-Signature') != undefined && req.body.code != undefined) {
        if (req.header('APP-Signature') == 'renzo') {
            let serve = req.headers.host;
            let protocolo = req.protocol + "://";
            let servidor = protocolo + serve;

            try {
                const conn = await database.conexionObtener();
                const empresas = await conn.query("SELECT ruc,razon_social,descripcion,categoria,direccion,ubi_lat,ubi_lon,TIME_FORMAT(horario_inicio, '%H:%i') as horario_inicio,TIME_FORMAT(horario_fin, '%H:%i') as horario_fin,CONCAT('" + servidor + "',url_imagen) as url_imagen,ranking,estado FROM empresa");
                const empresasfinal = JSON.parse(JSON.stringify(empresas[0]));

                if (empresasfinal.length > 0) {
                    return res.json(empresasfinal);
                } else {
                    return res.json({ success: false });
                }
            } catch (error) {
                return res.sendStatus(400);
            }
        } else {
            return res.sendStatus(400);
        }
    } else {
        return res.sendStatus(400);
    }

}

export async function traerTodasEmpresasWebCat(req: Request, res: Response): Promise<Response> {

    if (req.header('APP-Signature') != undefined && req.body.code != undefined && req.body.categoria != undefined) {
        if (req.header('APP-Signature') == 'renzo') {
            let categoriabody = req.body.categoria;
            let serve = req.headers.host;
            let protocolo = req.protocol + "://";
            let servidor = protocolo + serve;

            try {
                const conn = await database.conexionObtener();
                const empresas = await conn.query("SELECT ruc,razon_social,descripcion,categoria,direccion,ubi_lat,ubi_lon,TIME_FORMAT(horario_inicio, '%H:%i') as horario_inicio,TIME_FORMAT(horario_fin, '%H:%i') as horario_fin,CONCAT('" + servidor + "',url_imagen) as url_imagen,ranking,estado FROM empresa where categoria='" + categoriabody + "'");
                const empresasfinal = JSON.parse(JSON.stringify(empresas[0]));
                if (empresasfinal.length > 0) {
                    return res.json(empresasfinal);
                } else {
                    return res.json({ success: false });
                }
            } catch (error) {
                return res.sendStatus(400);
            }
        } else {
            return res.sendStatus(400);
        }
    } else {
        return res.sendStatus(400);
    }

}








export async function cambiarEstadoEmpresa(req: Request, res: Response): Promise<Response> {
    if (req.header('APP-Signature') != undefined && req.body.code != undefined
        && req.body.ruc != undefined && req.body.estado != undefined) {
        if (req.header('APP-Signature') == 'renzo') {
            let rucbody = req.body.ruc;
            let estadobody = req.body.estado;
            try {
                const conn = await database.conexionObtener();
                let resultado1 = await conn.query("UPDATE empresa SET estado = '" + estadobody + "' WHERE ruc= '" + rucbody + "'");
                return res.json({ success: true });


            } catch (error) {
                return res.sendStatus(400);
            }
        } else {
            return res.sendStatus(400);
        }
    } else {
        return res.sendStatus(400);
    }

}
*/

/*
export async function nuevaEmpresa(req: Request, res: Response): Promise<Response> {

    if (req.header('APP-Signature') != undefined && req.body.code != undefined && req.body.empresa != undefined && req.body.imagen) {
        if (req.header('APP-Signature') == 'renzo') {
            //upload.single(req.body);
            // console.log(req.body.empresa.descripcion);

            
            //ruc?:string;
          // razon_social?:string;
           // descripcion?:string;
          //  categoria?:string;
           // direccion?:string;
           // ubi_lat?:string;
           // ubi_lon?:string;
           // horario_inicio?:string;
           // horario_fin?:string;
            //url_imagen?:any;
           // ranking?:number;
            //estado?:string;

            //nombre:string;
            //tipo:string;
           // base64:string;

            let empresa = req.body.empresa;
            let imagen = req.body.imagen;

            let base64String = imagen.base64; // Not a real image
            // Remove header
            let base64Image = base64String.split(';base64,').pop();

            let archivoNombre = imagen.nombre + "." + imagen.tipo;


            try {
                let conn = await database.conexionObtener();
                let resultado = await conn.query("SELECT ruc  FROM empresa  WHERE ruc='" + req.body.empresa.ruc + "'");
                let resultadofinal = JSON.parse(JSON.stringify(resultado[0]));

                if (resultadofinal.length > 0) {
                    return res.json({ success: false });

                } else {
                    fs.writeFile(join(__dirname, '/../public/img/empresas/') + archivoNombre, base64Image, { encoding: 'base64' }, function (err) {
                        console.log('File created');
                    });
                    let url_imagen = "/img/empresas/" + archivoNombre;
                    let insertar = await conn.query("INSERT INTO empresa(ruc,razon_social,descripcion,categoria,direccion,ubi_lat,ubi_lon,horario_inicio,horario_fin,url_imagen,ranking,estado) " +
                        " VALUES ('" + empresa.ruc + "','" + empresa.razon_social + "','" + empresa.descripcion + "','" + empresa.categoria + "','" + empresa.direccion + "','" + empresa.ubi_lat + "','" + empresa.ubi_lon + "','" + empresa.horario_inicio + "','" + empresa.horario_fin + "','" + url_imagen + "','" + empresa.ranking + "','I')");
                    return res.json({ success: true });
                }

            } catch (error) {
                return res.sendStatus(400);
            }

        } else {
            return res.sendStatus(400);
        }
    } else {
        return res.sendStatus(400);
    }

}


export async function modificarEmpresa(req: Request, res: Response): Promise<Response> {

    if (req.header('APP-Signature') != undefined   && req.body.code != undefined && req.body.empresa != undefined && req.body.imagen) {
        if (req.header('APP-Signature') == 'renzo') {

            let empresa = req.body.empresa;
            let imagen = req.body.imagen;

            let base64String = imagen.base64; // Not a real image
            // Remove header
            let base64Image = base64String.split(';base64,').pop();

            let archivoNombre = imagen.nombre + "." + imagen.tipo;
            try {
                let conn = await database.conexionObtener();
                if (imagen.tipo === 'png') {
                    fs.writeFile(join(__dirname, '/../public/img/empresas/') + archivoNombre, base64Image, { encoding: 'base64' }, function (err) {
                        console.log('File created');
                    });
                    let url_imagen = "/img/empresas/" + archivoNombre;
                    let insertar = await conn.query("UPDATE empresa SET razon_social = '" + empresa.razon_social + "',descripcion = '" + empresa.descripcion + "',categoria = '" + empresa.categoria + "',direccion = '" + empresa.direccion + "',ubi_lat = '" + empresa.ubi_lat + "'," +
                        "ubi_lon = '" + empresa.ubi_lon + "',horario_inicio = '" + empresa.horario_inicio + "',horario_fin = '" + empresa.horario_fin + "',url_imagen = '" + url_imagen + "',ranking = '" + empresa.ranking + "' WHERE ruc = '" + empresa.ruc + "';");
                    return res.json({ success: true });
                } else {
                    let insertar = await conn.query("UPDATE empresa SET razon_social = '" + empresa.razon_social + "',descripcion = '" + empresa.descripcion + "',categoria = '" + empresa.categoria + "',direccion = '" + empresa.direccion + "',ubi_lat = '" + empresa.ubi_lat + "'," +
                        "ubi_lon = '" + empresa.ubi_lon + "',horario_inicio = '" + empresa.horario_inicio + "',horario_fin = '" + empresa.horario_fin + "',ranking = '" + empresa.ranking + "' WHERE ruc = '" + empresa.ruc + "';");
                    return res.json({ success: true });
                }


            } catch (error) {
                return res.sendStatus(400);
            }

        } else {
            return res.sendStatus(400);
        }
    } else {
        return res.sendStatus(400);
    }

}

export async function traerEmpresasWebSearch(req: Request, res: Response): Promise<Response> {
    console.log(req.header('APP-Signature'));
    if (req.header('APP-Signature') != undefined && req.body.code != undefined && req.body.busqueda != undefined) {
        if (req.header('APP-Signature') == 'renzo') {
            let busquedabody = req.body.busqueda;
            let serve = req.headers.host;
            let protocolo = req.protocol + "://";
            let servidor = protocolo + serve;

            try {
                const conn = await database.conexionObtener();
                const empresas = await conn.query("SELECT ruc,razon_social,descripcion,categoria,direccion,ubi_lat,ubi_lon,TIME_FORMAT(horario_inicio, '%H:%i') as horario_inicio,TIME_FORMAT(horario_fin, '%H:%i') as horario_fin,CONCAT('" + servidor + "',url_imagen) as url_imagen,ranking,estado FROM empresa where razon_social LIKE '%" + busquedabody + "%'");
                const empresasfinal = JSON.parse(JSON.stringify(empresas[0]));
                if (empresasfinal.length > 0) {
                    return res.json(empresasfinal);
                } else {
                    return res.json({ success: false });
                }
            } catch (error) {
                return res.sendStatus(400);
            }
        } else {
            return res.sendStatus(400);
        }
    } else {
        return res.sendStatus(400);
    }

}

export async function traerProductoWebRuc(req: Request, res: Response): Promise<Response> {

    if (req.header('APP-Signature') != undefined && req.body.code != undefined && req.body.ruc != undefined) {
        if (req.header('APP-Signature') == 'renzo') {
            let rucbody = req.body.ruc;
            let serve = req.headers.host;
            let protocolo = req.protocol + "://";
            let servidor = protocolo + serve;
            try {
                const conn = await database.conexionObtener();
                const productos = await conn.query("SELECT p.id,e.ruc as empresa_ruc,e.razon_social AS empresa_razon_social,p.nombre,p.descripcion,p.categoria_menu,CONCAT('" + servidor + "',p.url_imagen) AS url_imagen,p.precio_unitario," +
                    "p.ranking,p.estado FROM producto p INNER JOIN empresa e ON p.empresa_ruc=e.ruc " + " WHERE p.empresa_ruc='" + rucbody + "' AND p.tipo='n'");
                const productosfinal = JSON.parse(JSON.stringify(productos[0]));
                if (productosfinal.length > 0) {
                    return res.json(productosfinal);
                } else {
                    return res.json({ success: false });
                }
            } catch (error) {
                return res.sendStatus(400);
            }
        } else {
            return res.sendStatus(400);
        }
    } else {
        return res.sendStatus(400);
    }
}

export async function nuevoProducto(req: Request, res: Response): Promise<Response> {

    if (req.header('APP-Signature') != undefined  && req.body.code != undefined && req.body.producto != undefined && req.body.imagen) {
        if (req.header('APP-Signature') == 'renzo') {


            let producto = req.body.producto;
            
            //return res.json({ success: false });
            
            let imagen = req.body.imagen;


            let base64String = imagen.base64; // Not a real image
            // Remove header
            let base64Image = base64String.split(';base64,').pop();

            let archivoNombre = imagen.nombre + "." + imagen.tipo;


            try {
                let conn = await database.conexionObtener();

                fs.writeFile(join(__dirname, '/../public/img/productos/') + archivoNombre, base64Image, { encoding: 'base64' }, function (err) {
                    console.log('File created');
                });
                let url_imagen = "/img/productos/" + archivoNombre;
                let insertar = await conn.query("INSERT INTO producto(empresa_ruc,nombre,descripcion,categoria_menu,url_imagen,"+
                "precio_unitario,ranking,estado,tipo) VALUES ('"+producto.empresa_ruc+"','"+producto.nombre+"','"+producto.descripcion+"','"+producto.categoria_menu+"','"+url_imagen+"','"+producto.precio_unitario+"','"+producto.ranking+"','A','n');");
                return res.json({ success: true });


            } catch (error) {
                return res.sendStatus(400);
            }
        } else {
            return res.sendStatus(400);
        }
    } else {
        return res.sendStatus(400);
    }

}

export async function traerProductoWebSearch(req: Request, res: Response): Promise<Response> {
    if (req.header('APP-Signature') != undefined && req.body.code != undefined && req.body.ruc != undefined && req.body.busqueda !=undefined) {
        if (req.header('APP-Signature') == 'renzo') {
            let rucbody = req.body.ruc;
            let busquedabody = req.body.busqueda;
            let serve = req.headers.host;
            let protocolo = req.protocol + "://";
            let servidor = protocolo + serve;
            try {
                const conn = await database.conexionObtener();
                const productos = await conn.query("SELECT p.id,e.ruc as empresa_ruc,e.razon_social AS empresa_razon_social,p.nombre,p.descripcion,p.categoria_menu,CONCAT('" + servidor + "',p.url_imagen) AS url_imagen,p.precio_unitario,p.ranking,p.estado FROM producto p INNER JOIN empresa e ON p.empresa_ruc=e.ruc  WHERE p.empresa_ruc='" + rucbody + "' AND p.tipo='n' AND p.nombre LIKE '%" + busquedabody + "%'");
                const productosfinal = JSON.parse(JSON.stringify(productos[0]));

                if (productosfinal.length > 0) {
                    return res.json(productosfinal);
                } else {
                    return res.json({ success: false });
                }
            } catch (error) {
                return res.sendStatus(400);
            }
        } else {
            return res.sendStatus(400);
        }
    } else {
        return res.sendStatus(400);
    }
}

export async function cambiarEstadoProducto(req: Request, res: Response): Promise<Response> {
    console.log(req.body);
    if (req.header('APP-Signature') != undefined && req.body.code != undefined
        && req.body.id != undefined && req.body.estado != undefined) {
        if (req.header('APP-Signature') == 'renzo') {
            let idbody = req.body.id;
            let estadobody = req.body.estado;
            try {
                const conn = await database.conexionObtener();
                let resultado1 = await conn.query(" UPDATE producto SET estado = '"+estadobody+"' WHERE id = '"+idbody+"'");
                return res.json({ success: true });
            } catch (error) {
                return res.sendStatus(400);
            }
        } else {
            return res.sendStatus(400);
        }
    } else {
        return res.sendStatus(400);
    }

}

export async function modificarProducto(req: Request, res: Response): Promise<Response> {

    if (req.header('APP-Signature') != undefined   && req.body.code != undefined && req.body.producto != undefined && req.body.imagen) {
        if (req.header('APP-Signature') == 'renzo') {

            let producto = req.body.producto;
            let imagen = req.body.imagen;
            console.log(producto);
            let base64String = imagen.base64; // Not a real image
            // Remove header
            let base64Image = base64String.split(';base64,').pop();

            let archivoNombre = imagen.nombre + "." + imagen.tipo;
            try {
                let conn = await database.conexionObtener();
                if (imagen.tipo === 'png') {
                    fs.writeFile(join(__dirname, '/../public/img/productos/') + archivoNombre, base64Image, { encoding: 'base64' }, function (err) {
                        console.log('File created');
                    });
                    let url_imagen = "/img/productos/" + archivoNombre;
                    let insertar = await conn.query("UPDATE producto SET nombre = '"+producto.nombre+"',descripcion = '"+producto.descripcion+"',categoria_menu = '"+producto.categoria_menu+"',url_imagen = '"+url_imagen+"',"+
                    " precio_unitario = '"+producto.precio_unitario+"',ranking = '"+producto.ranking+"' WHERE id = '"+producto.id+"'");
                    return res.json({ success: true });
                } else {
                    let insertar = await conn.query("UPDATE producto SET nombre = '"+producto.nombre+"',descripcion = '"+producto.descripcion+"',categoria_menu = '"+producto.categoria_menu+"',"+
                    " precio_unitario = '"+producto.precio_unitario+"',ranking = '"+producto.ranking+"' WHERE id = '"+producto.id+"'");
                    return res.json({ success: true });
                }


            } catch (error) {
                return res.sendStatus(400);
            }

        } else {
            return res.sendStatus(400);
        }
    } else {
        return res.sendStatus(400);
    }

}

export async function traerConfiguracionSistema(req: Request, res: Response): Promise<Response> {
    if (req.header('APP-Signature') != undefined && req.body.code != undefined) {
        if (req.header('APP-Signature') == 'renzo') {
            try {
                const conn = await database.conexionObtener();
                const configuracion = await conn.query("SELECT * FROM configuracion");
                const configuracionfinal = JSON.parse(JSON.stringify(configuracion[0]));

                if (configuracionfinal.length > 0) {
                    return res.json(configuracionfinal[0]);
                } else {
                    return res.json({ success: false });
                }
            } catch (error) {
                return res.sendStatus(400);
            }
        } else {
            return res.sendStatus(400);
        }
    } else {
        return res.sendStatus(400);
    }
}

export async function cambiarEstadoPedidoSistema(req: Request, res: Response): Promise<Response> {
    console.log(req.body);
    if (req.header('APP-Signature') != undefined && req.body.code != undefined
        && req.body.estado != undefined) {
        if (req.header('APP-Signature') == 'renzo') {
            let estadobody = req.body.estado;
            try {
                const conn = await database.conexionObtener();
                let resultado1 = await conn.query("UPDATE configuracion SET estado ='"+estadobody+"' WHERE id = 1");
                return res.json({ success: true });
            } catch (error) {
                return res.sendStatus(400);
            }
        } else {
            return res.sendStatus(400);
        }
    } else {
        return res.sendStatus(400);
    }

}

*/
