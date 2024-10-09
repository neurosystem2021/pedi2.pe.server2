import { Request, Response } from 'express';
import Database from "../classes/database";
import { NotificacionEstadoMotorizado, NotificacionEstadoPedido } from '../classes/fcm';
const database = Database.instance;


export async function EmpresaDatos(req: Request, res: Response): Promise<Response> {
    if(req.query.HostUrl != undefined  && req.query.IdAlmacen != undefined){
        let hostUrl = req.query.HostUrl;
        let idAlmacen = req.query.IdAlmacen;
        try {
            let conn = await database.conexionObtener();
            let resultadoEmpresa = await conn.query("SELECT * FROM Gen_Empresa WHERE FacturaUrl = '"+hostUrl+"' AND IdAlmacen = "+idAlmacen+" LIMIT 1");
            let resultadoEmpresaFinal = JSON.parse(JSON.stringify(resultadoEmpresa[0]));
    
            if (resultadoEmpresaFinal.length > 0) {
                return res.json({ success: true, data:resultadoEmpresaFinal[0] });
            } else {
                return res.sendStatus(400);
            }
    
        } catch (error) {
            return res.sendStatus(400);
        }
    }else{
        return res.sendStatus(400)
    }
}

export async function PlataformaPedidos(req: Request, res: Response): Promise<Response> {
    if(req.query.IdEmpresa != undefined){
        let idEmpresa = req.query.IdEmpresa;
        try {
            let conn = await database.conexionObtener();
            let resultadoPedido = await conn.query("SELECT Gen_Pedido.*,CONCAT(Gen_Cliente.Nombres,' ',Gen_Cliente.Apellidos) AS Cliente, " +
           " IF(ISNULL(Gen_Pedido.IdMotorizado), NULL, CONCAT(Gen_Motorizado.Nombres,' ',Gen_Motorizado.Apellidos)) AS Motorizado, Gen_Empresa.RazonSocial,Gen_Empresa.Direccion AS EmpresaDireccion, " +
           " Gen_Empresa.Latitud AS EmpresaLatitud, Gen_Empresa.Longitud AS EmpresaLongitud, Gen_Pedido.IdMotorizado,Gen_Pedido.IdCliente, Gen_Cliente.Telefono AS TelefonoCliente, Gen_Pedido.Referencia, " +
           " DetallePedidos.Productos FROM Gen_Pedido " +
           " INNER JOIN Gen_Cliente ON Gen_Pedido.IdCliente = Gen_Cliente.IdCliente " +
           " LEFT JOIN Gen_Motorizado ON Gen_Pedido.IdMotorizado = Gen_Motorizado.IdMotorizado " +
           " INNER JOIN Gen_Empresa ON Gen_Pedido.IdEmpresa = Gen_Empresa.IdEmpresa " +
           " LEFT JOIN (SELECT Gen_PedidoDet.IdPedido, " +
           " CONCAT( '[', GROUP_CONCAT( CONCAT( '{ \"IdPedidoDet\":', Gen_PedidoDet.IdPedidoDet ,',\"IdPedido\":', Gen_PedidoDet.IdPedido , ',\"IdProducto\":',Gen_PedidoDet.IdProducto,',\"Producto\":\"',Gen_PedidoDet.Producto,'\",\"Descripcion\":\"',Gen_PedidoDet.Descripcion,'\",\"Cantidad\":', Gen_PedidoDet.Cantidad, ',\"ProductoImagenUrl\":\"',Gen_PedidoDet.ProductoImagenUrl,'\",\"Indicacion\":\"',Gen_PedidoDet.Indicacion,'\",\"Precio\":',Gen_PedidoDet.Precio,' }' ) SEPARATOR ', '), ']' ) AS Productos FROM Gen_PedidoDet GROUP BY Gen_PedidoDet.IdPedido )  AS DetallePedidos ON DetallePedidos.IdPedido = Gen_Pedido.IdPedido "+      
           " WHERE (Gen_Pedido.Estado <> 'F' AND Gen_Pedido.Estado <> 'C') AND Gen_Empresa.IdEmpresa="+idEmpresa);
            let resultadofinalPedido = JSON.parse(JSON.stringify(resultadoPedido[0]));
    
            if (resultadofinalPedido.length > 0) {
                   
                return res.json({ success: true, data:resultadofinalPedido });
    
            } else {
    
                return res.json({ success: false, msg:'No existe ningun pedido' });
    
            }
    
        } catch (error) {
            return res.sendStatus(400);
        }
    }else{
        return res.sendStatus(400)
    }
}

export async function PlataformaDetallePedido(req: Request, res: Response): Promise<Response> {
    if(req.query.IdPedido != undefined){
        let idPedido = req.query.IdPedido;
        try {
            let conn = await database.conexionObtener();
            let resultadoPedido = await conn.query("SELECT IdPedidoDet, IdPedido, IdProducto, Producto, Descripcion, Cantidad,"+
            " ProductoImagenUrl, Precio, Indicacion FROM Gen_PedidoDet WHERE IdPedido="+idPedido);
            let resultadofinalPedido = JSON.parse(JSON.stringify(resultadoPedido[0]));
    
            if (resultadofinalPedido.length > 0) {
                   
                return res.json({ success: true, data:resultadofinalPedido });
    
            }else{
                return res.sendStatus(400);
            }
    
        } catch (error) {
            return res.sendStatus(400);
        }
    }else{
        return res.sendStatus(400)
    }
}

export async function PedidoAceptar(req: Request, res: Response): Promise<Response> {
    
    if (req.body.IdPedido != undefined) {
            let IdPedido = req.body.IdPedido;
            let Usuario = req.body.Usuario;
            try {
                let conn = await database.conexionObtener();
                let resultado = await conn.query("SELECT Gen_Pedido.IdCliente, Gen_Pedido.Estado, Gen_Cliente.TokenFcm, Gen_Empresa.TieneSistema FROM Gen_Pedido "+
                " INNER JOIN Gen_Empresa ON Gen_Pedido.IdEmpresa = Gen_Empresa.IdEmpresa "+
                " INNER JOIN Gen_Cliente ON Gen_Pedido.IdCliente = Gen_Cliente.IdCliente  WHERE IdPedido="+IdPedido);
                let resultadofinal = JSON.parse(JSON.stringify(resultado[0]));
                
                if (resultadofinal.length > 0) {
                    if(resultadofinal[0].Estado=='E'){
                        await conn.query("UPDATE Gen_Pedido SET Estado ='PE' , UsuarioReg='"+Usuario+"' WHERE IdPedido = "+IdPedido);
                        try {
                            let estado = await NotificacionEstadoPedido(resultadofinal[0].IdCliente,resultadofinal[0].TokenFcm,'PE',resultadofinal[0].TieneSistema)
                        } catch (error) {
                            
                        }
                        return res.json({ success: true, msg: "El pedido se paso a preparando", usuario:Usuario });
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

export async function PedidoAsignarMotorizado(req: Request, res: Response): Promise<Response> {

    if (req.body.IdPedido != undefined && req.body.IdMotorizado != undefined) {

        let IdPedido = req.body.IdPedido;
        let IdMotorizado = req.body.IdMotorizado;
        let motorizadoNombre = req.body.Motorizado;
        try {
            let conn = await database.conexionObtener();
            /*let viajesMotorizado = await conn.query("SELECT COUNT(*) AS Contador FROM Gen_Pedido WHERE (Gen_Pedido.Estado <> 'F' AND Gen_Pedido.Estado <> 'C') "+
            " AND Gen_Pedido.IdMotorizado = "+IdMotorizado)
            let resultadofinalViajes = JSON.parse(JSON.stringify(viajesMotorizado[0]));
            if(resultadofinalViajes[0].Contador>0){
                return res.json({ success: 1, msg:"El motorizado ya se encuentra en viaje, se actualizará la lista" });
            }else{*/
                let resultadoPedido = await conn.query("SELECT IdPedido FROM Gen_Pedido WHERE IdPedido="+IdPedido+" AND Estado='PE' AND IdMotorizado IS NULL");
                let resultadofinalPedido = JSON.parse(JSON.stringify(resultadoPedido[0]));
                if (resultadofinalPedido.length > 0) {
                    let resultado1 = await conn.query("UPDATE Gen_Pedido SET  IdMotorizado = "+IdMotorizado+" WHERE IdPedido ="+IdPedido);    
                    try {
                        let estado = await NotificacionEstadoMotorizado(IdMotorizado)
                    } catch (error) {
                        
                    }
                    return res.json({ success: 2, msg:'¡Motorizado asignado al pedido! Actualizado'});
                } else {
    
                    return res.json({ success: 3, msg:"El pedido ya cuenta con motorizado asignado" });
    
                }
            //}

        } catch (error) {
            return res.sendStatus(400);
        }

    } else {
        return res.json({ success: false, msg:'No se porcionaron parametros correctos' });
    }
}

export async function PedidoCambiarMotorizado(req: Request, res: Response): Promise<Response> {

    if (req.body.IdPedido != undefined && req.body.IdMotorizadoNuevo != undefined && req.body.IdMotorizadoAnterior != undefined) {

        let idPedido = req.body.IdPedido;
        let idMotorizadoNuevo = req.body.IdMotorizadoNuevo;
        let idMotorizadoAnterior = req.body.IdMotorizadoAnterior;
        try {
            let conn = await database.conexionObtener();
            /*let viajesMotorizado = await conn.query("SELECT COUNT(*) AS Contador FROM Gen_Pedido WHERE (Gen_Pedido.Estado <> 'F' AND Gen_Pedido.Estado <> 'C') "+
            " AND Gen_Pedido.IdMotorizado = "+idMotorizadoNuevo)
            let resultadofinalViajes = JSON.parse(JSON.stringify(viajesMotorizado[0]));
            if(resultadofinalViajes[0].Contador>0){
                return res.json({ success: 1, msg:"El motorizado ya se encuentra en viaje, se actualizará la lista" });
            }else{*/
                let resultadoPedido = await conn.query("SELECT IdPedido FROM Gen_Pedido WHERE IdPedido="+idPedido+" AND IdMotorizado ="+idMotorizadoAnterior);
                let resultadofinalPedido = JSON.parse(JSON.stringify(resultadoPedido[0]));
                if (resultadofinalPedido.length > 0) {
                    let resultado1 = await conn.query("UPDATE Gen_Pedido SET  IdMotorizado = "+idMotorizadoNuevo+" WHERE IdPedido ="+idPedido);    
                    try {
                        let estado = await NotificacionEstadoMotorizado(idMotorizadoNuevo)
                    } catch (error) {
                        
                    }
                    return res.json({ success: 2, msg:'¡Motorizado asignado al pedido! Actualizado'});
                } else {
    
                    return res.json({ success: 3, msg:"El pedido ya cuenta con motorizado asignado" });
    
                }
            //}

        } catch (error) {
            return res.sendStatus(400);
        }

    } else {
        return res.json({ success: false, msg:'No se porcionaron parametros correctos' });
    }
}

export async function cancelarEstadoPedido(req: Request, res: Response): Promise<Response> {

    if (req.body.IdPedido != undefined) {

        let idPedido = req.body.IdPedido;
        try {
            let conn = await database.conexionObtener();
            let resultadoPedido = await conn.query("SELECT IdPedido, Estado, IdMotorizado  FROM Gen_Pedido WHERE IdPedido="+idPedido+" AND (Gen_Pedido.Estado <> 'F' AND Gen_Pedido.Estado <> 'C')");
            let resultadofinalPedido = JSON.parse(JSON.stringify(resultadoPedido[0]));

            if (resultadofinalPedido.length > 0) {
                let resultado1 = await conn.query("UPDATE Gen_Pedido SET  Estado = 'C' WHERE IdPedido ="+idPedido);    
                return res.json({ success: true, msg:'Pedido cancelado!', idPedido:idPedido, estado:'C',IdMotorizado:resultadofinalPedido[0].IdMotorizado  });
            } else {

                return res.json({ success: false, msg:"El pedido ya se finalizo o cancelo" });

            }

        } catch (error) {
            return res.sendStatus(400);
        }

    } else {
        return res.sendStatus(400);
    } 
}


export async function PedidoRechazar(req: Request, res: Response): Promise<Response> {

    if (req.body.IdPedido != undefined) {

        let idPedido = req.body.IdPedido;
        try {
            let conn = await database.conexionObtener();
            let resultadoPedido = await conn.query("SELECT IdPedido, Estado, IdMotorizado  FROM Gen_Pedido WHERE IdPedido="+idPedido+" AND (Gen_Pedido.Estado <> 'F' AND Gen_Pedido.Estado <> 'C')");
            let resultadofinalPedido = JSON.parse(JSON.stringify(resultadoPedido[0]));

            if (resultadofinalPedido.length > 0) {
                if(resultadofinalPedido[0].Estado=='E'){
                    let resultado1 = await conn.query("UPDATE Gen_Pedido SET  Estado = 'C' WHERE IdPedido ="+idPedido);    
                    return res.json({ success: true, msg:'Pedido cancelado!', idPedido:idPedido, estado:'C',IdMotorizado:resultadofinalPedido[0].IdMotorizado  });
                }else{
                    return res.json({ success: false, msg:"El pedido ya esta en proceso, puede cancelarlo en la lista." });
                }

            } else {

                return res.json({ success: false, msg:"El pedido ya se finalizo o cancelo" });

            }

        } catch (error) {
            return res.sendStatus(400);
        }

    } else {
        return res.sendStatus(400);
    } 
}