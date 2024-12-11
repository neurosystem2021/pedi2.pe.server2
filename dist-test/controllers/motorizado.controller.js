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
exports.LoginMotorizado = LoginMotorizado;
exports.EmpresasMotorizado = EmpresasMotorizado;
exports.MotorizadoGrupo = MotorizadoGrupo;
exports.InfoMotorizado = InfoMotorizado;
const database_1 = __importDefault(require("../classes/database"));
const database = database_1.default.instance;
function LoginMotorizado(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.query.Dni != undefined && req.query.Password != undefined) {
            let dni = req.query.Dni;
            let password = req.query.Password;
            try {
                let conn = yield database.conexionObtener();
                let resultado = yield conn.query("SELECT Gm.IdMotorizado, Gm.Nombres, Gm.Apellidos, Gm.Dni, Gm.Telefono, Gm.Password, Gm.Email, Gm.Direccion," +
                    " Gm.VehiculoPlaca, Gm.VehiculoColor, Gm.FechaReg, Gm.FechaMod, Gm.Anulado FROM Gen_Motorizado Gm WHERE Gm.Dni='" + dni + "' AND Gm.Password='" + password + "'");
                let resultadoFinal = JSON.parse(JSON.stringify(resultado[0]));
                if (resultadoFinal.length > 0) {
                    let motorizadoInfo = resultadoFinal[0];
                    if (motorizadoInfo.Anulado == 0) {
                        return res.json({ success: true, msg: 'Bienvenido motorizado.', data: motorizadoInfo, anulado: motorizadoInfo.Anulado });
                    }
                    else {
                        return res.json({ success: false, msg: 'Se ha bloqueado el acceso para este usuario .', data: {}, anulado: motorizadoInfo.Anulado });
                    }
                }
                else {
                    return res.json({ success: false, msg: 'Motorizado no encontrado, verifique sus datos.', data: {}, anulado: null });
                }
            }
            catch (error) {
                return res.sendStatus(400);
            }
        }
        else {
            return res.json({ success: false, msg: 'No se proporcionaron datos de acceso', data: {} });
        }
    });
}
function EmpresasMotorizado(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.query.IdMotorizado != undefined) {
            let idMotorizado = req.query.IdMotorizado;
            let serve = req.headers.host;
            let protocolo = req.protocol + "://";
            let servidor = protocolo + serve;
            let rutaAlmacenamiento = "/img/empresas/";
            let rutaFinal = servidor + rutaAlmacenamiento;
            try {
                let conn = yield database.conexionObtener();
                let queryMotorizado = yield conn.query("SELECT Gen_Motorizado.IdMotorizado,Gen_Motorizado.Nombres,Gen_Motorizado.Apellidos,Gen_Motorizado.Anulado AS MotorizadoAnulado,Gen_Motorizado.IdGrupoMotorizado, " +
                    " Gen_GrupoMotorizado.NombreGrupo, IFNULL(Gen_GrupoMotorizado.IdRegion,0) AS IdRegion FROM Gen_Motorizado LEFT JOIN Gen_GrupoMotorizado ON Gen_Motorizado.IdGrupoMotorizado = Gen_GrupoMotorizado.IdGrupoMotorizado " +
                    " WHERE Gen_Motorizado.IdMotorizado =" + idMotorizado);
                let queryMotorizadoFinal = JSON.parse(JSON.stringify(queryMotorizado[0]));
                let queryEmpresas = yield conn.query("SELECT Gen_Empresa.*,CONCAT('" + rutaFinal + "',Gen_Empresa.ImagenUrl) AS ImagenUrlCom, Gen_EmpresaCategoria.EmpresaCategoria FROM Empresa_Has_Motorizado " +
                    " INNER JOIN Gen_Empresa ON Empresa_Has_Motorizado.IdEmpresa = Gen_Empresa.IdEmpresa " +
                    " INNER JOIN Gen_Motorizado ON Empresa_Has_Motorizado.IdMotorizado = Gen_Motorizado.IdMotorizado " +
                    " INNER JOIN Gen_EmpresaCategoria ON Gen_Empresa.IdEmpresaCategoria = Gen_EmpresaCategoria.IdEmpresaCategoria " +
                    " WHERE Empresa_Has_Motorizado.IdMotorizado=" + idMotorizado + " AND Gen_Empresa.Anulado=0");
                let resultadoEmpresas = JSON.parse(JSON.stringify(queryEmpresas[0]));
                if (queryMotorizadoFinal.length > 0) {
                    return res.json({ success: true, msg: 'Empresas obtenidas', info: queryMotorizadoFinal[0], data: resultadoEmpresas, totalEmpresas: resultadoEmpresas.length });
                }
                else {
                    return res.json({ success: false, msg: 'El motorizado no existe' });
                }
            }
            catch (error) {
                return res.sendStatus(400);
            }
        }
        else {
            return res.json({ success: false, msg: 'No se proporciono datos del motorizado', data: [] });
        }
    });
}
function MotorizadoGrupo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.query.IdMotorizado != undefined) {
            let idMotorizado = req.query.IdMotorizado;
            try {
                let conn = yield database.conexionObtener();
                let queryMotorizado = yield conn.query("SELECT Gen_Motorizado.IdGrupoMotorizado, Gen_GrupoMotorizado.NombreGrupo, IFNULL(Gen_GrupoMotorizado.IdRegion,0) AS IdRegion " +
                    " FROM Gen_Motorizado INNER JOIN Gen_GrupoMotorizado ON Gen_Motorizado.IdGrupoMotorizado = Gen_GrupoMotorizado.IdGrupoMotorizado " +
                    " WHERE Gen_Motorizado.IdMotorizado =" + idMotorizado);
                let queryMotorizadoFinal = JSON.parse(JSON.stringify(queryMotorizado[0]));
                return res.json({ success: true, idRegion: (queryMotorizadoFinal.length > 0 ? queryMotorizadoFinal[0].IdRegion : 0) });
            }
            catch (error) {
                return res.sendStatus(400);
            }
        }
        else {
            return res.json({ success: false, msg: 'No se proporciono datos del motorizado', data: [] });
        }
    });
}
function InfoMotorizado(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.query.IdMotorizado != undefined) {
            let idMotorizado = req.query.IdMotorizado;
            try {
                let conn = yield database.conexionObtener();
                let queryMotorizado = yield conn.query("SELECT IdMotorizado,Nombres,Apellidos,Dni,Telefono,Vehiculo, VehiculoPlaca, VehiculoColor  FROM Gen_Motorizado  WHERE Anulado = 0 AND IdMotorizado=" + idMotorizado + " LIMIT 1");
                let resultadoMotorizado = JSON.parse(JSON.stringify(queryMotorizado[0]));
                if (resultadoMotorizado.length > 0) {
                    return res.json({ success: true, msg: 'Motorizado Obtenido', data: resultadoMotorizado[0] });
                }
                else {
                    return res.json({ success: false, msg: 'No existe motorizado', data: [] });
                }
            }
            catch (error) {
                return res.sendStatus(400);
            }
        }
        else {
            return res.json({ success: false, msg: 'No se proporciono datos del motorizado', data: [] });
        }
    });
}
