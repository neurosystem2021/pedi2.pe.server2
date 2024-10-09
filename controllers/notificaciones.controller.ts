import { Request, response, Response } from 'express';
import Database from "../classes/database";
import moment from 'moment-timezone';
const database = Database.instance;
import { NotificacionCliente, NotificacionMotorizado, NotificacionTopico, NotificacionTopicoPromo, NotificacionTopicoTodos } from '../classes/fcm';

export async function EnviarNotificacionCliente(req: Request, res: Response): Promise<Response> {
    if (req.query.IdCliente != undefined && req.query.Titulo != undefined && req.query.Msg != undefined) {
        let idCliente = req.query.IdCliente;
        let titulo = req.query.Titulo;
        let msg = req.query.Msg;
            try {
                let conn = await database.conexionObtener();
                let notificaciones = await conn.query("SELECT TokenFcm FROM Gen_Cliente WHERE IdCliente = "+idCliente);
                let notificacionesFinales = JSON.parse(JSON.stringify(notificaciones[0]));

                if (notificacionesFinales.length > 0) {
                    if(notificacionesFinales[0].TokenFcm != null && notificacionesFinales[0].TokenFcm!='' ){
                        try {
                            let respuesta = await NotificacionCliente(notificacionesFinales[0].TokenFcm,titulo+'',msg+'')
                            return res.sendStatus(200);
                        } catch (error) {
                            return res.sendStatus(400);
                        }
                    }else{
                        return res.json({msg:"El usuario no tiene token"});
                    }

                    

                } else {
                    return res.sendStatus(400);
                }
                
            } catch (error) {
                console.log(error);
                return res.sendStatus(400);
            }

    } else {
        return res.sendStatus(400);
    }
}

export async function EnviarNotificacionMotorizado(req: Request, res: Response): Promise<Response> {
    if (req.query.IdMotorizado != undefined && req.query.Titulo != undefined && req.query.Msg != undefined) {
        let idMotorizado = req.query.IdMotorizado;
        let titulo = req.query.Titulo;
        let msg = req.query.Msg;
            try {
                let conn = await database.conexionObtener();
                let notificaciones = await conn.query("SELECT TokenFcm FROM Gen_Motorizado WHERE IdMotorizado = "+idMotorizado);
                let notificacionesFinales = JSON.parse(JSON.stringify(notificaciones[0]));

                if (notificacionesFinales.length > 0) {
                    if(notificacionesFinales[0].TokenFcm != null && notificacionesFinales[0].TokenFcm != '' ){
                        try {
                            let respuesta = await NotificacionMotorizado(notificacionesFinales[0].TokenFcm,titulo+'',msg+'')
                            return res.sendStatus(200);
                        } catch (error) {
                            return res.sendStatus(400);
                        }
                    }else{
                        return res.json({msg:"El usuario no tiene token"});
                    }

                    

                } else {
                    return res.sendStatus(400);
                }
                
            } catch (error) {
                console.log(error);
                return res.sendStatus(400);
            }

    } else {
        return res.sendStatus(400);
    }
}

export async function EnviarNotificacionTopicoAnuncio(req: Request, res: Response): Promise<Response> {
    if (req.body.Topic != undefined && req.body.Titulo != undefined && req.body.Msg != undefined ) {
        let topic = req.body.Topic;
        let titulo = req.body.Titulo;
        let msg = req.body.Msg;
        let idUsuario = req.body.IdUsuario
            try {               
                try {
                    //let respuesta = await NotificacionTopico(topic+'',titulo+'',msg+'')
                } catch (error) {
                    return res.sendStatus(400);
                }
                const hoy = moment().tz("America/Lima");
                moment.locale('es');
                const hoyformateado = hoy.format('YYYY-MM-DD HH:mm:ss');
                let conn = await database.conexionObtener();
                let insertar = await conn.query("INSERT INTO Gen_NotificacionFcm(TipoFcm,Topico,Titulo,Msg,FechaEmision,IdUsuarioReg)"+
                "VALUES ('ANUNCIO','"+topic+"','"+titulo+"','"+msg+"','"+hoyformateado+"',"+idUsuario+")");
                return res.json({ success: true });
            } catch (error) {
                console.log(error);
                return res.sendStatus(400);
            }

    } else {
        return res.sendStatus(400);
    }
}

export async function EnviarNotificacionTopicoAnuncioTodos(req: Request, res: Response): Promise<Response> {
    if ( req.body.Titulo != undefined && req.body.Msg != undefined ) {
        let titulo = req.body.Titulo;
        let msg = req.body.Msg;
        let idUsuario = req.body.IdUsuario
            try {               
                try {
                    //let respuesta = await NotificacionTopicoTodos(titulo+'',msg+'')
                } catch (error) {
                    return res.sendStatus(400);
                }
                const hoy = moment().tz("America/Lima");
                moment.locale('es');
                const hoyformateado = hoy.format('YYYY-MM-DD HH:mm:ss');
                let conn = await database.conexionObtener();
                let insertar = await conn.query("INSERT INTO Gen_NotificacionFcm(TipoFcm,Topico,Titulo,Msg,FechaEmision,IdUsuarioReg)"+
                "VALUES ('GLOBAL','TODOS','"+titulo+"','"+msg+"','"+hoyformateado+"',"+idUsuario+")");
                return res.json({ success: true });
            } catch (error) {
                console.log(error);
                return res.sendStatus(400);
            }

    } else {
        return res.sendStatus(400);
    }
}

export async function EnviarNotificacionTopicoPromo(req: Request, res: Response): Promise<Response> {
    if (req.body.IdEmpresa != undefined && req.body.Topic != undefined && req.body.Titulo != undefined && req.body.Msg != undefined ) {
        let idEmpresa = req.body.IdEmpresa;
        let topic = req.body.Topic;
        let titulo = req.body.Titulo;
        let msg = req.body.Msg;
        let idUsuario = req.body.IdUsuario
            try {
                let conn = await database.conexionObtener();
                let notificaciones = await conn.query("SELECT Gen_EmpresaCategoria.EmpresaCategoria,Gen_Empresa.* FROM Gen_Empresa"+
                " INNER JOIN Gen_EmpresaCategoria ON Gen_Empresa.IdEmpresaCategoria =  Gen_EmpresaCategoria.IdEmpresaCategoria"+
                " WHERE Gen_Empresa.IdEmpresa="+idEmpresa);
                let notificacionesFinales = JSON.parse(JSON.stringify(notificaciones[0]));

                if (notificacionesFinales.length > 0) {
                    delete notificacionesFinales[0].Token;
                    delete notificacionesFinales[0].FechaMod
                    delete notificacionesFinales[0].UsuarioReg
                    delete notificacionesFinales[0].FechaReg
                    delete notificacionesFinales[0].Observacion
                    delete notificacionesFinales[0].Descripcion
                                    
                    try {
                        //let respuesta = await NotificacionTopicoPromo(topic+'',titulo+'',msg+'',notificacionesFinales[0])
                    } catch (error) {
                        return res.sendStatus(400);
                    }

                    const hoy = moment().tz("America/Lima");
                    moment.locale('es');
                    const hoyformateado = hoy.format('YYYY-MM-DD HH:mm:ss');
                    let conn = await database.conexionObtener();
                    let insertar = await conn.query("INSERT INTO Gen_NotificacionFcm(TipoFcm,Topico,IdEmpresa,Titulo,Msg,FechaEmision,IdUsuarioReg)"+
                    "VALUES ('PROMOCION','"+topic+"',"+idEmpresa+",'"+titulo+"','"+msg+"','"+hoyformateado+"',"+idUsuario+")");
                    return res.json({ success: true });
                } else {
                    return res.sendStatus(400);
                }
                
            } catch (error) {
                console.log(error);
                return res.sendStatus(400);
            }

    } else {
        return res.sendStatus(400);
    }
}
