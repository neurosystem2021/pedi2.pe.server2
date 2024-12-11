"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnviarNotificacionCliente = EnviarNotificacionCliente;
exports.EnviarNotificacionMotorizado = EnviarNotificacionMotorizado;
exports.EnviarNotificacionTopicoAnuncio = EnviarNotificacionTopicoAnuncio;
exports.EnviarNotificacionTopicoAnuncioTodos = EnviarNotificacionTopicoAnuncioTodos;
exports.EnviarNotificacionTopicoPromo = EnviarNotificacionTopicoPromo;
const database_1 = __importDefault(require("../classes/database"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const database = database_1.default.instance;
const fcm_1 = require("../classes/fcm");
function EnviarNotificacionCliente(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.query.IdCliente != undefined && req.query.Titulo != undefined && req.query.Msg != undefined) {
            let idCliente = req.query.IdCliente;
            let titulo = req.query.Titulo;
            let msg = req.query.Msg;
            try {
                let conn = yield database.conexionObtener();
                let notificaciones = yield conn.query("SELECT TokenFcm FROM Gen_Cliente WHERE IdCliente = " + idCliente);
                let notificacionesFinales = JSON.parse(JSON.stringify(notificaciones[0]));
                if (notificacionesFinales.length > 0) {
                    if (notificacionesFinales[0].TokenFcm != null && notificacionesFinales[0].TokenFcm != '') {
                        try {
                            let respuesta = yield (0, fcm_1.NotificacionCliente)(notificacionesFinales[0].TokenFcm, titulo + '', msg + '');
                            return res.sendStatus(200);
                        }
                        catch (error) {
                            return res.sendStatus(400);
                        }
                    }
                    else {
                        return res.json({ msg: "El usuario no tiene token" });
                    }
                }
                else {
                    return res.sendStatus(400);
                }
            }
            catch (error) {
                console.log(error);
                return res.sendStatus(400);
            }
        }
        else {
            return res.sendStatus(400);
        }
    });
}
function EnviarNotificacionMotorizado(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.query.IdMotorizado != undefined && req.query.Titulo != undefined && req.query.Msg != undefined) {
            let idMotorizado = req.query.IdMotorizado;
            let titulo = req.query.Titulo;
            let msg = req.query.Msg;
            try {
                let conn = yield database.conexionObtener();
                let notificaciones = yield conn.query("SELECT TokenFcm FROM Gen_Motorizado WHERE IdMotorizado = " + idMotorizado);
                let notificacionesFinales = JSON.parse(JSON.stringify(notificaciones[0]));
                if (notificacionesFinales.length > 0) {
                    if (notificacionesFinales[0].TokenFcm != null && notificacionesFinales[0].TokenFcm != '') {
                        try {
                            let respuesta = yield (0, fcm_1.NotificacionMotorizado)(notificacionesFinales[0].TokenFcm, titulo + '', msg + '');
                            return res.sendStatus(200);
                        }
                        catch (error) {
                            return res.sendStatus(400);
                        }
                    }
                    else {
                        return res.json({ msg: "El usuario no tiene token" });
                    }
                }
                else {
                    return res.sendStatus(400);
                }
            }
            catch (error) {
                console.log(error);
                return res.sendStatus(400);
            }
        }
        else {
            return res.sendStatus(400);
        }
    });
}
function EnviarNotificacionTopicoAnuncio(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.body.Topic != undefined && req.body.Titulo != undefined && req.body.Msg != undefined) {
            let topic = req.body.Topic;
            let titulo = req.body.Titulo;
            let msg = req.body.Msg;
            let idUsuario = req.body.IdUsuario;
            try {
                try {
                    //let respuesta = await NotificacionTopico(topic+'',titulo+'',msg+'')
                }
                catch (error) {
                    return res.sendStatus(400);
                }
                const hoy = (0, moment_timezone_1.default)().tz("America/Lima");
                moment_timezone_1.default.locale('es');
                const hoyformateado = hoy.format('YYYY-MM-DD HH:mm:ss');
                let conn = yield database.conexionObtener();
                let insertar = yield conn.query("INSERT INTO Gen_NotificacionFcm(TipoFcm,Topico,Titulo,Msg,FechaEmision,IdUsuarioReg)" +
                    "VALUES ('ANUNCIO','" + topic + "','" + titulo + "','" + msg + "','" + hoyformateado + "'," + idUsuario + ")");
                return res.json({ success: true });
            }
            catch (error) {
                console.log(error);
                return res.sendStatus(400);
            }
        }
        else {
            return res.sendStatus(400);
        }
    });
}
function EnviarNotificacionTopicoAnuncioTodos(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.body.Titulo != undefined && req.body.Msg != undefined) {
            let titulo = req.body.Titulo;
            let msg = req.body.Msg;
            let idUsuario = req.body.IdUsuario;
            try {
                try {
                    //let respuesta = await NotificacionTopicoTodos(titulo+'',msg+'')
                }
                catch (error) {
                    return res.sendStatus(400);
                }
                const hoy = (0, moment_timezone_1.default)().tz("America/Lima");
                moment_timezone_1.default.locale('es');
                const hoyformateado = hoy.format('YYYY-MM-DD HH:mm:ss');
                let conn = yield database.conexionObtener();
                let insertar = yield conn.query("INSERT INTO Gen_NotificacionFcm(TipoFcm,Topico,Titulo,Msg,FechaEmision,IdUsuarioReg)" +
                    "VALUES ('GLOBAL','TODOS','" + titulo + "','" + msg + "','" + hoyformateado + "'," + idUsuario + ")");
                return res.json({ success: true });
            }
            catch (error) {
                console.log(error);
                return res.sendStatus(400);
            }
        }
        else {
            return res.sendStatus(400);
        }
    });
}
function EnviarNotificacionTopicoPromo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.body.IdEmpresa != undefined && req.body.Topic != undefined && req.body.Titulo != undefined && req.body.Msg != undefined) {
            let idEmpresa = req.body.IdEmpresa;
            let topic = req.body.Topic;
            let titulo = req.body.Titulo;
            let msg = req.body.Msg;
            let idUsuario = req.body.IdUsuario;
            try {
                let conn = yield database.conexionObtener();
                let notificaciones = yield conn.query("SELECT Gen_EmpresaCategoria.EmpresaCategoria,Gen_Empresa.* FROM Gen_Empresa" +
                    " INNER JOIN Gen_EmpresaCategoria ON Gen_Empresa.IdEmpresaCategoria =  Gen_EmpresaCategoria.IdEmpresaCategoria" +
                    " WHERE Gen_Empresa.IdEmpresa=" + idEmpresa);
                let notificacionesFinales = JSON.parse(JSON.stringify(notificaciones[0]));
                if (notificacionesFinales.length > 0) {
                    delete notificacionesFinales[0].Token;
                    delete notificacionesFinales[0].FechaMod;
                    delete notificacionesFinales[0].UsuarioReg;
                    delete notificacionesFinales[0].FechaReg;
                    delete notificacionesFinales[0].Observacion;
                    delete notificacionesFinales[0].Descripcion;
                    try {
                        //let respuesta = await NotificacionTopicoPromo(topic+'',titulo+'',msg+'',notificacionesFinales[0])
                    }
                    catch (error) {
                        return res.sendStatus(400);
                    }
                    const hoy = (0, moment_timezone_1.default)().tz("America/Lima");
                    moment_timezone_1.default.locale('es');
                    const hoyformateado = hoy.format('YYYY-MM-DD HH:mm:ss');
                    let conn = yield database.conexionObtener();
                    let insertar = yield conn.query("INSERT INTO Gen_NotificacionFcm(TipoFcm,Topico,IdEmpresa,Titulo,Msg,FechaEmision,IdUsuarioReg)" +
                        "VALUES ('PROMOCION','" + topic + "'," + idEmpresa + ",'" + titulo + "','" + msg + "','" + hoyformateado + "'," + idUsuario + ")");
                    return res.json({ success: true });
                }
                else {
                    return res.sendStatus(400);
                }
            }
            catch (error) {
                console.log(error);
                return res.sendStatus(400);
            }
        }
        else {
            return res.sendStatus(400);
        }
    });
}
