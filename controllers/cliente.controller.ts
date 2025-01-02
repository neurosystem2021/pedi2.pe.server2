import { Request, Response } from 'express';
import Database from "../classes/database";
import moment from 'moment-timezone';
import { EnviarOtp } from '../classes/otp';
import axios from "axios";
const database = Database.instance;
import * as dotenv from "dotenv";
//import { EnviarWhatsAppOtp } from '../classes/whatsapp';
dotenv.config();

const token_apis_peru = process.env.TOKEN_APIS_PERU;

export async function LoginCliente(req: Request, res: Response): Promise<Response> {
    if (req.query.Telefono != undefined && req.query.Password != undefined) {
        let telefonoBody = req.query.Telefono;
        let passwordBody = req.query.Password;

        try {
            const conn = await database.conexionObtener();
            const cliente = await conn.query("SELECT Gen_Cliente.*, DATE_FORMAT(Gen_Cliente.FechaReg, '%Y-%m-%d %H:%i:%s') AS FechaRegFormat,DATE_FORMAT(Gen_Cliente.FechaRegOtp, '%Y-%m-%d %H:%i:%s') AS FechaRegOtpFormat FROM Gen_Cliente WHERE Telefono= '" + telefonoBody + "' LIMIT 1");
            let resultado = JSON.parse(JSON.stringify(cliente[0]));
            if (resultado.length > 0) {
                let password = resultado[0].Password;
                if (password == passwordBody) {
                    if(resultado[0].OtpValidado==1){
                        return res.json({success:true, valido:true, data:resultado[0] });
                    }else{
                        return res.json({success:true, valido:false, data:resultado[0] });
                    }

                } else {
                    return res.json({ success: false, msg: 'La contraseña es incorrecta.' });
                }  
            } else {
                return res.json({ success: false, msg: 'Celular no encontrado, verique sus datos.' });
            }
        } catch (error) {
            return res.sendStatus(400);
        }

    } else {
        return res.sendStatus(400);
    }

}

export async function PedidoClienteExiste(req: Request, res: Response): Promise<Response> {

    if (req.query.IdCliente != undefined) {
        let idCliente = req.query.IdCliente;

        try {
            let conn = await database.conexionObtener();
            let resultado = await conn.query("SELECT Gen_Pedido.IdPedido,Gen_Pedido.IdCliente, Gen_Pedido.IdMotorizado, Gen_Pedido.IdEmpresa, Gen_Pedido.Estado FROM Gen_Pedido WHERE Gen_Pedido.IdCliente="+idCliente+"  AND (Gen_Pedido.Estado <> 'F' AND Gen_Pedido.Estado <> 'C') LIMIT 1");
            let resultadofinal = JSON.parse(JSON.stringify(resultado[0]));
            if (resultadofinal.length > 0) {
                return res.json({ success: true,  msg:'Existe un pedido en proceso.',  data:resultadofinal[0]  });
            } else {
                return res.json({ success: false, msg:'No existen pedidos en proceso para el cliente' });

            }

        } catch (error) {
            return res.sendStatus(400);
        }

    } else {
        return res.json({ success: false, msg:"No se porcionaron parametros correctos"  });
    }

}

export async function PedidoClienteExisteDetalle(req: Request, res: Response): Promise<Response> {

    if (req.query.IdCliente != undefined ) {

        let idCliente = req.query.IdCliente;
        let serve = req.headers.host;
        let protocolo = "https://";
        let servidor = protocolo + serve;
        let rutaAlmacenamiento = "/img/empresas/";
        let rutaFinal = servidor + rutaAlmacenamiento;
        try {
            let conn = await database.conexionObtener();
            let resultadoPedido = await conn.query("SELECT Gen_Pedido.* FROM Gen_Pedido WHERE (Gen_Pedido.Estado <> 'F' AND Gen_Pedido.Estado <> 'C') "+
            " AND Gen_Pedido.IdCliente="+idCliente);
            let resultadofinalPedido = JSON.parse(JSON.stringify(resultadoPedido[0]));

            if (resultadofinalPedido.length > 0) {
                let pedido = resultadofinalPedido[0];
                //Cliente
                let resultadoCliente = await conn.query("SELECT IdCliente, Nombres, Apellidos,Dni,Telefono, Email, Direccion, Direccion2, Direccion3,"+
                " Latitud, Longitud,Puntos FROM Gen_Cliente WHERE IdCliente="+pedido.IdCliente);
                let resultadofinalCliente = JSON.parse(JSON.stringify(resultadoCliente[0]));

                let resultadoEmpresa = await conn.query("SELECT Gen_Empresa.IdEmpresa,Gen_EmpresaCategoria.EmpresaCategoria, Gen_Empresa.RazonSocial, Gen_Empresa.Ruc, Gen_Empresa.Direccion,CONCAT('"+rutaFinal+"',Gen_Empresa.ImagenUrl) AS ImagenUrl, Gen_Empresa.Latitud, Gen_Empresa.Longitud,Gen_Empresa.TieneSistema "+
                " FROM Gen_Empresa INNER JOIN Gen_EmpresaCategoria ON Gen_Empresa.IdEmpresaCategoria = Gen_EmpresaCategoria.IdEmpresaCategoria"+
                " WHERE Gen_Empresa.IdEmpresa="+pedido.IdEmpresa);
                let resultadofinalEmpresa = JSON.parse(JSON.stringify(resultadoEmpresa[0]));
                
                let resultadoMotorizado = await conn.query("SELECT Gen_Motorizado.IdMotorizado, Gen_Motorizado.Nombres, Gen_Motorizado.Apellidos, Gen_Motorizado.Dni, Gen_Motorizado.Telefono,Gen_Motorizado.Password,Gen_Motorizado.Email,Gen_Motorizado.Direccion,"+
                " Gen_Motorizado.VehiculoPlaca,Gen_Motorizado.VehiculoColor,Gen_Motorizado.Vehiculo FROM Gen_Motorizado WHERE Gen_Motorizado.IdMotorizado="+pedido.IdMotorizado);
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

export async function EstadoPedido(req: Request, res: Response): Promise<Response> {
    if (req.query.IdPedido != undefined) {

        let idPedido = req.query.IdPedido;
        try {
             let conn = await database.conexionObtener();
            let resultadoPedido = await conn.query("SELECT Estado, IdMotorizado FROM Gen_Pedido  WHERE (Gen_Pedido.Estado <> 'F' AND Gen_Pedido.Estado <> 'C') AND IdPedido="+idPedido+" LIMIT 1");
            let resultadofinalPedido = JSON.parse(JSON.stringify(resultadoPedido[0]));

            if (resultadofinalPedido.length > 0) {
                return res.json({ success: true, estado:resultadofinalPedido[0].Estado, idMotorizado:resultadofinalPedido[0].IdMotorizado});
            } else {
                return res.json({ success: false, msg:"No existe pedido activo" });
            }
        } catch (error) {
            return res.sendStatus(400);
        }

    } else {
        return res.sendStatus(400);
    }
}



export async function PedidoRealizar(req: Request, res: Response): Promise<Response> {
    
    if (req.body.infoPedido != undefined && req.body.productos != undefined ) {
            let IdCliente = req.body.infoPedido.IdCliente;
            let IdEmpresa = req.body.infoPedido.IdEmpresa;
            let PrecioProductos = req.body.infoPedido.PrecioProductos;
            let MetodoPago = req.body.infoPedido.MetodoPago;
            let Latitud = req.body.infoPedido.Latitud;
            let Longitud = req.body.infoPedido.Longitud;
            let Direccion = req.body.infoPedido.Direccion;
            let PrecioDelivery = req.body.infoPedido.PrecioDelivery;
            let Referencia = req.body.infoPedido.Referencia;
            let Cambio = req.body.infoPedido.Cambio;
            let Productos = req.body.productos;

            const hoy = moment().tz("America/Lima");
            moment.locale('es');
            const hoyformateado = hoy.format('YYYY-MM-DD HH:mm:ss');

            try {
                let conn = await database.conexionObtener();
                let resultado = await conn.query("SELECT IdPedido FROM Gen_Pedido WHERE IdCliente = " + IdCliente + "  AND (Gen_Pedido.Estado <> 'F' AND Gen_Pedido.Estado <> 'C') LIMIT 1");
                let resultadofinal = JSON.parse(JSON.stringify(resultado[0]));
                if (resultadofinal.length > 0) {
                    return res.json({ success: false, msg: "Ya existe un pedido porfavor renicie la app." });
                } else {

                    try {
                        let resultado1 = await conn.query("INSERT INTO Gen_Pedido (IdCliente,IdEmpresa,PrecioDelivery,PrecioProductos,MetodoPago,Latitud,Longitud,Direccion,Referencia,FechaReg,Estado,EnviarPreparar,Cambio) " +
                            " VALUES ("+IdCliente+","+IdEmpresa+","+PrecioDelivery+","+PrecioProductos+",'"+MetodoPago+"','"+Latitud+"','"+Longitud+"','"+Direccion+"','"+Referencia+"','"+hoyformateado+"','E',0,"+Cambio+")");

                        let resultado2 = await conn.query("SELECT IdPedido FROM Gen_Pedido WHERE IdCliente = " + IdCliente + "  AND (Gen_Pedido.Estado <> 'F' AND Gen_Pedido.Estado <> 'C') LIMIT 1");
                        let resultadofinal2 = JSON.parse(JSON.stringify(resultado2[0]));
                        let IdPedido = resultadofinal2[0].IdPedido;


                        Productos.map(async (pro:any)=>{
                            /*Validad*/
                            pro.Producto = (''+pro.Producto).replace(new RegExp("'", 'g'), '');
                            pro.Producto = (''+pro.Producto).replace(new RegExp('"', 'g'), '');
                            pro.Producto = (''+pro.Producto).replace(new RegExp('\n', 'g'), '');
                            pro.Producto = (''+pro.Producto).replace(new RegExp('\\'.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), '')
                             await conn.query("INSERT INTO Gen_PedidoDet(IdPedido,IdProducto,Producto,Descripcion,Cantidad,ProductoImagenUrl,Precio,Indicacion)" +
                                "VALUES ("+IdPedido+","+pro.IdProducto+",'"+pro.Producto+"','null',"+pro.Cantidad+",'"+pro.ProductoImagenUrl+"',"+pro.Precio+",'"+pro.Indicacion+"')");
                        });

                        return res.json({ success: true , msg: "Pedido solicitado, será redigirido a ruta."});
                    } catch (error) {
                        return res.sendStatus(400);
                    }
                }

            } catch (error) {
                return res.sendStatus(400);
            }

    } else {
        return res.sendStatus(400);
    }

}

export async function PedidoCancelar(req: Request, res: Response): Promise<Response> {
    
    if (req.body.IdPedido != undefined ) {
            let IdPedido = req.body.IdPedido;
            try {
                let conn = await database.conexionObtener();
                let resultado = await conn.query("SELECT Estado, IdEmpresa FROM Gen_Pedido WHERE IdPedido="+IdPedido);
                let resultadofinal = JSON.parse(JSON.stringify(resultado[0]));
                if (resultadofinal.length > 0) {
                    if(resultadofinal[0].Estado=='E'){
                        await conn.query("UPDATE Gen_Pedido SET Estado ='C' WHERE IdPedido = "+IdPedido);
                        return res.json({ success: true, msg: "Pedido Cancelado", idEmpresa:resultadofinal[0].IdEmpresa  });
                    }else{
                        return res.json({ success: false, msg: "Error el pedido ya esta en proceso por favor renicie la app." });
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

export async function ClienteExiste(req: Request, res: Response): Promise<Response> {
    if (req.body.Telefono != undefined) {
        let Telefono = req.body.Telefono;

        try {
            const conn = await database.conexionObtener();
            const cliente = await conn.query("SELECT Telefono FROM Gen_Cliente WHERE Telefono = '" + Telefono + "'");
            let resultado = JSON.parse(JSON.stringify(cliente[0]));

            if (resultado.length > 0) {
                return res.json({ success: true, msg: 'Error, el número ingresado ya se encuentra registrado, utilize otro.' });
            } else {
                return res.json({ success: false });
            }

        } catch (error) {
            return res.sendStatus(400);
        }

    } else {
        return res.sendStatus(400);
    }

}

export async function ClienteRegistro(req: Request, res: Response): Promise<Response> {

        if (req.body.DataCliente != undefined) {

            let Telefono = req.body.DataCliente.Telefono;
            let Contrasena = req.body.DataCliente.Contrasena;
            let Dni = req.body.DataCliente.Dni || '';
            let Nombres = req.body.DataCliente.Nombres;
            let Apellidos = req.body.DataCliente.Apellidos || '';
            let hashSMS = req.body.hashSMS

            const hoy = moment().tz("America/Lima");
            moment.locale('es');
            const hoyformateado = hoy.format('YYYY-MM-DD HH:mm:ss');
            try {
                let conn = await database.conexionObtener();
                let resultado = await conn.query("SELECT Telefono FROM Gen_Cliente WHERE Telefono = '" + Telefono + "'");
                let resultadofinal = JSON.parse(JSON.stringify(resultado[0]));
                if (resultadofinal.length > 0) {
                    return res.json({ success: false, msg: 'Error, por favor intente nuevamente mas tarde.' });
                } else {
                    let otp = ''+ Math.floor(100000 + Math.random() * 900000);
                    await conn.query("INSERT INTO Gen_Cliente(Nombres,Apellidos,Dni,Telefono,Password,Puntos,FechaReg,Anulado,OtpCodigo,OtpValidado,FechaRegOtp) "+
                    " VALUES ('"+Nombres+"','"+Apellidos+"','"+Dni+"','"+Telefono+"','"+Contrasena+"',0,'"+hoyformateado+"',0,'"+otp.substring(0,4)+"',0,'"+hoyformateado+"')");
                    //Enviar msg twilio       
                    try {
                        setTimeout(async () => {
                            let respuestaEnvio = await EnviarOtp('+51'+Telefono,'Su código de verificación es: '+otp.substring(0,4),hashSMS)
                        }, 1000);

                        //Envio para whatsapp
                       // setTimeout(async () => {
                           // let respuestaEnvio = await EnviarWhatsAppOtp('51'+Telefono,'Su código de verificación es: *'+otp.substring(0,4)+'*     Atte.: Team http://pedi2.pe/')
                        //}, 1000);

                    } catch (error) {
                        
                    }             
                    return res.json({ success: true, msg: "¡Cuenta creada!" });
                }

            } catch (error) {
                return res.sendStatus(400);
            }

        } else {
            return res.sendStatus(400);
        }
}

export async function clienteHablanos(req: Request, res: Response): Promise<Response> {
    if (req.body.IdCliente != undefined && req.body.Opc != undefined ){ 
            let idCliente = req.body.IdCliente;
            let correoHablanos = req.body.Correo;
            let opcHablanos = req.body.Opc;
            let msgHablanos = req.body.Msg;
            const hoy = moment().tz("America/Lima");
            moment.locale('es');
            const hoyformateado = hoy.format('YYYY-MM-DD');
            try {
                const conn = await database.conexionObtener();
                const resultado = await conn.query("INSERT INTO Gen_Hablanos(IdCliente, IdOpcHablanos ,Correo, Mensaje, FechaReg) " +
                    "VALUES ('" + idCliente + "'," +opcHablanos  + ",'" + correoHablanos + "','" + msgHablanos + "','" + hoyformateado + "')");
                return res.json({ success: true });

            } catch (error) {
                return res.sendStatus(400);
            }

        } else {
            return res.sendStatus(400);
        }
}

export async function ClienteDirecciones(req: Request, res: Response): Promise<Response> {
    if(req.query.IdCliente != undefined){
    let idCliente = req.query.IdCliente;
        try {
            let conn = await database.conexionObtener();
            let resultadoDirecciones = await conn.query("SELECT IdDireccionUsuario,Direccion,Referencia,Latitud,Longitud FROM Gen_DireccionUsuario WHERE IdCliente = "+idCliente+" ORDER BY FechaReg ASC ");
            let resultadoDireccionesFinal = JSON.parse(JSON.stringify(resultadoDirecciones[0]));

            if (resultadoDireccionesFinal.length > 0) {
                return res.json({ success: true, data:resultadoDireccionesFinal });
            } else {
                return res.json({ success: false, data:[], msg:'No existen direcciones' });
            }

        } catch (error) {
            return res.sendStatus(400);
        }

    }else{
        return res.sendStatus(400);
    }
}

export async function ClienteNuevaDireccion(req: Request, res: Response): Promise<Response> {
    if (req.body.DataDireccion != undefined) {

        let idCliente = req.body.DataDireccion.IdCliente;
        let direccion = req.body.DataDireccion.Direccion;
        let referencia = req.body.DataDireccion.Referencia;
        let latitud = req.body.DataDireccion.Latitud;
        let longitud = req.body.DataDireccion.Longitud;
        let distrito = req.body.DataDireccion.Distrito;
        let provincia = req.body.DataDireccion.Provincia;
        let departamento = req.body.DataDireccion.Departamento;
        
        const hoy = moment().tz("America/Lima");
        moment.locale('es');
        const hoyformateado = hoy.format('YYYY-MM-DD');
        try {
            let conn = await database.conexionObtener();
                await conn.query("INSERT INTO Gen_DireccionUsuario (IdCliente, Direccion, Referencia, FechaReg, Latitud, Longitud, Distrito, Provincia, Departamento) "+
                " VALUES ("+idCliente+",'"+direccion+"','"+referencia+"','"+hoyformateado+"','"+latitud+"','"+longitud+"','"+distrito+"','"+provincia+"','"+departamento+"')");
                return res.json({ success: true, msg: "Dirección Agregada" });

        } catch (error) {
            return res.sendStatus(400);
        }

    } else {
        return res.sendStatus(400);
    }
}

export async function ClienteEliminarDireccion(req: Request, res: Response): Promise<Response> {
    if (req.body.IdDireccionUsuario != undefined) {

        let idDireccionUsuario = req.body.IdDireccionUsuario;
        try {
            let conn = await database.conexionObtener();
                await conn.query("DELETE FROM Gen_DireccionUsuario WHERE IdDireccionUsuario = "+idDireccionUsuario);
                return res.json({ success: true, msg: "Dirección Eliminada" });

        } catch (error) {
            return res.sendStatus(400);
        }

    } else {
        return res.sendStatus(400);
    }
}

export async function ClienteEditarDireccion(req: Request, res: Response): Promise<Response> {

    if (req.body.IdDireccionUsuario != undefined) {

        let idDireccionUsuario = req.body.IdDireccionUsuario;
        try {
            let conn = await database.conexionObtener();
                await conn.query("UPDATE Gen_DireccionUsuario WHERE IdDireccionUsuario = "+idDireccionUsuario);
                return res.json({ success: true, msg: "Dirección Eliminada" });

        } catch (error) {
            return res.sendStatus(400);
        }

    } else {
        return res.sendStatus(400);
    }
}

export async function ClientePedidoHistorial(req: Request, res: Response): Promise<Response> {
    if(req.query.IdCliente != undefined){
    let idCliente = req.query.IdCliente;
        try {
            let conn = await database.conexionObtener();
            let resultadoPedidos = await conn.query("SELECT DATE_FORMAT(Gen_Pedido.FechaReg, '%Y-%m-%d %H:%i:%s') AS FechaReg,Gen_Pedido.Estado,Gen_Pedido.Direccion,Gen_Empresa.RazonSocial, ROUND((Gen_Pedido.PrecioDelivery + Gen_Pedido.PrecioProductos),2) AS TotalPago FROM Gen_Pedido"+
            " INNER JOIN Gen_Empresa ON Gen_Pedido.IdEmpresa = Gen_Empresa.IdEmpresa WHERE Gen_Pedido.IdCliente = "+idCliente);
            let resultadoPedidosFinal = JSON.parse(JSON.stringify(resultadoPedidos[0]));

            if (resultadoPedidosFinal.length > 0) {
                return res.json({ success: true, data:resultadoPedidosFinal });
            } else {
                return res.json({ success: false, data:[], msg:'No existen pedidos realizados' });
            }

        } catch (error) {
            return res.sendStatus(400);
        }

    }else{
        return res.sendStatus(400);
    }
}

export async function ClienteNotificaciones(req: Request, res: Response): Promise<Response> {
    if (req.query.IdCliente != undefined) {
        let idCliente = req.query.IdCliente;
            try {
                let conn = await database.conexionObtener();
                let notificaciones = await conn.query("SELECT Gen_Notificacion.IdNotificacion, Gen_OpcNotificacion.UrlImagen, Gen_Notificacion.Mensaje, Gen_Notificacion.Leido, DATE_FORMAT(Gen_Notificacion.FechaReg, '%Y-%m-%d %H:%i:%s') AS FechaReg  FROM Gen_Notificacion "+
                " INNER JOIN Gen_OpcNotificacion ON Gen_Notificacion.IdOpcNotificacion = Gen_OpcNotificacion.IdOpcNotificacion WHERE "+ 
                " Gen_Notificacion.IdCliente = "+idCliente+" ORDER BY Gen_Notificacion.FechaReg DESC, Gen_Notificacion.IdNotificacion DESC");
                let notificacionesFinales = JSON.parse(JSON.stringify(notificaciones[0]));

                if (notificacionesFinales.length > 0) {
                    return res.json({ success: true, data:notificacionesFinales });
                } else {
                    return res.json({ success: false, data:[], msg:'Sin Notificaciones' });
                }

            } catch (error) {
                return res.sendStatus(400);
            }

    } else {
        return res.sendStatus(400);
    }
}

export async function ClienteNumeroNotificaciones(req: Request, res: Response): Promise<Response> {
    if (req.query.IdCliente != undefined) {
        let idCliente = req.query.IdCliente;
            try {
                let conn = await database.conexionObtener();
                let queryInfo = await conn.query("SELECT Anulado, OtpValidado FROM Gen_Cliente WHERE IdCliente = "+idCliente);
                let queryInfoFinales = JSON.parse(JSON.stringify(queryInfo[0]));

                let notificaciones = await conn.query("SELECT COUNT(*) AS NumNotificaciones, Gen_Cliente.Anulado,Gen_Cliente.OtpValidado,Gen_Cliente.IdCliente  FROM Gen_Notificacion " +
                 " LEFT JOIN Gen_Cliente ON Gen_Notificacion.IdCliente = Gen_Cliente.IdCliente WHERE Gen_Notificacion.IdCliente = "+idCliente+"  AND Gen_Notificacion.Leido = 0");
                let notificacionesFinales = JSON.parse(JSON.stringify(notificaciones[0]));

                if (notificacionesFinales.length > 0) {
                    return res.json({ success: true, data: notificacionesFinales[0].NumNotificaciones, anulado:queryInfoFinales[0].Anulado , otpvalidado:queryInfoFinales[0].OtpValidado });
                } else {
                    return res.json({ success: false, data: 0, anulado:queryInfoFinales[0].Anulado, otpvalidado:queryInfoFinales[0].OtpValidado});
                }
                
            } catch (error) {
                return res.sendStatus(400);
            }

    } else {
        return res.sendStatus(400);
    }
}

export async function ClienteNotificacionesActualizar(req: Request, res: Response): Promise<Response> {
    if (req.body.IdCliente != undefined) {
        let idCliente = req.body.IdCliente;

        try {
            const conn = await database.conexionObtener();
            const resultado = await conn.query("UPDATE Gen_Notificacion SET Leido = 1 WHERE IdCliente ="+idCliente);
            return res.json({ success: true });

        } catch (error) {
            return res.sendStatus(400);
        }

    } else {
        return res.sendStatus(400);
    }
}

export async function ClienteNotificacionesEliminar(req: Request, res: Response): Promise<Response> {
    if (req.body.IdNotificacion != undefined) {
        let idNotificacion = req.body.IdNotificacion;

        try {
            const conn = await database.conexionObtener();
            const resultado = await conn.query("DELETE FROM Gen_Notificacion WHERE IdNotificacion = "+idNotificacion);
            return res.json({ success: true });

        } catch (error) {
            return res.sendStatus(400);
        }

    } else {
        return res.sendStatus(400);
    }
}

export async function ClienteValidarOtp(req: Request, res: Response): Promise<Response> {

    if (req.body.IdCliente != undefined && req.body.CodigoOtp != undefined) {
        let idCliente = req.body.IdCliente;
        let codigo = req.body.CodigoOtp
        try {
            let conn = await database.conexionObtener();
            let resultado = await conn.query("SELECT *, DATE_FORMAT(Gen_Cliente.FechaRegOtp, '%Y-%m-%d %H:%i:%s') AS FechaRegOtpFormat FROM Gen_Cliente WHERE IdCliente = '" + idCliente + "'");
            let resultadofinal = JSON.parse(JSON.stringify(resultado[0]));
            if(resultadofinal[0].OtpCodigo == codigo){
                await conn.query("UPDATE Gen_Cliente SET OtpValidado = 1 WHERE IdCliente = "+idCliente);
                return res.json({ success: true, msg: "Celular Validado!", data:resultadofinal[0] });
            }else{
                return res.json({ success: false, msg: "¡El Código es incorrecto!" });
            }

        } catch (error) {
            return res.sendStatus(400);
        }

    } else {
        return res.sendStatus(400);
    }
}

export async function ClienteNuevoOtp(req: Request, res: Response): Promise<Response> {

    if (req.body.IdCliente != undefined) {
        let idCliente = req.body.IdCliente;
        let hashSMS = req.body.hashSMS
        try {
            const hoy = moment().tz("America/Lima");
            moment.locale('es');
            const hoyformateado = hoy.format('YYYY-MM-DD HH:mm:ss');
            let conn = await database.conexionObtener();
            let resultado = await conn.query("SELECT * FROM Gen_Cliente WHERE IdCliente = '" + idCliente + "' AND OtpValidado=0");
            let resultadofinal = JSON.parse(JSON.stringify(resultado[0]));
            if(resultadofinal.length > 0){
                let otp = ''+ Math.floor(100000 + Math.random() * 900000);
                await conn.query("UPDATE Gen_Cliente SET FechaRegOtp = '"+hoyformateado+"', OtpCodigo='"+otp.substring(0,4)+"' WHERE IdCliente = "+idCliente);
                //Enivar nuevamento OTP
                try {
                    let respuestaEnvio = await EnviarOtp('+51'+resultadofinal[0].Telefono,'Su código de verificación es: '+otp.substring(0,4),hashSMS)
                    //setTimeout(async () => {
                       // let respuestaEnvio = await EnviarWhatsAppOtp('51'+resultadofinal[0].Telefono,'Su código de verificación es: *'+otp.substring(0,4)+'*     Atte.: Team http://pedi2.pe/')
                    //}, 1000);
                } catch (error) {
                    
                }

                return res.json({ success: true, msg: "Nuevo Otp generado!", fechaOtp:hoyformateado ,CodigoOtp:otp.substring(0,4) });
            }else{
                return res.json({ success: false, msg: "¡El celular ya ha sido validado, porfavor inicie sesión!" });
            }

        } catch (error) {
            return res.sendStatus(400);
        }

    } else {
        return res.sendStatus(400);
    }
}

export async function ClienteBuscarDni(req: Request, res: Response): Promise<Response> {
    if (req.body.Code == 'xgr3d2drg432' && req.body.Dni != undefined) {
        let dni = req.body.Dni;
        try {
        const path = "https://dniruc.apisperu.com/api/v1/dni/"+dni+"?token="+token_apis_peru;
           let respuesta = await axios.get(path);
           if(respuesta.data.success == false){
            return res.json({ success:false , message: "No se encontraron resultadoss." });
           }else{
            return res.json({ success:true , data:respuesta.data , message: "Dni encontrado"});
           }
        } catch (error) {
            return res.json({ success:false ,message: "No se encontraron resultadoss." });
        }
    } else {
        return res.sendStatus(400);
    }
}

export async function ProductosBusqueda(req: Request, res: Response): Promise<Response> {
    if(req.query.Busqueda != undefined && req.query.IdEmpresa != undefined  ){
        let idEmpresa = req.query.IdEmpresa;
        let busqueda = req.query.Busqueda || '';
        try {
            let serve = req.headers.host;
            let protocolo = "https://";
            let servidor = protocolo + serve;
            let rutaAlmacenamiento = "/img/productos/";
            let rutaFinal = servidor + rutaAlmacenamiento;
            let conn = await database.conexionObtener();
            let resultadoProductos = await conn.query("SELECT Gen_Producto.IdProducto,Gen_Producto.IdProductoCategoria,Gen_Producto.Producto,Gen_Producto.ProductoDesc,Gen_Producto.PrecioContado,CONCAT('"+rutaFinal+"',Gen_Producto.Imagen) AS Imagen,Gen_ProductoCategoria.ProductoCategoria"+
            " FROM Gen_Producto INNER JOIN Gen_ProductoCategoria ON  Gen_Producto.IdProductoCategoria = Gen_ProductoCategoria.IdProductoCategoria "+
            " WHERE Gen_ProductoCategoria.IdEmpresa = "+idEmpresa+"  AND Gen_Producto.PrecioContado > 0 AND Gen_ProductoCategoria.MostrarDelivery=1 AND Gen_Producto.Anulado=0 AND Gen_ProductoCategoria.Anulado=0 AND Gen_Producto.Producto LIKE '%"+busqueda+"%'");
            let resultadoProductosFinal = JSON.parse(JSON.stringify(resultadoProductos[0]));

            if (resultadoProductosFinal.length > 0) {
                
                return res.json(resultadoProductosFinal);

            } else {

                return res.json([]);

            }

        } catch (error) {
            return res.sendStatus(400);
        }

    }else{
        return res.json({ success: false, msg:'No se proporcionaron datos de acceso', data:{} });
    }
}