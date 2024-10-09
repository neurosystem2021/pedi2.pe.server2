import { Request, Response } from 'express';
import Database from "../classes/database";
import { NotificacionEstadoPedido, NotificacionMensaje } from '../classes/fcm';
const database = Database.instance;
import moment from 'moment-timezone';

export async function PedidoMotorizadoSolicitud(req: Request, res: Response): Promise<Response> {

        if (req.query.IdMotorizado != undefined ) {

            let idMotorizado = req.query.IdMotorizado;
            let serve = req.headers.host;
            let protocolo = req.protocol + "://";
            let servidor = protocolo + serve;
            let rutaAlmacenamiento = "/img/empresas/";
            let rutaFinal = servidor + rutaAlmacenamiento;
            try {
                let conn = await database.conexionObtener();
                let resultado = await conn.query("SELECT Gen_Pedido.IdPedido,Gen_Cliente.IdCliente,CONCAT('"+rutaFinal+"',Gen_Empresa.ImagenUrl) AS ImagenUrl, CONCAT(Gen_Cliente.Nombres, ' ', Gen_Cliente.Apellidos) AS Cliente, Gen_Empresa.RazonSocial AS Empresa, Gen_Pedido.Direccion,"+
                " Gen_Pedido.Referencia, Gen_Pedido.Estado, Gen_Pedido.IdEmpresa, Gen_Pedido.FechaReg,IFNULL(Gen_GrupoMotorizado.IdRegion,0) AS IdRegion, DATE_FORMAT(Gen_Pedido.FechaReg, '%Y-%m-%d %H:%i:%s') AS FechaRegFormat FROM Gen_Pedido "+
                " INNER JOIN Gen_Cliente ON  Gen_Pedido.IdCliente = Gen_Cliente.IdCliente "+
                " INNER JOIN Gen_Empresa ON Gen_Pedido.IdEmpresa =  Gen_Empresa.IdEmpresa "+
                " INNER JOIN Gen_Motorizado ON Gen_Pedido.IdMotorizado = Gen_Motorizado.IdMotorizado "+
                " LEFT JOIN Gen_GrupoMotorizado ON Gen_Motorizado.IdGrupoMotorizado = Gen_GrupoMotorizado.IdGrupoMotorizado "+
                " WHERE Gen_Pedido.IdMotorizado="+idMotorizado+" AND Gen_Pedido.Estado ='PE'");
                let resultadofinal = JSON.parse(JSON.stringify(resultado[0]));

                if (resultadofinal.length > 0) {
                    return res.json({ success: true,  msg:'Nueva solicitud de viaje...' , data:resultadofinal  });

                } else {

                    return res.json({ success: false, msg:'No tiene solicitudes de viaje...' ,data:[] });

                }

            } catch (error) {
                return res.sendStatus(400);
            }

        } else {
            return res.json({ success: false, msg:"No se porcionaron parametros correctos"  });
        }
   
}

export async function PedidoMotorizadoSolicitudDetalle(req: Request, res: Response): Promise<Response> {

    if (req.query.IdPedido != undefined ) {

        let idPedido = req.query.IdPedido;
        try {
            let conn = await database.conexionObtener();
            let resultadoPedido = await conn.query("SELECT Gen_Pedido.* FROM Gen_Pedido "+
            " WHERE Gen_Pedido.IdPedido="+idPedido);
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

                let resultadoProducto = await conn.query("SELECT IdPedidoDet, IdPedido, IdProducto, Producto, Descripcion, Cantidad,"+
                " ProductoImagenUrl, Precio, Indicacion FROM Gen_PedidoDet WHERE IdPedido="+pedido.IdPedido);
                let resultadofinalProducto = JSON.parse(JSON.stringify(resultadoProducto[0]));


                pedido.Cliente=resultadofinalCliente[0];
                pedido.Empresa=resultadofinalEmpresa[0];
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

export async function PedidoAccion(req: Request, res: Response): Promise<Response> {

        if (req.body.IdPedido != undefined && req.body.Accion != undefined ) {

            let idPedido = req.body.IdPedido;
            let accion = req.body.Accion;
        
            try {
                let conn = await database.conexionObtener();
                let resultadoPedido = await conn.query("SELECT IdPedido, Estado FROM Gen_Pedido WHERE IdPedido="+idPedido+" AND Estado='PE'");
                let resultadofinalPedido = JSON.parse(JSON.stringify(resultadoPedido[0]));

                if (resultadofinalPedido.length > 0) {
                    if(accion==1){
                        let resultado1 = await conn.query("UPDATE Gen_Pedido SET  Estado = 'PU' WHERE IdPedido ="+idPedido);    
                        return res.json({ success: true, msg:'Pedido iniciado!',idPedido:idPedido });
                    }else if(accion==0){
                        let resultado1 = await conn.query("UPDATE Gen_Pedido SET IdMotorizado = NULL, Estado = 'PU' WHERE IdPedido ="+idPedido);
                        return res.json({ success: true, msg:'Pedido Cancelado!',idPedido:idPedido });
                    }
                    else{
                        return res.sendStatus(400);   
                    }


                } else {

                    return res.json({ success: false, msg:"El pedido ya se encuntra activo" });

                }

            } catch (error) {
                return res.sendStatus(400);
            }

        } else {
            return res.json({ success: false, msg:'No se porcionaron parametros correctos' });
        } 
}

export async function PedidoMotorizadoActivo(req: Request, res: Response): Promise<Response> {

    if (req.query.IdMotorizado != undefined) {

        let idMotorizado = req.query.IdMotorizado;
        try {
            let conn = await database.conexionObtener();
            let resultadoPedido = await conn.query("SELECT IdPedido FROM Gen_Pedido WHERE IdMotorizado="+idMotorizado+" AND (Estado <> 'F' AND Estado <> 'C' AND Estado  <> 'PE' AND  Estado <> 'E' )");
            let resultadofinalPedido = JSON.parse(JSON.stringify(resultadoPedido[0]));

            if (resultadofinalPedido.length > 0) {
                return res.json({ success: true, msg:'Existe un pedido activo.', idPedido:resultadofinalPedido[0].IdPedido  });
            } else {

                return res.json({ success: false, msg:"No existe ningun pedido activo" });

            }

        } catch (error) {
            return res.sendStatus(400);
        }

    } else {
        return res.json({ success: false, msg:'No se porcionaron parametros correctos' });
    }
}

export async function PedidoMotorizadoActivoDetalle(req: Request, res: Response): Promise<Response> {

    if (req.query.IdMotorizado != undefined ) {

        let idMotorizado = req.query.IdMotorizado;
        try {
            let conn = await database.conexionObtener();
            let resultadoPedido = await conn.query("SELECT Gen_Pedido.* FROM Gen_Pedido "+
            " WHERE IdMotorizado="+idMotorizado+" AND (Estado <> 'F' AND Estado <> 'C' AND Estado  <> 'PE' AND  Estado <> 'E' )");
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

                let resultadoProducto = await conn.query("SELECT IdPedidoDet, IdPedido, IdProducto, Producto, Descripcion, Cantidad,"+
                " ProductoImagenUrl, Precio, Indicacion FROM Gen_PedidoDet WHERE IdPedido="+pedido.IdPedido);
                let resultadofinalProducto = JSON.parse(JSON.stringify(resultadoProducto[0]));


                pedido.Cliente=resultadofinalCliente[0];
                pedido.Empresa=resultadofinalEmpresa[0];
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

export async function chatPedidoObtener(req: Request, res: Response): Promise<Response> {
    
    if (req.query.IdPedido != undefined) {

        let idPedido = req.query.IdPedido;
        try {
            let conn = await database.conexionObtener();
            let resultadoPedido = await conn.query("SELECT Chat FROM Gen_Pedido WHERE IdPedido = "+idPedido);
            let resultadofinalPedido = JSON.parse(JSON.stringify(resultadoPedido[0]));

            if (resultadofinalPedido.length > 0) {
    
                return res.json({ success: true, msg:'Chat obtenido', chat:resultadofinalPedido[0].Chat });

            } else {

                return res.json({ success: false, msg:"No existe pedido" });

            }

        } catch (error) {
            return res.sendStatus(400);
        }

    } else {
        return res.json({ success: false, msg:'No se porcionaron parametros correctos' });
    }
}

export async function chatPedidoUpdate(req: Request, res: Response): Promise<Response> {
    if (req.body.IdPedido != undefined && req.body.Chat != undefined && req.body.Tipo != undefined) {

        let idPedido = req.body.IdPedido;
        let mensaje = req.body.Chat;
        let tipo = req.body.Tipo;

        try {
             let conn = await database.conexionObtener();
            let resultadoPedido = await conn.query("SELECT Gen_Pedido.Chat,Gen_Motorizado.TokenFcm AS TokenMotorizado,Gen_Cliente.TokenFcm AS TokenCliente,Gen_Motorizado.Nombres AS NombreMotorizado, Gen_Cliente.Nombres AS NombreCliente FROM Gen_Pedido" +
            " INNER JOIN Gen_Cliente ON Gen_Pedido.IdCliente = Gen_Cliente.IdCliente "+
            " LEFT JOIN Gen_Motorizado ON Gen_Pedido.IdMotorizado = Gen_Motorizado.IdMotorizado WHERE IdPedido = "+idPedido);
            let resultadofinalPedido = JSON.parse(JSON.stringify(resultadoPedido[0]));

            if (resultadofinalPedido.length > 0) {
                let chat =null;
                if(resultadofinalPedido[0].Chat!=null && resultadofinalPedido[0].Chat!=''){
                    chat=JSON.parse(resultadofinalPedido[0].Chat);
                    chat.push(JSON.parse(mensaje))
                }else{
                    chat = [];
                    chat.push(JSON.parse(mensaje))

                }

                let resultado1 = await conn.query("UPDATE Gen_Pedido SET  Chat = '"+JSON.stringify(chat)+"' WHERE IdPedido ="+idPedido);    
                try {
                    let titulo = "";
                    switch (tipo) {
                        case 'MOTORIZADO':
                            titulo = "Nuevo mensaje del cliente";
                            if(resultadofinalPedido[0].TokenMotorizado!= null && resultadofinalPedido[0].TokenMotorizado!= ''){
                                await NotificacionMensaje(1,resultadofinalPedido[0].TokenMotorizado, resultadofinalPedido[0].NombreCliente, JSON.parse(mensaje).msg, titulo)
                            }
                        
                            break;
                        case 'CLIENTE':
                            titulo = "Nuevo mensaje del repartidor";
                            if(resultadofinalPedido[0].TokenCliente!= null && resultadofinalPedido[0].TokenCliente!= ''){
                                await NotificacionMensaje(2,resultadofinalPedido[0].TokenCliente,resultadofinalPedido[0].NombreMotorizado, JSON.parse(mensaje).msg, titulo)
                            }
                            break;
                        default:
                            break;
                    }

                } catch (error) {
                    console.log(error);
                }
                return res.json({ success: true, msg:'Chat Actualizado', chat:JSON.stringify(chat) });

            } else {

                return res.json({ success: false, msg:"No existe pedido" });

            }
        } catch (error) {
            console.log(error);
            return res.sendStatus(400);
        }

    } else {
        return res.json({ success: false, msg:'No se porcionaron parametros correctos' });
    }
}

export async function PedidoCambiarCamino(req: Request, res: Response): Promise<Response> {
   
    if (req.body.IdPedido != undefined && req.body.IdMotorizado != undefined) {

        let idPedido = req.body.IdPedido;
        let idMotorizado = req.body.IdMotorizado;
        try {
            let conn = await database.conexionObtener();
            let resultadoPedido = await conn.query("SELECT Gen_Pedido.IdPedido, Gen_Pedido.Estado, Gen_Empresa.FacturaUrl, Gen_Empresa.IdAlmacen, Gen_Cliente.TokenFcm, Gen_Pedido.IdCliente,Gen_Empresa.TieneSistema,IFNULL(Gen_GrupoMotorizado.IdRegion,0) AS IdRegion  FROM Gen_Pedido "+
            " INNER JOIN Gen_Empresa ON Gen_Pedido.IdEmpresa = Gen_Empresa.IdEmpresa "+
            " INNER JOIN Gen_Cliente ON Gen_Pedido.IdCliente = Gen_Cliente.IdCliente "+
            " INNER JOIN Gen_Motorizado ON Gen_Pedido.IdMotorizado = Gen_Motorizado.IdMotorizado "+
            " LEFT JOIN Gen_GrupoMotorizado ON Gen_Motorizado.IdGrupoMotorizado = Gen_GrupoMotorizado.IdGrupoMotorizado "+
            " WHERE Gen_Pedido.IdPedido=" + idPedido + " AND Gen_Pedido.IdMotorizado = "+ idMotorizado);
            let resultadofinalPedido = JSON.parse(JSON.stringify(resultadoPedido[0]));

            if (resultadofinalPedido.length > 0) {

                if(resultadofinalPedido[0].Estado=='PE'){
                    let resultado1 = await conn.query("UPDATE Gen_Pedido SET  Estado = 'PU' WHERE IdPedido ="+idPedido);    
                    try {
                        let estado = await NotificacionEstadoPedido(resultadofinalPedido[0].IdCliente,resultadofinalPedido[0].TokenFcm,'PU',resultadofinalPedido[0].TieneSistema)
                    } catch (error) {
                        
                    }
                    
                    return res.json({ success: 1, msg:'Dirigete a la casa del cliente!', estado:'PU',idPedido:idPedido, facturaUrl:resultadofinalPedido[0].FacturaUrl, idAlmacen:resultadofinalPedido[0].IdAlmacen, idRegion:resultadofinalPedido[0].IdRegion });
                }else{
                    return res.json({ success: 2, msg:'El pedido tiene otro estado!', estado:resultadofinalPedido[0].Estado });
                }

            } else {

                return res.json({ success: 3, msg:"No existe pedido" });

            }

        } catch (error) {
            return res.sendStatus(400);
        }

    } else {
        return res.json({ success: 4, msg:'No se porcionaron parametros correctos' });
    } 
}

export async function PedidoCambiarUbicación(req: Request, res: Response): Promise<Response> {

    if (req.body.IdPedido != undefined && req.body.IdMotorizado != undefined) {

        let idPedido = req.body.IdPedido;
        let idMotorizado = req.body.IdMotorizado;
    
        try {
            let conn = await database.conexionObtener();
            let resultadoPedido = await conn.query("SELECT Gen_Pedido.IdPedido, Gen_Pedido.Estado, Gen_Empresa.FacturaUrl, Gen_Empresa.IdAlmacen, Gen_Cliente.TokenFcm, Gen_Pedido.IdCliente,Gen_Empresa.TieneSistema,IFNULL(Gen_GrupoMotorizado.IdRegion,0) AS IdRegion FROM Gen_Pedido "+
            " INNER JOIN Gen_Empresa ON Gen_Pedido.IdEmpresa = Gen_Empresa.IdEmpresa "+
            " INNER JOIN Gen_Cliente ON Gen_Pedido.IdCliente = Gen_Cliente.IdCliente "+
            " INNER JOIN Gen_Motorizado ON Gen_Pedido.IdMotorizado = Gen_Motorizado.IdMotorizado "+
            " LEFT JOIN Gen_GrupoMotorizado ON Gen_Motorizado.IdGrupoMotorizado = Gen_GrupoMotorizado.IdGrupoMotorizado "+
            " WHERE Gen_Pedido.IdPedido = "+idPedido + " AND Gen_Pedido.IdMotorizado = "+ idMotorizado);
            let resultadofinalPedido = JSON.parse(JSON.stringify(resultadoPedido[0]));

            if (resultadofinalPedido.length > 0) {
                if(resultadofinalPedido[0].Estado=='PU'){
                    let resultado1 = await conn.query("UPDATE Gen_Pedido SET  Estado = 'UC' WHERE IdPedido ="+idPedido); 
                    try {
                        let estado = await NotificacionEstadoPedido(resultadofinalPedido[0].IdCliente,resultadofinalPedido[0].TokenFcm,'UC',resultadofinalPedido[0].TieneSistema)
                    } catch (error) {
                        
                    }
                    return res.json({ success: 1, msg:'Esta en la ubicación del cliente!', estado:'UC' , facturaUrl:resultadofinalPedido[0].FacturaUrl, idAlmacen:resultadofinalPedido[0].IdAlmacen, idRegion:resultadofinalPedido[0].IdRegion });
                }else{
                    return res.json({ success: 2, msg:'El pedido tiene otro estado!', estado:resultadofinalPedido[0].Estado });
                }

            } else {
                return res.json({ success: 3, msg:"El pedido ya se encuntra activo" });
            }

        } catch (error) {
            return res.sendStatus(400);
        }

    } else {
        return res.json({ success: 4, msg:'No se porcionaron parametros correctos' });
    } 
}

export async function PedidoCambiarFinalizar(req: Request, res: Response): Promise<Response> {

    if (req.body.IdPedido != undefined && req.body.IdMotorizado != undefined) {
        let idPedido = req.body.IdPedido;
        let idMotorizado = req.body.IdMotorizado;
        try {
            const hoy = moment().tz("America/Lima");
            moment.locale('es');
            const hoyformateado = hoy.format('YYYY-MM-DD HH:mm:ss');
            let conn = await database.conexionObtener();
            let resultadoPedido = await conn.query("SELECT Gen_Pedido.IdPedido, Gen_Pedido.Estado, Gen_Empresa.FacturaUrl, Gen_Empresa.IdAlmacen, Gen_Cliente.TokenFcm, Gen_Pedido.IdCliente,Gen_Empresa.RazonSocial,Gen_Empresa.TieneSistema,IFNULL(Gen_GrupoMotorizado.IdRegion,0) AS IdRegion  FROM Gen_Pedido "+
            " INNER JOIN Gen_Empresa ON Gen_Pedido.IdEmpresa = Gen_Empresa.IdEmpresa "+
            " INNER JOIN Gen_Cliente ON Gen_Pedido.IdCliente = Gen_Cliente.IdCliente "+
            " INNER JOIN Gen_Motorizado ON Gen_Pedido.IdMotorizado = Gen_Motorizado.IdMotorizado "+
            " LEFT JOIN Gen_GrupoMotorizado ON Gen_Motorizado.IdGrupoMotorizado = Gen_GrupoMotorizado.IdGrupoMotorizado "+
            " WHERE Gen_Pedido.IdPedido = "+ idPedido+ " AND Gen_Pedido.IdMotorizado = "+ idMotorizado);
            let resultadofinalPedido = JSON.parse(JSON.stringify(resultadoPedido[0]));

            if (resultadofinalPedido.length > 0) {

                if(resultadofinalPedido[0].Estado=='UC'){
                    let resultado1 = await conn.query("UPDATE Gen_Pedido SET  Estado = 'F', FechaFinalizado ='"+hoyformateado+"' WHERE IdPedido ="+idPedido); 
                    try {
                        let insertNotificacion = await conn.query("INSERT INTO Gen_Notificacion (IdCliente,IdOpcNotificacion,Mensaje,Leido,FechaReg) VALUES ("+resultadofinalPedido[0].IdCliente+",4,'Su pedido a "+resultadofinalPedido[0].RazonSocial+" ha sido completado, gracias por la confianza.',0,'"+hoyformateado+"')"); 
                    } catch (error) {
                        console.log(error);
                    }  
                    try {
                        let estado = await NotificacionEstadoPedido(resultadofinalPedido[0].IdCliente,resultadofinalPedido[0].TokenFcm,'F',resultadofinalPedido[0].TieneSistema)
                    } catch (error) {
                        
                    } 
                    return res.json({ success: 1, msg:'Pedido Finalizado!', estado:'F', facturaUrl:resultadofinalPedido[0].FacturaUrl, idAlmacen:resultadofinalPedido[0].IdAlmacen, idRegion:resultadofinalPedido[0].IdRegion });
                }else{
                    return res.json({ success: 2, msg:'El pedido tiene otro estado!', estado:resultadofinalPedido[0].Estado});
                }

            } else {

                return res.json({ success: 3, msg:"El pedido ya se encuntra activo" });

            }

        } catch (error) {
            return res.sendStatus(400);
        }

    } else {
        return res.json({ success: 4, msg:'No se porcionaron parametros correctos' });
    } 
}