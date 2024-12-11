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
exports.LoginAdmin = LoginAdmin;
exports.EnivarMensaje = EnivarMensaje;
exports.Categorias = Categorias;
exports.SubCategorias = SubCategorias;
exports.Regiones = Regiones;
exports.Empresas = Empresas;
exports.EmpresasIds = EmpresasIds;
exports.EmpresaAnular = EmpresaAnular;
exports.Anuncios = Anuncios;
exports.AnuncioEditar = AnuncioEditar;
exports.AnuncioAnular = AnuncioAnular;
exports.AnuncioEliminar = AnuncioEliminar;
exports.AnuncioNuevo = AnuncioNuevo;
exports.AnuncioOrden = AnuncioOrden;
exports.Departamentos = Departamentos;
exports.Motorizados = Motorizados;
exports.MotorizadoEditar = MotorizadoEditar;
exports.MotorizadoAnular = MotorizadoAnular;
exports.MotorizadoNuevo = MotorizadoNuevo;
exports.MotorizadoEmpresas = MotorizadoEmpresas;
exports.MotorizadoGrupos = MotorizadoGrupos;
exports.MotorizadoGrupoEditar = MotorizadoGrupoEditar;
exports.MotorizadoGrupoNuevo = MotorizadoGrupoNuevo;
exports.MotorizadoRemoverEmpresa = MotorizadoRemoverEmpresa;
exports.MotorizadoAsignarEmpresa = MotorizadoAsignarEmpresa;
exports.EmpresaEditar = EmpresaEditar;
exports.EmpresaConfigurar = EmpresaConfigurar;
exports.EmpresaNueva = EmpresaNueva;
exports.Pedidos = Pedidos;
exports.PedidoProceso = PedidoProceso;
exports.PedidoAsignar = PedidoAsignar;
exports.PedidoCambiar = PedidoCambiar;
exports.MotorizadosServicio = MotorizadosServicio;
exports.ProductosEmpresa = ProductosEmpresa;
exports.ProductosCategoriasEmpresa = ProductosCategoriasEmpresa;
exports.ProductosCategoriaAgregar = ProductosCategoriaAgregar;
exports.ProductoNuevo = ProductoNuevo;
exports.ProductoEditar = ProductoEditar;
exports.ProductoAnular = ProductoAnular;
exports.ProductosCategoriaAnular = ProductosCategoriaAnular;
exports.ProductosCategoriaMostrar = ProductosCategoriaMostrar;
exports.ProductosCategoriaOrden = ProductosCategoriaOrden;
exports.NotificacionesFcm = NotificacionesFcm;
exports.EnviarNuevaNotificacion = EnviarNuevaNotificacion;
exports.PedidosTotal = PedidosTotal;
exports.ReportePedidos = ReportePedidos;
const database_1 = __importDefault(require("../classes/database"));
const database = database_1.default.instance;
const otp_1 = require("../classes/otp");
const jwt_utils_1 = __importDefault(require("../utils/jwt.utils"));
const path_1 = require("path");
const fs_1 = __importDefault(require("fs"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const fcm_1 = require("../classes/fcm");
function LoginAdmin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.body.Usuario != undefined && req.body.Password != undefined) {
            let usuarioBody = req.body.Usuario;
            let passwordBody = req.body.Password;
            try {
                const conn = yield database.conexionObtener();
                const cliente = yield conn.query("SELECT Seg_Usuario.*,Seg_UsuarioPerfil.UsuarioPerfil, Gen_Region.LatitudIni, Gen_Region.LongitudIni, Gen_Region.NombreRegion FROM Seg_Usuario " +
                    " LEFT JOIN Seg_UsuarioPerfil ON Seg_Usuario.IdUsuarioPerfil = Seg_UsuarioPerfil.IdUsuarioPerfil " +
                    " INNER JOIN Gen_Region ON Seg_Usuario.IdRegion = Gen_Region.IdRegion  WHERE Seg_Usuario.Usuario = '" + usuarioBody + "' LIMIT 1");
                let resultado = JSON.parse(JSON.stringify(cliente[0]));
                if (resultado.length > 0) {
                    let password = resultado[0].Password;
                    if (password == passwordBody) {
                        let token = yield (0, jwt_utils_1.default)(resultado[0].IdUsuario, resultado[0].NombreUsuario);
                        return res.json({ success: true, data: { IdUsuario: resultado[0].IdUsuario, NombreUsuario: resultado[0].NombreUsuario, Token: token,
                                UsuarioPerfil: resultado[0].UsuarioPerfil, IdUsuarioPerfil: resultado[0].IdUsuarioPerfil, IdRegion: resultado[0].IdRegion, LatitudIni: resultado[0].LatitudIni, LongitudIni: resultado[0].LongitudIni, NombreRegion: resultado[0].NombreRegion } });
                    }
                    else {
                        return res.json({ success: false, msg: 'La contraseña es incorrecta.' });
                    }
                }
                else {
                    return res.json({ success: false, msg: 'Usuario no encontrado, verique sus datos.' });
                }
            }
            catch (error) {
                return res.json({ success: error });
            }
        }
        else {
            return res.sendStatus(400);
        }
    });
}
function EnivarMensaje(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let respuestaEnviar = yield (0, otp_1.EnviarOtp)('+51958737428', 'Su código de verificación es: 3233', 'TAKXthTjhX8');
        return res.json(respuestaEnviar);
    });
}
function Categorias(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let conn = yield database.conexionObtener();
            let resultadoEmpresa = yield conn.query("SELECT IdEmpresaCategoria,EmpresaCategoria,ImagenUrl FROM Gen_EmpresaCategoria ORDER BY Orden ASC");
            let resultadoEmpresaFinal = JSON.parse(JSON.stringify(resultadoEmpresa[0]));
            if (resultadoEmpresaFinal.length > 0) {
                return res.json({ success: true, data: resultadoEmpresaFinal });
            }
            else {
                return res.json({ success: false, msg: 'No existe categrias' });
            }
        }
        catch (error) {
            return res.sendStatus(500);
        }
    });
}
function SubCategorias(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let conn = yield database.conexionObtener();
            let resultadoEmpresa = yield conn.query("SELECT IdEmpresaSubCategoria,SubCategoria,FechaReg,Anulado FROM Gen_EmpresaSubCategoria");
            let resultadoEmpresaFinal = JSON.parse(JSON.stringify(resultadoEmpresa[0]));
            if (resultadoEmpresaFinal.length > 0) {
                return res.json({ success: true, data: resultadoEmpresaFinal });
            }
            else {
                return res.json({ success: false, msg: 'No existe categrias' });
            }
        }
        catch (error) {
            return res.sendStatus(500);
        }
    });
}
function Regiones(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let conn = yield database.conexionObtener();
            let resultadoRegiones = yield conn.query("SELECT IdRegion, NombreRegion, LatitudIni, LongitudIni, FechaReg, UsuarioReg,Anulado FROM Gen_Region");
            let resultadoRegionesFinal = JSON.parse(JSON.stringify(resultadoRegiones[0]));
            if (resultadoRegionesFinal.length > 0) {
                return res.json({ success: true, data: resultadoRegionesFinal });
            }
            else {
                return res.json({ success: false, msg: 'No existe categrias' });
            }
        }
        catch (error) {
            return res.sendStatus(500);
        }
    });
}
function Empresas(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.query.IdCategoria != undefined && req.query.DepartamentoUbicacion != undefined) {
            let idCategoria = req.query.IdCategoria;
            let busqueda = req.query.Busqueda || '';
            let departamento = req.query.DepartamentoUbicacion;
            let serve = req.headers.host;
            let protocolo = req.protocol + "://";
            let servidor = protocolo + serve;
            let rutaAlmacenamiento = "/img/empresas/";
            let rutaFinal = servidor + rutaAlmacenamiento;
            try {
                let conn = yield database.conexionObtener();
                let resultadoEmpresa = yield conn.query("SELECT Gen_Empresa.*,CONCAT('" + rutaFinal + "',Gen_Empresa.ImagenUrl) AS ImagenUrl,Gen_EmpresaSubCategoria.SubCategoria,IFNULL(Gen_Empresa.IdRegion,0) AS IdRegion FROM Gen_Empresa " +
                    " INNER JOIN Gen_EmpresaSubCategoria ON Gen_Empresa.IdEmpresaSubCategoria=Gen_EmpresaSubCategoria.IdEmpresaSubCategoria " +
                    " WHERE " + (idCategoria == '0' ? '' : ' Gen_Empresa.IdEmpresaCategoria=' + idCategoria + ' AND ') + " Gen_Empresa.DepartamentoUbicacion LIKE '%" + departamento + "' " +
                    " AND Gen_Empresa.RazonSocial LIKE '%" + busqueda + "%' ORDER BY Gen_Empresa.IdEmpresa ASC ");
                let resultadoEmpresaFinal = JSON.parse(JSON.stringify(resultadoEmpresa[0]));
                if (resultadoEmpresaFinal.length > 0) {
                    return res.json({ success: true, data: resultadoEmpresaFinal });
                }
                else {
                    return res.json({ success: false, msg: 'No existe empresas' });
                }
            }
            catch (error) {
                return res.sendStatus(500);
            }
        }
        else {
            return res.json({ success: false, msg: 'No se proporcionaron datos de acceso', data: {} });
        }
    });
}
function EmpresasIds(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.query.Anulado != undefined && req.query.Ubicacion != undefined) {
            let anulado = '' + req.query.Anulado;
            let ubicacion = '' + req.query.Ubicacion;
            let serve = req.headers.host;
            let protocolo = req.protocol + "://";
            let servidor = protocolo + serve;
            let rutaAlmacenamiento = "/img/empresas/";
            let rutaFinal = servidor + rutaAlmacenamiento;
            try {
                let conn = yield database.conexionObtener();
                let resultadoEmpresa = yield conn.query("SELECT IdEmpresa,RazonSocial,DepartamentoUbicacion,TieneSistema, CONCAT('" + rutaFinal + "',ImagenUrl) AS ImagenUrl FROM Gen_Empresa WHERE DepartamentoUbicacion='" + ubicacion + "'" + (anulado == '1' ? " AND Anulado = 0" : "") + " ORDER BY RazonSocial ASC");
                let resultadoEmpresaFinal = JSON.parse(JSON.stringify(resultadoEmpresa[0]));
                if (resultadoEmpresaFinal.length > 0) {
                    return res.json({ success: true, data: resultadoEmpresaFinal });
                }
                else {
                    return res.json({ success: false, msg: 'No existe empresas' });
                }
            }
            catch (error) {
                return res.sendStatus(500);
            }
        }
        else {
            return res.json({ success: false, msg: 'No se proporcionaron datos de acceso', data: {} });
        }
    });
}
function EmpresaAnular(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.body.IdEmpresa != undefined && req.body.Accion != undefined) {
            let idEmpresa = req.body.IdEmpresa;
            let accion = req.body.Accion;
            try {
                const conn = yield database.conexionObtener();
                const empresa = yield conn.query("SELECT Anulado,RazonSocial FROM Gen_Empresa WHERE IdEmpresa = " + idEmpresa + " LIMIT 1");
                let resultado = JSON.parse(JSON.stringify(empresa[0]));
                if (resultado.length > 0) {
                    let anulado = resultado[0].Anulado;
                    if (anulado != accion) {
                        let resultado1 = yield conn.query("UPDATE Gen_Empresa SET  Anulado = " + accion + " WHERE IdEmpresa =" + idEmpresa);
                        return res.json({ success: true, msg: 'La empresa ' + (accion == 1 ? ' se inactivo correctamente.' : ' se activo correctamente.') });
                    }
                    else {
                        return res.json({ success: false, msg: 'Error, la empresa ya se actualizó anteriormente.' });
                    }
                }
                else {
                    return res.json({ success: false, msg: 'Empresa no encontrada, no actualizado.' });
                }
            }
            catch (error) {
                return res.sendStatus(400).json({
                    msg: 'Error de proceso',
                    error: error
                });
            }
        }
        else {
            return res.sendStatus(400).json({
                msg: 'No se proporciono parametros correctos'
            });
        }
    });
}
function Anuncios(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.query.Departamento != undefined) {
            let departamento = req.query.Departamento;
            let serve = req.headers.host;
            let protocolo = req.protocol + "://";
            let servidor = protocolo + serve;
            let rutaAlmacenamiento = "/img/anuncios/";
            let rutaFinal = servidor + rutaAlmacenamiento;
            try {
                let conn = yield database.conexionObtener();
                let resultadoEmpresa = yield conn.query("SELECT IdAnuncio,Empresa,Nombre,Descripcion,CONCAT('" + rutaFinal + "',ImagenUrl) AS ImagenUrl,Departamento,DATE_FORMAT(FechaInicio,'%d-%m-%Y') AS FechaInicio,DATE_FORMAT(FechaInicio,'%Y-%m-%d') AS FechaInicioF, DATE_FORMAT(FechaFin,'%d-%m-%Y') AS FechaFin,DATE_FORMAT(FechaFin,'%Y-%m-%d') AS FechaFinF,Orden,Anulado FROM Gen_Anuncio WHERE Departamento='" + departamento + "' ORDER BY Orden ASC ");
                let resultadoEmpresaFinal = JSON.parse(JSON.stringify(resultadoEmpresa[0]));
                if (resultadoEmpresaFinal.length > 0) {
                    return res.json({ success: true, data: resultadoEmpresaFinal });
                }
                else {
                    return res.json({ success: false, msg: 'No existe anuncios' });
                }
            }
            catch (error) {
                return res.sendStatus(400);
            }
        }
        else {
            return res.json({ success: false, msg: 'No se proporcionaron datos de acceso anuncios', data: {} });
        }
    });
}
function AnuncioEditar(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.body.IdAnuncio != undefined && req.body.Data != undefined) {
            let idAnuncio = req.body.IdAnuncio;
            let departamento = req.body.Data.Departamento;
            let descripcion = (req.body.Data.Descripcion != null && req.body.Data.Descripcion != '') ? req.body.Data.Descripcion : '';
            let fechaFin = req.body.Data.FechaFin;
            let fechaInicio = req.body.Data.FechaInicio;
            let imagen = req.body.Data.Imagen;
            let nombre = req.body.Data.Nombre;
            let archivoAnterior = '';
            try {
                let conn = yield database.conexionObtener();
                let resultadoAnuncio = yield conn.query("SELECT ImagenUrl FROM Gen_Anuncio WHERE IdAnuncio = " + idAnuncio);
                let resultadoAnuncioFinal = JSON.parse(JSON.stringify(resultadoAnuncio[0]));
                if (resultadoAnuncioFinal.length > 0) {
                    archivoAnterior = resultadoAnuncioFinal[0].ImagenUrl;
                }
                else {
                    archivoAnterior = '';
                }
                if (imagen == '') {
                    let insertar = yield conn.query("UPDATE Gen_Anuncio SET Empresa ='', Nombre = '" + nombre + "' ,Descripcion ='" + descripcion + "', Departamento = '" + departamento + "'," +
                        " FechaInicio = '" + fechaInicio + "' ,FechaFin = '" + fechaFin + "' WHERE IdAnuncio = " + idAnuncio);
                    return res.json({ success: true });
                }
                else {
                    const hoy = (0, moment_timezone_1.default)().tz("America/Lima");
                    const hoyformateado = hoy.format('X');
                    let base64Image = imagen.split(';base64,').pop();
                    let archivoNombre = hoyformateado + ".png";
                    fs_1.default.writeFile((0, path_1.join)(__dirname, '/../public/img/anuncios/') + archivoNombre, base64Image, { encoding: 'base64' }, function (err) {
                    });
                    let insertar = yield conn.query("UPDATE Gen_Anuncio SET Empresa ='', Nombre = '" + nombre + "' ,Descripcion ='" + descripcion + "', Departamento = '" + departamento + "'," +
                        " FechaInicio = '" + fechaInicio + "' ,FechaFin = '" + fechaFin + "' ,ImagenUrl='" + archivoNombre + "' WHERE IdAnuncio = " + idAnuncio);
                    if (archivoAnterior != '') {
                        fs_1.default.unlink((0, path_1.join)(__dirname, '/../public/img/anuncios/') + archivoAnterior, (err) => {
                        });
                    }
                    return res.json({ success: true });
                }
            }
            catch (error) {
                return res.sendStatus(400);
            }
        }
        else {
            return res.json({ success: false, msg: 'No se proporcionaron datos de acceso anuncios', data: {} });
        }
    });
}
function AnuncioAnular(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.body.IdAnuncio != undefined && req.body.Accion != undefined) {
            let idAnuncio = req.body.IdAnuncio;
            let accion = req.body.Accion;
            try {
                const conn = yield database.conexionObtener();
                const empresa = yield conn.query("SELECT Anulado,Nombre FROM Gen_Anuncio WHERE IdAnuncio = " + idAnuncio + " LIMIT 1");
                let resultado = JSON.parse(JSON.stringify(empresa[0]));
                if (resultado.length > 0) {
                    let anulado = resultado[0].Anulado;
                    if (anulado != accion) {
                        let resultado1 = yield conn.query("UPDATE Gen_Anuncio SET  Anulado = " + accion + " WHERE IdAnuncio =" + idAnuncio);
                        return res.json({ success: true, msg: 'El anuncio ' + (accion == 1 ? ' se desabilito correctamente.' : ' se habilito correctamente.') });
                    }
                    else {
                        return res.json({ success: false, msg: 'Error, el anuncio ya se actualizó anteriormente.' });
                    }
                }
                else {
                    return res.json({ success: false, msg: 'Anuncio no encontrado, no actualizado.' });
                }
            }
            catch (error) {
                return res.sendStatus(400).json({
                    msg: 'Error de proceso',
                    error: error
                });
            }
        }
        else {
            return res.sendStatus(400).json({
                msg: 'No se proporciono parametros correctos'
            });
        }
    });
}
function AnuncioEliminar(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.body.IdAnuncio != undefined) {
            let idAnuncio = req.body.IdAnuncio;
            try {
                const conn = yield database.conexionObtener();
                const empresa = yield conn.query("SELECT Anulado, Nombre, ImagenUrl FROM Gen_Anuncio WHERE IdAnuncio = " + idAnuncio + " LIMIT 1");
                let resultado = JSON.parse(JSON.stringify(empresa[0]));
                if (resultado.length > 0) {
                    let resultado1 = yield conn.query("DELETE FROM Gen_Anuncio WHERE IdAnuncio = " + idAnuncio);
                    if (resultado[0].ImagenUrl != '' && resultado[0].ImagenUrl != null) {
                        fs_1.default.unlink((0, path_1.join)(__dirname, '/../public/img/anuncios/') + resultado[0].ImagenUrl, (err) => {
                        });
                    }
                    return res.json({ success: true, data: idAnuncio, msg: '¡Anuncio Eliminado!' });
                }
                else {
                    return res.json({ success: false, msg: 'Anuncio no encontrado, no elimnado.' });
                }
            }
            catch (error) {
                return res.sendStatus(400).json({
                    msg: 'Error de proceso',
                    error: error
                });
            }
        }
        else {
            return res.sendStatus(400).json({
                msg: 'No se proporciono parametros correctos'
            });
        }
    });
}
function AnuncioNuevo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.body.Data != undefined) {
            let departamento = req.body.Data.Departamento;
            let descripcion = (req.body.Data.Descripcion != null && req.body.Data.Descripcion != '') ? req.body.Data.Descripcion : '';
            let fechaFin = req.body.Data.FechaFin;
            let fechaInicio = req.body.Data.FechaInicio;
            let imagen = req.body.Data.Imagen;
            let nombre = req.body.Data.Nombre;
            let orden = 1;
            try {
                let conn = yield database.conexionObtener();
                const empresa = yield conn.query("SELECT Orden FROM  Gen_Anuncio WHERE Departamento = '" + departamento + "' ORDER BY Orden DESC LIMIT 1");
                let resultado = JSON.parse(JSON.stringify(empresa[0]));
                if (resultado.length > 0) {
                    let ordenUltimo = parseInt(resultado[0].Orden);
                    orden = ordenUltimo > 0 ? ordenUltimo + 1 : 1;
                }
                else {
                    orden = 1;
                }
                const hoy = (0, moment_timezone_1.default)().tz("America/Lima");
                const hoyformateado = hoy.format('X');
                let base64Image = imagen.split(';base64,').pop();
                let archivoNombre = hoyformateado + ".png";
                fs_1.default.writeFile((0, path_1.join)(__dirname, '/../public/img/anuncios/') + archivoNombre, base64Image, { encoding: 'base64' }, function (err) {
                    //console.log('File created');
                });
                let insertar = yield conn.query("INSERT INTO Gen_Anuncio (Empresa, Nombre, Descripcion, Departamento, FechaInicio, FechaFin, ImagenUrl, Orden, Anulado) VALUES ('', '" + nombre + "','" + descripcion + "', '" + departamento + "'," +
                    " '" + fechaInicio + "' ,'" + fechaFin + "' , '" + archivoNombre + "'," + orden + ",0)");
                return res.json({ success: true });
            }
            catch (error) {
                return res.sendStatus(400);
            }
        }
        else {
            return res.json({ success: false, msg: 'No se proporcionaron datos de acceso anuncios', data: {} });
        }
    });
}
function AnuncioOrden(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.body.IdAnuncio != undefined && req.body.Orden != undefined) {
            let idAnuncio = req.body.IdAnuncio;
            let orden = req.body.Orden;
            try {
                const conn = yield database.conexionObtener();
                const empresa = yield conn.query("SELECT IdAnuncio FROM Gen_Anuncio WHERE IdAnuncio = " + idAnuncio + " LIMIT 1");
                let resultado = JSON.parse(JSON.stringify(empresa[0]));
                if (resultado.length > 0) {
                    let resultado1 = yield conn.query("UPDATE Gen_Anuncio SET  Orden = " + orden + " WHERE IdAnuncio =" + idAnuncio);
                    return res.json({ success: true, msg: 'Orden de anuncio actualizado' });
                }
                else {
                    return res.json({ success: false, msg: 'Anuncio no encontrado, no actualizado.' });
                }
            }
            catch (error) {
                return res.sendStatus(400).json({
                    msg: 'Error de proceso',
                    error: error
                });
            }
        }
        else {
            return res.sendStatus(400).json({
                msg: 'No se proporciono parametros correctos'
            });
        }
    });
}
function Departamentos(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let conn = yield database.conexionObtener();
            let resultadoDepa = yield conn.query("SELECT DISTINCT DepartamentoUbicacion FROM Gen_Empresa");
            let resultadoDepaFinal = JSON.parse(JSON.stringify(resultadoDepa[0]));
            if (resultadoDepaFinal.length > 0) {
                return res.json({ success: true, data: resultadoDepaFinal });
            }
            else {
                return res.json({ success: false, msg: 'No existe empresas' });
            }
        }
        catch (error) {
            return res.sendStatus(500);
        }
    });
}
/* LLAMADAS CONTROLLADORES MOTORIZADO*/
function Motorizados(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.query.Busqueda != undefined && req.query.IdEmpresa != undefined && req.query.Ubicacion != undefined && req.query.IdGrupoMotorizado != undefined) {
            let busqueda = req.query.Busqueda;
            let idEmpresa = '' + req.query.IdEmpresa;
            let ubicacion = req.query.Ubicacion;
            let idGrupo = '' + req.query.IdGrupoMotorizado;
            try {
                let conn = yield database.conexionObtener();
                let resultadoMotorizado = yield conn.query("SELECT COUNT(Empresa_Has_Motorizado.IdMotorizado) AS Empresas,Gen_Motorizado.*, IFNULL(Gen_GrupoMotorizado.IdGrupoMotorizado,0) AS IdGrupoMotorizado ,Gen_GrupoMotorizado.NombreGrupo FROM Gen_Motorizado " +
                    " LEFT JOIN Empresa_Has_Motorizado ON Gen_Motorizado.IdMotorizado = Empresa_Has_Motorizado.IdMotorizado " +
                    " LEFT JOIN Gen_Empresa ON Empresa_Has_Motorizado.IdEmpresa = Gen_Empresa.IdEmpresa " +
                    " LEFT JOIN Gen_GrupoMotorizado ON Gen_Motorizado.IdGrupoMotorizado = Gen_GrupoMotorizado.IdGrupoMotorizado  " +
                    " WHERE " + (idEmpresa != '0' && idEmpresa != '' ? "  Empresa_Has_Motorizado.IdEmpresa = " + idEmpresa + " AND " : (ubicacion != '' ? "  Gen_Empresa.DepartamentoUbicacion='" + ubicacion + "' AND " : "")) +
                    " (CONCAT(Gen_Motorizado.Apellidos,' ',Gen_Motorizado.Nombres) LIKE '%" + busqueda + "%' OR Gen_Motorizado.Dni LIKE '%" + busqueda + "%') "
                    + (idGrupo != '0' ? ' AND Gen_GrupoMotorizado.IdGrupoMotorizado=' + idGrupo : '') +
                    " GROUP BY Gen_Motorizado.IdMotorizado");
                let resultadoMotorizadoFinal = JSON.parse(JSON.stringify(resultadoMotorizado[0]));
                if (resultadoMotorizadoFinal.length > 0) {
                    return res.json({ success: true, data: resultadoMotorizadoFinal });
                }
                else {
                    return res.json({ success: false, msg: 'No existe motorizados' });
                }
            }
            catch (error) {
                return res.sendStatus(500);
            }
        }
        else {
            return res.json({ success: false, msg: 'No se proporcionaron los parametros', data: {} });
        }
    });
}
function MotorizadoEditar(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.body.IdMotorizado != undefined && req.body.Data != undefined) {
            let idMotorizado = req.body.IdMotorizado;
            let nombres = req.body.Data.Nombres;
            let apellidos = req.body.Data.Apellidos;
            let dni = req.body.Data.Dni;
            let telefono = req.body.Data.Telefono;
            let direccion = req.body.Data.Ddireccion;
            let vehiculo = req.body.Data.Vehiculo;
            let vehiculoPlaca = req.body.Data.VehiculoPlaca;
            let vehiculoColor = req.body.Data.VehiculoColor;
            let password = req.body.Data.Password;
            let idGrupoMotorizado = '' + req.body.Data.IdGrupoMotorizado;
            try {
                const hoy = (0, moment_timezone_1.default)().tz("America/Lima");
                moment_timezone_1.default.locale('es');
                const hoyformateado = hoy.format('YYYY-MM-DD HH:mm:ss');
                let conn = yield database.conexionObtener();
                let resultadoMotorizado = yield conn.query("SELECT * FROM Gen_Motorizado WHERE Dni = '" + dni + "' AND IdMotorizado <> " + idMotorizado);
                let resultadoMotorizadoFinal = JSON.parse(JSON.stringify(resultadoMotorizado[0]));
                if (resultadoMotorizadoFinal.length > 0) {
                    return res.json({ success: false, msg: 'El dni ya ingresado ya existe en otro usuario, deben ser unicos', data: {} });
                }
                else {
                    let insertar = yield conn.query("UPDATE Gen_Motorizado SET Nombres = '" + nombres + "', Apellidos = '" + apellidos + "', Dni = '" + dni + "', Telefono = '" + telefono + "', Password = '" + password + "'," +
                        " Direccion = '" + direccion + "',Vehiculo = '" + vehiculo + "',VehiculoPlaca = '" + vehiculoPlaca + "',VehiculoColor = '" + vehiculoColor + "',FechaMod = '" + hoyformateado + "', IdGrupoMotorizado=" + (idGrupoMotorizado != '0' ? idGrupoMotorizado : 'null') + " WHERE IdMotorizado = " + idMotorizado);
                    return res.json({ success: true });
                }
            }
            catch (error) {
                return res.sendStatus(400);
            }
        }
        else {
            return res.json({ success: false, msg: 'No se proporcionaron datos de acceso anuncios', data: {} });
        }
    });
}
function MotorizadoAnular(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.body.IdMotorizado != undefined && req.body.Accion != undefined) {
            let idMotorizado = req.body.IdMotorizado;
            let accion = req.body.Accion;
            try {
                const conn = yield database.conexionObtener();
                const empresa = yield conn.query("SELECT Anulado,Nombres FROM Gen_Motorizado WHERE IdMotorizado = " + idMotorizado + " LIMIT 1");
                let resultado = JSON.parse(JSON.stringify(empresa[0]));
                if (resultado.length > 0) {
                    let anulado = resultado[0].Anulado;
                    if (anulado != accion) {
                        let resultado1 = yield conn.query("UPDATE Gen_Motorizado SET  Anulado = " + accion + " WHERE IdMotorizado =" + idMotorizado);
                        return res.json({ success: true, msg: 'El motorizado ' + (accion == 1 ? ' se desabilito correctamente.' : ' se habilito correctamente.') });
                    }
                    else {
                        return res.json({ success: false, msg: 'Error, el motorizado ya se actualizó anteriormente.' });
                    }
                }
                else {
                    return res.json({ success: false, msg: 'Motorizado no encontrado, no actualizado.' });
                }
            }
            catch (error) {
                return res.sendStatus(400).json({
                    msg: 'Error de proceso',
                    error: error
                });
            }
        }
        else {
            return res.sendStatus(400).json({
                msg: 'No se proporciono parametros correctos'
            });
        }
    });
}
function MotorizadoNuevo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.body.Data != undefined) {
            let nombres = req.body.Data.Nombres;
            let apellidos = req.body.Data.Apellidos;
            let dni = req.body.Data.Dni;
            let telefono = req.body.Data.Telefono;
            let direccion = req.body.Data.Ddireccion;
            let vehiculo = req.body.Data.Vehiculo;
            let vehiculoPlaca = req.body.Data.VehiculoPlaca;
            let vehiculoColor = req.body.Data.VehiculoColor;
            let password = req.body.Data.Password;
            let idGrupoMotorizado = '' + req.body.Data.IdGrupoMotorizado;
            try {
                const hoy = (0, moment_timezone_1.default)().tz("America/Lima");
                moment_timezone_1.default.locale('es');
                const hoyformateado = hoy.format('YYYY-MM-DD HH:mm:ss');
                let conn = yield database.conexionObtener();
                let resultadoMotorizado = yield conn.query("SELECT * FROM Gen_Motorizado WHERE Dni = '" + dni + "'");
                let resultadoMotorizadoFinal = JSON.parse(JSON.stringify(resultadoMotorizado[0]));
                if (resultadoMotorizadoFinal.length > 0) {
                    return res.json({ success: false, msg: 'El dni ya ingresado ya existe en otro usuario, deben ser unicos', data: {} });
                }
                else {
                    let insertar = yield conn.query("INSERT INTO Gen_Motorizado(Nombres,Apellidos,Dni,Telefono,Password,Email,Direccion," +
                        " Vehiculo,VehiculoPlaca,VehiculoColor,PedidosConcretados,FechaReg,Anulado,Disponible,IdGrupoMotorizado) VALUES " +
                        " ('" + nombres + "','" + apellidos + "','" + dni + "','" + telefono + "','" + password + "','','" + direccion + "','" + vehiculo + "','" + vehiculoPlaca + "','" + vehiculoColor + "',0,'" + hoyformateado + "',0,1," + (idGrupoMotorizado != '0' ? idGrupoMotorizado : 'null') + ")");
                    return res.json({ success: true });
                }
            }
            catch (error) {
                return res.sendStatus(400);
            }
        }
        else {
            return res.json({ success: false, msg: 'No se proporcionaron datos de acceso anuncios', data: {} });
        }
    });
}
function MotorizadoEmpresas(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.query.IdMotorizado != undefined) {
            let idMotorizado = req.query.IdMotorizado;
            try {
                let conn = yield database.conexionObtener();
                let queryEmpresas = yield conn.query("SELECT Empresa_Has_Motorizado.IdEmpresaHasMotorizado, DATE_FORMAT(Empresa_Has_Motorizado.FechaReg, '%Y-%m-%d %H:%i:%s') AS FechaReg, Gen_Empresa.DepartamentoUbicacion, Gen_Empresa.IdEmpresa,Gen_Empresa.RazonSocial,Gen_Empresa.Anulado, Gen_EmpresaCategoria.EmpresaCategoria,Gen_Motorizado.Anulado AS MotorizadoAnulado,IFNULL(Gen_Empresa.IdRegion,0) AS IdRegion FROM Empresa_Has_Motorizado " +
                    " INNER JOIN Gen_Empresa ON Empresa_Has_Motorizado.IdEmpresa = Gen_Empresa.IdEmpresa " +
                    " INNER JOIN Gen_Motorizado ON Empresa_Has_Motorizado.IdMotorizado = Gen_Motorizado.IdMotorizado " +
                    " INNER JOIN Gen_EmpresaCategoria ON Gen_Empresa.IdEmpresaCategoria = Gen_EmpresaCategoria.IdEmpresaCategoria " +
                    " WHERE Empresa_Has_Motorizado.IdMotorizado=" + idMotorizado);
                let resultadoEmpresas = JSON.parse(JSON.stringify(queryEmpresas[0]));
                if (resultadoEmpresas.length > 0) {
                    return res.json({ success: true, msg: 'Empresas obtenidas', data: resultadoEmpresas, totalEmpresas: resultadoEmpresas.length });
                }
                else {
                    return res.json({ success: false, msg: 'El motorizado no tiene empresas asignadas.', data: [] });
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
function MotorizadoGrupos(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let busqueda = req.query.Busqueda || '';
            let conn = yield database.conexionObtener();
            let queryGrupos = yield conn.query("SELECT Gen_GrupoMotorizado.IdGrupoMotorizado, Gen_GrupoMotorizado.NombreGrupo, Gen_GrupoMotorizado.Servicio, " +
                " DATE_FORMAT(Gen_GrupoMotorizado.FechaReg, '%Y-%m-%d %H:%i:%s') AS FechaReg, Gen_GrupoMotorizado.Vigente, Gen_GrupoMotorizado.IdRegion, Gen_Region.NombreRegion FROM Gen_GrupoMotorizado " +
                " INNER JOIN Gen_Region ON Gen_GrupoMotorizado.IdRegion = Gen_Region.IdRegion WHERE Gen_GrupoMotorizado.NombreGrupo LIKE '%" + busqueda + "%' ");
            let queryGruposFinal = JSON.parse(JSON.stringify(queryGrupos[0]));
            if (queryGruposFinal.length > 0) {
                return res.json({ success: true, msg: 'Grupos Obtenidos', data: queryGruposFinal });
            }
            else {
                return res.json({ success: false, msg: 'No hay grupos', data: [] });
            }
        }
        catch (error) {
            return res.sendStatus(400);
        }
    });
}
function MotorizadoGrupoEditar(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.body.IdGrupoMotorizado != undefined && req.body.Data != undefined) {
            let idGrupoMotorizado = req.body.IdGrupoMotorizado;
            let nombreGrupo = req.body.Data.NombreGrupo;
            let servicio = req.body.Data.Servicio;
            let vigente = req.body.Data.Vigente;
            let idRegion = req.body.Data.IdRegion;
            try {
                let conn = yield database.conexionObtener();
                let insertar = yield conn.query("UPDATE Gen_GrupoMotorizado SET NombreGrupo = '" + nombreGrupo + "', Servicio = " + servicio + ", Vigente = " + vigente + ", IdRegion = " + idRegion +
                    " WHERE IdGrupoMotorizado = " + idGrupoMotorizado);
                return res.json({ success: true });
            }
            catch (error) {
                return res.sendStatus(400);
            }
        }
        else {
            return res.json({ success: false, msg: 'No se proporcionaron datos de acceso anuncios', data: {} });
        }
    });
}
function MotorizadoGrupoNuevo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.body.Data != undefined) {
            let nombreGrupo = req.body.Data.NombreGrupo;
            let servicio = req.body.Data.Servicio;
            let vigente = req.body.Data.Vigente;
            let idRegion = req.body.Data.IdRegion;
            try {
                const hoy = (0, moment_timezone_1.default)().tz("America/Lima");
                moment_timezone_1.default.locale('es');
                const hoyformateado = hoy.format('YYYY-MM-DD HH:mm:ss');
                let conn = yield database.conexionObtener();
                let insertar = yield conn.query("INSERT INTO Gen_GrupoMotorizado(NombreGrupo,Servicio,FechaReg,Vigente,IdRegion) " +
                    " VALUES ('" + nombreGrupo + "'," + servicio + ",'" + hoyformateado + "'," + vigente + "," + idRegion + ")");
                return res.json({ success: true });
            }
            catch (error) {
                return res.sendStatus(400);
            }
        }
        else {
            return res.json({ success: false, msg: 'No se proporcionaron datos de acceso anuncios', data: {} });
        }
    });
}
function MotorizadoRemoverEmpresa(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.body.IdMotorizadoEmpresa != undefined) {
            let idMotorizadoEmpresa = req.body.IdMotorizadoEmpresa;
            try {
                const conn = yield database.conexionObtener();
                let resultado1 = yield conn.query("DELETE FROM Empresa_Has_Motorizado WHERE IdEmpresaHasMotorizado = " + idMotorizadoEmpresa);
                return res.json({ success: true, msg: 'Se eliminó la asignacion al motorizado' });
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
function MotorizadoAsignarEmpresa(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.body.IdMotorizado != undefined && req.body.IdEmpresa != undefined) {
            let idMotorizado = req.body.IdMotorizado;
            let idEmpresa = req.body.IdEmpresa;
            try {
                const hoy = (0, moment_timezone_1.default)().tz("America/Lima");
                moment_timezone_1.default.locale('es');
                const hoyformateado = hoy.format('YYYY-MM-DD HH:mm:ss');
                let conn = yield database.conexionObtener();
                let resultadoMotorizado = yield conn.query("SELECT IdEmpresaHasMotorizado FROM Empresa_Has_Motorizado WHERE IdEmpresa=" + idEmpresa + " AND IdMotorizado=" + idMotorizado);
                let resultadoMotorizadoFinal = JSON.parse(JSON.stringify(resultadoMotorizado[0]));
                if (resultadoMotorizadoFinal.length > 0) {
                    return res.json({ success: false, msg: 'Error, ya se encuentra asignada la empresa seleccionada' });
                }
                else {
                    let insertar = yield conn.query("INSERT INTO Empresa_Has_Motorizado (IdEmpresa,IdMotorizado,FechaReg,Anulado) " +
                        " VALUES (" + idEmpresa + "," + idMotorizado + ",'" + hoyformateado + "',0)");
                    return res.json({ success: true });
                }
            }
            catch (error) {
                return res.sendStatus(400);
            }
        }
        else {
            return res.json({ success: false, msg: 'No se proporcionaron datos de acceso requeridos' });
        }
    });
}
/* FIN LLAMADAS CONTROLLADORES MOTORIZADO*/
/* EMPRESAS CONTROLLADORES */
function EmpresaEditar(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.body.IdEmpresa != undefined && req.body.Data != undefined) {
            let idEmpresa = req.body.IdEmpresa;
            let idCategoria = req.body.Data.IdEmpresaCategoria;
            let idSubCategoria = req.body.Data.IdEmpresaSubCategoria;
            let ruc = req.body.Data.Ruc;
            let razonSocial = req.body.Data.RazonSocial;
            let direccion = req.body.Data.Direccion;
            let departamento = req.body.Data.DepartamentoUbicacion;
            let provincia = req.body.Data.ProvinciaUbicacion;
            let distrito = req.body.Data.DistritoUbicacion;
            let horarioInicio = req.body.Data.HorarioInicio;
            let horarioFin = req.body.Data.HorarioFin;
            let imagen = req.body.Data.Imagen;
            let archivoAnterior = '';
            try {
                let conn = yield database.conexionObtener();
                let resultadoAnuncio = yield conn.query("SELECT ImagenUrl FROM Gen_Empresa WHERE IdEmpresa = " + idEmpresa);
                let resultadoAnuncioFinal = JSON.parse(JSON.stringify(resultadoAnuncio[0]));
                if (resultadoAnuncioFinal.length > 0) {
                    archivoAnterior = resultadoAnuncioFinal[0].ImagenUrl;
                }
                else {
                    archivoAnterior = '';
                }
                const hoy = (0, moment_timezone_1.default)().tz("America/Lima");
                const hoyformateado = hoy.format('X');
                const hoyformateadoMod = hoy.format('YYYY-MM-DD HH:mm:ss');
                if (imagen == '') {
                    let insertar = yield conn.query("UPDATE Gen_Empresa SET IdEmpresaCategoria=" + idCategoria + ", IdEmpresaSubCategoria=" + idSubCategoria + ", RazonSocial = '" + razonSocial + "', Descripcion = '', Ruc = '" + ruc + "', Direccion = '" + direccion + "'," +
                        " DistritoUbicacion = '" + distrito + "', ProvinciaUbicacion = '" + provincia + "', DepartamentoUbicacion = '" + departamento + "', HorarioInicio = '" + horarioInicio + "', HorarioFin = '" + horarioFin + "', Observacion = ''," +
                        " Puntuacion = 5 ,FechaMod = '" + hoyformateadoMod + "' WHERE IdEmpresa =" + idEmpresa);
                    return res.json({ success: true });
                }
                else {
                    let base64Image = imagen.split(';base64,').pop();
                    let archivoNombre = hoyformateado + ".png";
                    fs_1.default.writeFile((0, path_1.join)(__dirname, '/../public/img/empresas/') + archivoNombre, base64Image, { encoding: 'base64' }, function (err) {
                    });
                    let insertar = yield conn.query("UPDATE Gen_Empresa SET  IdEmpresaCategoria=" + idCategoria + ", IdEmpresaSubCategoria=" + idSubCategoria + ", RazonSocial = '" + razonSocial + "', Descripcion = '', Ruc = '" + ruc + "', Direccion = '" + direccion + "'," +
                        " DistritoUbicacion = '" + distrito + "', ProvinciaUbicacion = '" + provincia + "', DepartamentoUbicacion = '" + departamento + "', HorarioInicio = '" + horarioInicio + "', HorarioFin = '" + horarioFin + "', Observacion = ''," +
                        " ImagenUrl = '" + archivoNombre + "',Puntuacion = 5,FechaMod = '" + hoyformateadoMod + "' WHERE IdEmpresa =" + idEmpresa);
                    if (archivoAnterior != '' && archivoAnterior != null) {
                        fs_1.default.unlink((0, path_1.join)(__dirname, '/../public/img/empresas/') + archivoAnterior, (err) => {
                        });
                    }
                    return res.json({ success: true });
                }
            }
            catch (error) {
                return res.sendStatus(400);
            }
        }
        else {
            return res.json({ success: false, msg: 'No se proporcionaron datos de acceso anuncios', data: {} });
        }
    });
}
function EmpresaConfigurar(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.body.IdEmpresa != undefined && req.body.Data != undefined) {
            let idEmpresa = req.body.IdEmpresa;
            let precioBaseDelivery = req.body.Data.PrecioDelivery;
            let precioPorKm = req.body.Data.PrecioKm;
            let areaKm = req.body.Data.KmArea;
            let latitud = req.body.Data.Latitud;
            let longitud = req.body.Data.Longitud;
            let facturaUrl = req.body.Data.FacturaUrl;
            let almacen = req.body.Data.Almacen;
            let idAlmacen = req.body.Data.IdAlmacen;
            let habilitadoPedido = req.body.Data.HabilitadoPedido;
            let tieneSistema = req.body.Data.TieneSistema;
            let idRegion = '' + req.body.Data.IdRegion;
            try {
                let conn = yield database.conexionObtener();
                let insertar = yield conn.query("UPDATE Gen_Empresa SET PrecioDelivery = " + precioBaseDelivery + ",PrecioKm = " + precioPorKm + ",KmArea = " + areaKm + ",Latitud = '" + latitud + "',Longitud = '" + longitud + "',FacturaUrl = '" + facturaUrl + "'," +
                    " Almacen = '" + almacen + "',IdAlmacen = " + idAlmacen + ",HabilitadoPedido = " + habilitadoPedido + ",TieneSistema = " + tieneSistema + ", IdRegion = " + (idRegion != '0' ? idRegion : 'null') + " WHERE IdEmpresa =" + idEmpresa);
                return res.json({ success: true });
            }
            catch (error) {
                return res.json({ error });
            }
        }
        else {
            return res.json({ success: false, msg: 'No se proporcionaron datos de acceso anuncios', data: {} });
        }
    });
}
function EmpresaNueva(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.body.Data != undefined) {
            let idEmpresaCategoria = req.body.Data.IdEmpresaCategoria;
            let idEmpresaSubCategoria = req.body.Data.IdEmpresaSubCategoria;
            let ruc = req.body.Data.Ruc;
            let razonSocial = req.body.Data.RazonSocial;
            let direccion = req.body.Data.Direccion;
            let departamentoUbicacion = req.body.Data.DepartamentoUbicacion;
            let provinciaUbicacion = req.body.Data.ProvinciaUbicacion;
            let distritoUbicacion = req.body.Data.DistritoUbicacion;
            let horarioInicio = req.body.Data.HorarioInicio;
            let horarioFin = req.body.Data.HorarioFin;
            let imagen = req.body.Data.Imagen;
            let precioDelivery = req.body.Data.PrecioDelivery;
            let precioKm = req.body.Data.PrecioKm;
            let kmArea = req.body.Data.KmArea;
            let latitud = req.body.Data.Latitud;
            let longitud = req.body.Data.Longitud;
            let facturaUrl = req.body.Data.FacturaUrl;
            let almacen = req.body.Data.Almacen;
            let idAlmacen = req.body.Data.IdAlmacen;
            let habilitadoPedido = req.body.Data.HabilitadoPedido;
            let tieneSistema = req.body.Data.TieneSistema;
            let idRegion = '' + req.body.Data.IdRegion;
            try {
                let conn = yield database.conexionObtener();
                const hoy = (0, moment_timezone_1.default)().tz("America/Lima");
                const hoyformateado = hoy.format('X');
                const hoyformateadoMod = hoy.format('YYYY-MM-DD HH:mm:ss');
                let base64Image = imagen.split(';base64,').pop();
                let archivoNombre = hoyformateado + ".png";
                fs_1.default.writeFile((0, path_1.join)(__dirname, '/../public/img/empresas/') + archivoNombre, base64Image, { encoding: 'base64' }, function (err) {
                });
                let insertar = yield conn.query("INSERT INTO Gen_Empresa(IdEmpresaCategoria,IdEmpresaSubCategoria,RazonSocial,Ruc,Direccion,DistritoUbicacion," +
                    " ProvinciaUbicacion,DepartamentoUbicacion,PrecioDelivery,PrecioKm,KmArea,HorarioInicio,HorarioFin,ImagenUrl," +
                    " Puntuacion,Latitud,Longitud,FacturaUrl,FechaReg,Almacen,IdAlmacen,UsuarioReg,HabilitadoPedido,TieneSistema,Anulado,IdRegion)" +
                    "VALUES (" + idEmpresaCategoria + "," + idEmpresaSubCategoria + ",'" + razonSocial + "','" + ruc + "','" + direccion + "','" + distritoUbicacion + "'," +
                    "'" + provinciaUbicacion + "','" + departamentoUbicacion + "'," + precioDelivery + "," + precioKm + "," + kmArea + ",'" + horarioInicio + "','" + horarioFin + "','" + archivoNombre + "',5," +
                    "'" + latitud + "','" + longitud + "','" + facturaUrl + "','" + hoyformateadoMod + "','" + almacen + "'," + idAlmacen + ",'admin'," + habilitadoPedido + "," + tieneSistema + ",0," + (idRegion != '0' ? idRegion : 'null') + ")");
                return res.json({ success: true });
            }
            catch (error) {
                return res.json({ error });
            }
        }
        else {
            return res.json({ success: false, msg: 'No se proporcionaron datos de acceso anuncios', data: {} });
        }
    });
}
/* FIN EMPRESAS CONTROLLADORES */
/* PEDIDOS CONTROLLADORES */
function Pedidos(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.query.IdRegion != undefined) {
            let idRegion = req.query.IdRegion;
            try {
                let conn = yield database.conexionObtener();
                let resultadoPedido = yield conn.query("SELECT Gen_Pedido.*,CONCAT(Gen_Cliente.Nombres,' ',Gen_Cliente.Apellidos) AS Cliente, " +
                    " IF(ISNULL(Gen_Pedido.IdMotorizado), NULL, CONCAT(Gen_Motorizado.Nombres,' ',Gen_Motorizado.Apellidos)) AS Motorizado, Gen_Empresa.RazonSocial,Gen_Empresa.Direccion AS EmpresaDireccion, Gen_Empresa.IdRegion," +
                    " Gen_Empresa.Latitud AS EmpresaLatitud, Gen_Empresa.Longitud AS EmpresaLongitud, Gen_Pedido.IdMotorizado,Gen_Pedido.IdCliente, Gen_Cliente.Telefono AS TelefonoCliente, Gen_Pedido.Referencia, Gen_Motorizado.Telefono AS TelefonoMotorizado,DATE_FORMAT(Gen_Pedido.FechaReg, '%Y-%m-%d %H:%i:%s') AS FechaRegFormat, " +
                    " DetallePedidos.Productos FROM Gen_Pedido " +
                    " INNER JOIN Gen_Cliente ON Gen_Pedido.IdCliente = Gen_Cliente.IdCliente " +
                    " LEFT JOIN Gen_Motorizado ON Gen_Pedido.IdMotorizado = Gen_Motorizado.IdMotorizado " +
                    " INNER JOIN Gen_Empresa ON Gen_Pedido.IdEmpresa = Gen_Empresa.IdEmpresa " +
                    " LEFT JOIN (SELECT Gen_PedidoDet.IdPedido, " +
                    " CONCAT( '[', GROUP_CONCAT( CONCAT( '{ \"IdPedidoDet\":', Gen_PedidoDet.IdPedidoDet ,',\"IdPedido\":', Gen_PedidoDet.IdPedido , ',\"IdProducto\":',Gen_PedidoDet.IdProducto,',\"Producto\":\"',Gen_PedidoDet.Producto,'\",\"Descripcion\":\"',Gen_PedidoDet.Descripcion,'\",\"Cantidad\":', Gen_PedidoDet.Cantidad, ',\"ProductoImagenUrl\":\"',Gen_PedidoDet.ProductoImagenUrl,'\",\"Indicacion\":\"',Gen_PedidoDet.Indicacion,'\",\"Precio\":',Gen_PedidoDet.Precio,' }' ) SEPARATOR ', '), ']' ) AS Productos FROM Gen_PedidoDet GROUP BY Gen_PedidoDet.IdPedido )  AS DetallePedidos ON DetallePedidos.IdPedido = Gen_Pedido.IdPedido " +
                    " WHERE (Gen_Pedido.Estado <> 'F' AND Gen_Pedido.Estado <> 'C') AND Gen_Empresa.TieneSistema=0" + (idRegion == '0' ? '' : ' AND Gen_Empresa.IdRegion =' + idRegion) + ' ORDER BY Gen_Pedido.FechaReg ASC');
                let resultadofinalPedido = JSON.parse(JSON.stringify(resultadoPedido[0]));
                if (resultadofinalPedido.length > 0) {
                    return res.json({ success: true, data: resultadofinalPedido });
                }
                else {
                    return res.json({ success: false, msg: 'No existe ningun pedido' });
                }
            }
            catch (error) {
                return res.sendStatus(400);
            }
        }
        else {
            return res.sendStatus(400);
        }
    });
}
function PedidoProceso(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.body.IdPedido != undefined) {
            let IdPedido = req.body.IdPedido;
            let Usuario = req.body.IdUsuario;
            try {
                let conn = yield database.conexionObtener();
                let resultado = yield conn.query("SELECT Gen_Pedido.IdCliente, Gen_Pedido.Estado, Gen_Cliente.TokenFcm, Gen_Empresa.TieneSistema FROM Gen_Pedido " +
                    " INNER JOIN Gen_Empresa ON Gen_Pedido.IdEmpresa = Gen_Empresa.IdEmpresa " +
                    " INNER JOIN Gen_Cliente ON Gen_Pedido.IdCliente = Gen_Cliente.IdCliente  WHERE IdPedido=" + IdPedido);
                let resultadofinal = JSON.parse(JSON.stringify(resultado[0]));
                if (resultadofinal.length > 0) {
                    if (resultadofinal[0].Estado == 'E') {
                        yield conn.query("UPDATE Gen_Pedido SET Estado ='PE' , UsuarioReg='" + Usuario + "' WHERE IdPedido = " + IdPedido);
                        try {
                            let estado = yield (0, fcm_1.NotificacionEstadoPedido)(resultadofinal[0].IdCliente, resultadofinal[0].TokenFcm, 'PE', resultadofinal[0].TieneSistema);
                        }
                        catch (error) {
                        }
                        return res.json({ success: true, msg: "El pedido se paso a preparando", usuario: Usuario });
                    }
                    else {
                        return res.json({ success: false, msg: "El pedido ya esta en proceso" });
                    }
                }
                else {
                    return res.sendStatus(400);
                }
            }
            catch (error) {
                return res.sendStatus(400);
            }
        }
        else {
            return res.sendStatus(400);
        }
    });
}
function PedidoAsignar(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.body.IdPedido != undefined && req.body.IdMotorizado != undefined) {
            let IdPedido = req.body.IdPedido;
            let IdMotorizado = req.body.IdMotorizado;
            let motorizadoNombre = req.body.Motorizado;
            try {
                let conn = yield database.conexionObtener();
                let resultadoPedido = yield conn.query("SELECT IdPedido FROM Gen_Pedido WHERE IdPedido=" + IdPedido + " AND Estado='PE' AND IdMotorizado IS NULL");
                let resultadofinalPedido = JSON.parse(JSON.stringify(resultadoPedido[0]));
                if (resultadofinalPedido.length > 0) {
                    let resultado1 = yield conn.query("UPDATE Gen_Pedido SET  IdMotorizado = " + IdMotorizado + " WHERE IdPedido =" + IdPedido);
                    try {
                        let estado = yield (0, fcm_1.NotificacionEstadoMotorizado)(IdMotorizado);
                    }
                    catch (error) {
                    }
                    return res.json({ success: true, msg: '¡Motorizado asignado al pedido! Actualizado' });
                }
                else {
                    return res.json({ success: false, msg: "El pedido ya cuenta con motorizado asignado" });
                }
            }
            catch (error) {
                return res.sendStatus(400);
            }
        }
        else {
            return res.json({ success: false, msg: 'No se porcionaron parametros correctos' });
        }
    });
}
function PedidoCambiar(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.body.IdPedido != undefined && req.body.IdMotorizadoNuevo != undefined && req.body.IdMotorizadoAnterior != undefined) {
            let idPedido = req.body.IdPedido;
            let idMotorizadoNuevo = req.body.IdMotorizadoNuevo;
            let idMotorizadoAnterior = req.body.IdMotorizadoAnterior;
            try {
                let conn = yield database.conexionObtener();
                let resultadoPedido = yield conn.query("SELECT IdPedido FROM Gen_Pedido WHERE IdPedido=" + idPedido + " AND IdMotorizado =" + idMotorizadoAnterior);
                let resultadofinalPedido = JSON.parse(JSON.stringify(resultadoPedido[0]));
                if (resultadofinalPedido.length > 0) {
                    let resultado1 = yield conn.query("UPDATE Gen_Pedido SET  IdMotorizado = " + idMotorizadoNuevo + " WHERE IdPedido =" + idPedido);
                    try {
                        let estado = yield (0, fcm_1.NotificacionEstadoMotorizado)(idMotorizadoNuevo);
                    }
                    catch (error) {
                    }
                    return res.json({ success: true, msg: '¡Motorizado cambiado!' });
                }
                else {
                    return res.json({ success: false, msg: "El pedido cuenta con otro motorizado asignado" });
                }
            }
            catch (error) {
                return res.sendStatus(400);
            }
        }
        else {
            return res.json({ success: false, msg: 'No se porcionaron parametros correctos' });
        }
    });
}
function MotorizadosServicio(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.query.IdRegion != undefined) {
            let idRegion = req.query.IdRegion;
            try {
                let conn = yield database.conexionObtener();
                let motorizadosRegion = yield conn.query("SELECT IFNULL(Pedidos.PedidosAsignados,0) AS PedidosAsignados, Gen_Motorizado.IdMotorizado,Gen_Motorizado.Dni,Gen_Motorizado.Nombres, " +
                    " Gen_Motorizado.Apellidos,Gen_Motorizado.Vehiculo,Gen_Motorizado.VehiculoPlaca,Gen_Motorizado.VehiculoColor,Gen_Motorizado.Telefono,Gen_GrupoMotorizado.NombreGrupo FROM Gen_Motorizado " +
                    " INNER JOIN Gen_GrupoMotorizado ON Gen_Motorizado.IdGrupoMotorizado = Gen_GrupoMotorizado.IdGrupoMotorizado " +
                    " LEFT JOIN (SELECT Gen_Pedido.IdMotorizado, COUNT(Gen_Pedido.IdPedido) AS PedidosAsignados FROM Gen_Pedido " +
                    " WHERE Gen_Pedido.Estado <> 'F' AND Gen_Pedido.Estado <> 'C' GROUP BY Gen_Pedido.IdMotorizado) AS Pedidos ON Pedidos.IdMotorizado = Gen_Motorizado.IdMotorizado " +
                    " WHERE Gen_GrupoMotorizado.Servicio = 1 AND Gen_GrupoMotorizado.Vigente = 1 AND Gen_GrupoMotorizado.IdRegion = " + idRegion + " GROUP BY Gen_Motorizado.IdMotorizado");
                let resutaldoFinalMotorizados = JSON.parse(JSON.stringify(motorizadosRegion[0]));
                return res.json({ success: true, data: resutaldoFinalMotorizados });
            }
            catch (error) {
                return res.sendStatus(400);
            }
        }
        else {
            return res.json({ success: false, msg: 'No se porcionaron parametros correctos' });
        }
    });
}
/* FIN PEDIDOS CONTROLLADORES */
/* INICIO CONTROLLADORES PRODUCTOS */
function ProductosEmpresa(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.query.Busqueda != undefined && req.query.IdEmpresa != undefined) {
            let idEmpresa = req.query.IdEmpresa;
            let busqueda = req.query.Busqueda || '';
            try {
                let serve = req.headers.host;
                let protocolo = req.protocol + "://";
                let servidor = protocolo + serve;
                let rutaAlmacenamiento = "/img/productos/";
                let rutaFinal = servidor + rutaAlmacenamiento;
                let conn = yield database.conexionObtener();
                let resultadoProductos = yield conn.query("SELECT Gen_Producto.IdProducto,Gen_Producto.IdProductoCategoria,Gen_Producto.Producto,Gen_Producto.ProductoDesc,Gen_Producto.PrecioContado,CONCAT('" + rutaFinal + "',Gen_Producto.Imagen) AS Imagen,Gen_Producto.UsuarioReg,Gen_Producto.Anulado,DATE_FORMAT(Gen_Producto.FechaReg, '%Y-%m-%d %H:%i:%s') AS FechaReg,Gen_ProductoCategoria.ProductoCategoria,Gen_ProductoCategoria.MostrarDelivery,Gen_ProductoCategoria.Anulado AS AnuladoCat " +
                    " FROM Gen_Producto INNER JOIN Gen_ProductoCategoria ON  Gen_Producto.IdProductoCategoria = Gen_ProductoCategoria.IdProductoCategoria " +
                    " WHERE Gen_ProductoCategoria.IdEmpresa = " + idEmpresa + "  AND Gen_Producto.Producto LIKE '%" + busqueda + "%'");
                let resultadoProductosFinal = JSON.parse(JSON.stringify(resultadoProductos[0]));
                if (resultadoProductosFinal.length > 0) {
                    return res.json({ success: true, data: resultadoProductosFinal });
                }
                else {
                    return res.json({ success: false, msg: 'No existe productos' });
                }
            }
            catch (error) {
                return res.sendStatus(500);
            }
        }
        else {
            return res.json({ success: false, msg: 'No se proporcionaron datos de acceso', data: {} });
        }
    });
}
function ProductosCategoriasEmpresa(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.query.Busqueda != undefined && req.query.IdEmpresa != undefined) {
            let idEmpresa = req.query.IdEmpresa;
            let busqueda = req.query.Busqueda || '';
            try {
                let conn = yield database.conexionObtener();
                let resultadoCategoriasPro = yield conn.query("SELECT IdProductoCategoria,IdEmpresa,ProductoCategoria,Anulado, " +
                    "DATE_FORMAT(FechaReg,'%Y-%m-%d %H:%i:%s') AS FechaReg,UsuarioReg,FechaMod,UsuarioMod,MostrarDelivery,Orden FROM Gen_ProductoCategoria WHERE IdEmpresa = " + idEmpresa + "  AND ProductoCategoria LIKE '%" + busqueda + "%' ORDER BY Orden ASC");
                let resultadoCategoriasProFinal = JSON.parse(JSON.stringify(resultadoCategoriasPro[0]));
                if (resultadoCategoriasProFinal.length > 0) {
                    return res.json({ success: true, data: resultadoCategoriasProFinal });
                }
                else {
                    return res.json({ success: false, msg: 'No existe categorias la empresa' });
                }
            }
            catch (error) {
                return res.sendStatus(500);
            }
        }
        else {
            return res.json({ success: false, msg: 'No se proporcionaron datos de acceso', data: {} });
        }
    });
}
function ProductosCategoriaAgregar(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.body.ProductoCategoria != undefined && req.body.IdEmpresa != undefined) {
            let idEmpresa = req.body.IdEmpresa;
            let productoCategoria = req.body.ProductoCategoria;
            try {
                let conn = yield database.conexionObtener();
                let resultadoCategoriasPro = yield conn.query("SELECT * FROM Gen_ProductoCategoria WHERE IdEmpresa = " + idEmpresa + "  AND ProductoCategoria ='" + productoCategoria + "'");
                let resultadoCategoriasProFinal = JSON.parse(JSON.stringify(resultadoCategoriasPro[0]));
                if (resultadoCategoriasProFinal.length > 0) {
                    return res.json({ success: false, msg: "Ya esta existe la categoria" });
                }
                else {
                    const hoy = (0, moment_timezone_1.default)().tz("America/Lima");
                    const hoyformateadoMod = hoy.format('YYYY-MM-DD HH:mm:ss');
                    let insertar = yield conn.query("INSERT INTO Gen_ProductoCategoria (IdEmpresa,ProductoCategoria,Anulado,FechaReg,UsuarioReg,MostrarDelivery,Orden) " +
                        " VALUES (" + idEmpresa + ",'" + productoCategoria + "',0,'" + hoyformateadoMod + "','admin',0,0)");
                    let resultadoCategoriasPro2 = yield conn.query("SELECT * FROM Gen_ProductoCategoria WHERE IdEmpresa = " + idEmpresa);
                    let resultadoCategoriasProFinal2 = JSON.parse(JSON.stringify(resultadoCategoriasPro2[0]));
                    return res.json({ success: true, msg: "se agregó y seleccionó", data: resultadoCategoriasProFinal2.length > 0 ? resultadoCategoriasProFinal2 : [] });
                }
            }
            catch (error) {
                return res.json({ error });
            }
        }
        else {
            return res.json({ success: false, msg: 'No se proporcionaron', data: {} });
        }
    });
}
function ProductoNuevo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.body.IdEmpresa != undefined && req.body.Data != undefined) {
            let idEmpresa = req.body.IdEmpresa;
            let idProductoCategoria = req.body.Data.IdProductoCategoria;
            let producto = req.body.Data.Producto;
            let productoDesc = req.body.Data.ProductoDesc;
            let precioContado = req.body.Data.PrecioContado;
            let imagen = req.body.Data.Imagen;
            try {
                let conn = yield database.conexionObtener();
                const hoy = (0, moment_timezone_1.default)().tz("America/Lima");
                const hoyformateado = hoy.format('X');
                const hoyformateadoMod = hoy.format('YYYY-MM-DD HH:mm:ss');
                let resultadoCategoriasPro = yield conn.query("SELECT * FROM Gen_Producto " +
                    " INNER JOIN Gen_ProductoCategoria ON Gen_Producto.IdProductoCategoria = Gen_ProductoCategoria.IdProductoCategoria " +
                    " WHERE Gen_Producto.Producto = '" + producto + "' AND Gen_ProductoCategoria.IdEmpresa = " + idEmpresa);
                let resultadoCategoriasProFinal = JSON.parse(JSON.stringify(resultadoCategoriasPro[0]));
                if (resultadoCategoriasProFinal.length > 0) {
                    return res.json({ success: false, msg: "Ya esta existe el producto" });
                }
                else {
                    if (imagen != '') {
                        let base64Image = imagen.split(';base64,').pop();
                        let archivoNombre = idEmpresa + "-" + hoyformateado + ".png";
                        fs_1.default.writeFile((0, path_1.join)(__dirname, '/../public/img/productos/') + archivoNombre, base64Image, { encoding: 'base64' }, function (err) {
                        });
                        let insertar = yield conn.query("INSERT INTO Gen_Producto (IdProductoCategoria,Producto,ProductoDesc,PrecioContado,Imagen,FechaReg,UsuarioReg,Anulado)" +
                            " VALUES ('" + idProductoCategoria + "','" + producto + "','" + productoDesc + "'," + precioContado + ",'" + archivoNombre + "','" + hoyformateadoMod + "','ADMIN',0)");
                        return res.json({ success: true });
                    }
                    else {
                        let insertar = yield conn.query("INSERT INTO Gen_Producto (IdProductoCategoria,Producto,ProductoDesc,PrecioContado,FechaReg,UsuarioReg,Anulado)" +
                            " VALUES ('" + idProductoCategoria + "','" + producto + "','" + productoDesc + "'," + precioContado + ",'" + hoyformateadoMod + "','ADMIN',0)");
                        return res.json({ success: true });
                    }
                }
            }
            catch (error) {
                return res.json({ error });
            }
        }
        else {
            return res.json({ success: false, msg: 'No se proporcionaron datos de acceso anuncios', data: {} });
        }
    });
}
function ProductoEditar(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.body.IdEmpresa != undefined && req.body.Data != undefined) {
            let idEmpresa = req.body.IdEmpresa;
            let idProducto = req.body.Data.IdProducto;
            let idProductoCategoria = req.body.Data.IdProductoCategoria;
            let producto = req.body.Data.Producto;
            let productoDesc = req.body.Data.ProductoDesc;
            let precioContado = req.body.Data.PrecioContado;
            let imagen = req.body.Data.Imagen;
            let archivoAnterior = '';
            try {
                let conn = yield database.conexionObtener();
                let resultadoImagen = yield conn.query("SELECT Imagen FROM Gen_Producto WHERE IdProducto = " + idProducto);
                let resultadoImagenFinal = JSON.parse(JSON.stringify(resultadoImagen[0]));
                if (resultadoImagenFinal.length > 0) {
                    archivoAnterior = resultadoImagenFinal[0].Imagen;
                }
                else {
                    archivoAnterior = '';
                }
                let resultadoCategoriasPro = yield conn.query("SELECT * FROM Gen_Producto " +
                    " INNER JOIN Gen_ProductoCategoria ON Gen_Producto.IdProductoCategoria = Gen_ProductoCategoria.IdProductoCategoria " +
                    " WHERE Gen_Producto.Producto = '" + producto + "' AND Gen_ProductoCategoria.IdEmpresa = " + idEmpresa + " AND Gen_Producto.IdProducto <> " + idProducto);
                let resultadoCategoriasProFinal = JSON.parse(JSON.stringify(resultadoCategoriasPro[0]));
                if (resultadoCategoriasProFinal.length > 0) {
                    return res.json({ success: false, msg: "Ya esta existe ese nombre en otro producto" });
                }
                else {
                    const hoy = (0, moment_timezone_1.default)().tz("America/Lima");
                    const hoyformateado = hoy.format('X');
                    const hoyformateadoMod = hoy.format('YYYY-MM-DD HH:mm:ss');
                    if (imagen == '') {
                        let insertar = yield conn.query("UPDATE Gen_Producto SET IdProductoCategoria =" + idProductoCategoria + " ,Producto = '" + producto + "' , ProductoDesc = '" + productoDesc + "', PrecioContado = " + precioContado +
                            " WHERE IdProducto =" + idProducto);
                        return res.json({ success: true });
                    }
                    else {
                        let base64Image = imagen.split(';base64,').pop();
                        let archivoNombre = idEmpresa + "-" + hoyformateado + ".png";
                        fs_1.default.writeFile((0, path_1.join)(__dirname, '/../public/img/productos/') + archivoNombre, base64Image, { encoding: 'base64' }, function (err) {
                        });
                        let insertar = yield conn.query("UPDATE Gen_Producto SET IdProductoCategoria =" + idProductoCategoria + " ,Producto = '" + producto + "', ProductoDesc = '" + productoDesc + "', PrecioContado = " + precioContado + ",Imagen = '" + archivoNombre + "'" +
                            " WHERE IdProducto =" + idProducto);
                        if (archivoAnterior != '' && archivoAnterior != null) {
                            fs_1.default.unlink((0, path_1.join)(__dirname, '/../public/img/productos/') + archivoAnterior, (err) => {
                            });
                        }
                        return res.json({ success: true });
                    }
                }
            }
            catch (error) {
                return res.json({ error });
            }
        }
        else {
            return res.json({ success: false, msg: 'No se proporcionaron datos de acceso anuncios', data: {} });
        }
    });
}
function ProductoAnular(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.body.IdProducto != undefined && req.body.Accion != undefined) {
            let idProducto = req.body.IdProducto;
            let accion = req.body.Accion;
            try {
                const conn = yield database.conexionObtener();
                const empresa = yield conn.query("SELECT Anulado,Producto FROM Gen_Producto WHERE IdProducto = " + idProducto + " LIMIT 1");
                let resultado = JSON.parse(JSON.stringify(empresa[0]));
                if (resultado.length > 0) {
                    let anulado = resultado[0].Anulado;
                    if (anulado != accion) {
                        let resultado1 = yield conn.query("UPDATE Gen_Producto SET  Anulado = " + accion + " WHERE IdProducto =" + idProducto);
                        return res.json({ success: true, msg: 'El Producto ' + (accion == 1 ? ' se anuló correctamente.' : ' se habilito correctamente.') });
                    }
                    else {
                        return res.json({ success: false, msg: 'Error, el Producto ya se actualizó anteriormente.' });
                    }
                }
                else {
                    return res.json({ success: false, msg: 'Producto no encontrado, no actualizado.' });
                }
            }
            catch (error) {
                return res.sendStatus(400).json({
                    msg: 'Error de proceso',
                    error: error
                });
            }
        }
        else {
            return res.sendStatus(400).json({
                msg: 'No se proporciono parametros correctos'
            });
        }
    });
}
function ProductosCategoriaAnular(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.body.IdProductoCategoria != undefined && req.body.Accion != undefined) {
            let idProductoCategoria = req.body.IdProductoCategoria;
            let accion = req.body.Accion;
            try {
                const conn = yield database.conexionObtener();
                const empresa = yield conn.query("SELECT Anulado,ProductoCategoria FROM Gen_ProductoCategoria WHERE IdProductoCategoria = " + idProductoCategoria + " LIMIT 1");
                let resultado = JSON.parse(JSON.stringify(empresa[0]));
                if (resultado.length > 0) {
                    let anulado = resultado[0].Anulado;
                    if (anulado != accion) {
                        let resultado1 = yield conn.query("UPDATE Gen_ProductoCategoria SET  Anulado = " + accion + " WHERE IdProductoCategoria =" + idProductoCategoria);
                        return res.json({ success: true, msg: 'La Categoría ' + (accion == 1 ? ' se anuló correctamente.' : ' se habilito correctamente.') });
                    }
                    else {
                        return res.json({ success: false, msg: 'Error, la categoría ya se actualizó anteriormente.' });
                    }
                }
                else {
                    return res.json({ success: false, msg: 'Categoría no encontrado, no actualizado.' });
                }
            }
            catch (error) {
                return res.sendStatus(400).json({
                    msg: 'Error de proceso',
                    error: error
                });
            }
        }
        else {
            return res.sendStatus(400).json({
                msg: 'No se proporciono parametros correctos'
            });
        }
    });
}
function ProductosCategoriaMostrar(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.body.IdProductoCategoria != undefined && req.body.Accion != undefined) {
            let idProductoCategoria = req.body.IdProductoCategoria;
            let accion = req.body.Accion;
            try {
                const conn = yield database.conexionObtener();
                const empresa = yield conn.query("SELECT MostrarDelivery,ProductoCategoria FROM Gen_ProductoCategoria WHERE IdProductoCategoria = " + idProductoCategoria + " LIMIT 1");
                let resultado = JSON.parse(JSON.stringify(empresa[0]));
                if (resultado.length > 0) {
                    let anulado = resultado[0].MostrarDelivery;
                    if (anulado != accion) {
                        let resultado1 = yield conn.query("UPDATE Gen_ProductoCategoria SET  MostrarDelivery = " + accion + " WHERE IdProductoCategoria =" + idProductoCategoria);
                        return res.json({ success: true, msg: 'La categoría ' + (accion == 1 ? ' se mostrará correctamente.' : ' se ocultó correctamente.') });
                    }
                    else {
                        return res.json({ success: false, msg: 'Error, la categoría ya se actualizó anteriormente.' });
                    }
                }
                else {
                    return res.json({ success: false, msg: 'Categoría no encontrado, no actualizado.' });
                }
            }
            catch (error) {
                return res.sendStatus(400).json({
                    msg: 'Error de proceso',
                    error: error
                });
            }
        }
        else {
            return res.sendStatus(400).json({
                msg: 'No se proporciono parametros correctos'
            });
        }
    });
}
function ProductosCategoriaOrden(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.body.IdProductoCategoria != undefined && req.body.Orden != undefined) {
            let idProductoCategoria = req.body.IdProductoCategoria;
            let orden = req.body.Orden;
            try {
                const conn = yield database.conexionObtener();
                const empresa = yield conn.query("SELECT IdProductoCategoria FROM Gen_ProductoCategoria WHERE IdProductoCategoria = " + idProductoCategoria + " LIMIT 1");
                let resultado = JSON.parse(JSON.stringify(empresa[0]));
                if (resultado.length > 0) {
                    let resultado1 = yield conn.query("UPDATE Gen_ProductoCategoria SET  Orden = " + orden + " WHERE IdProductoCategoria =" + idProductoCategoria);
                    return res.json({ success: true, msg: 'Orden de categoría actualizada' });
                }
                else {
                    return res.json({ success: false, msg: 'Categoría no encontrada, no actualizado.' });
                }
            }
            catch (error) {
                return res.sendStatus(400).json({
                    msg: 'Error de proceso',
                    error: error
                });
            }
        }
        else {
            return res.sendStatus(400).json({
                msg: 'No se proporciono parametros correctos'
            });
        }
    });
}
/* FIN CONTROLLADORES PRODUCTOS */
/* INICIO DE NOTIFICACIONES FCM */
function NotificacionesFcm(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.query.Tipo != undefined) {
            let tipo = '' + req.query.Tipo;
            let ubicacion = '' + req.query.Ubicacion;
            let idEmpresa = '' + req.query.IdEmpresa;
            let condicion = '';
            switch (tipo) {
                case '0': {
                    condicion = "";
                    break;
                }
                case '1': {
                    condicion = " WHERE Gen_NotificacionFcm.TipoFcm='GLOBAL' ";
                    break;
                }
                case '2': {
                    condicion = " WHERE Gen_NotificacionFcm.TipoFcm='ANUNCIO' ";
                    condicion += (ubicacion == "" ? "" : " AND Gen_NotificacionFcm.Topico ='" + ubicacion + "' ");
                    break;
                }
                case '3': {
                    condicion = " WHERE Gen_NotificacionFcm.TipoFcm='PROMOCION' ";
                    condicion += (ubicacion == "" ? "" : " AND Gen_NotificacionFcm.Topico ='" + ubicacion + "' ");
                    condicion += (idEmpresa == "0" ? "" : " AND Gen_NotificacionFcm.IdEmpresa =" + idEmpresa);
                    break;
                }
            }
            try {
                let conn = yield database.conexionObtener();
                let resultadoNotificacion = yield conn.query("SELECT Gen_NotificacionFcm.IdNotificacionFcm,Gen_NotificacionFcm.TipoFcm,Gen_NotificacionFcm.Topico,Gen_NotificacionFcm.IdEmpresa,Gen_NotificacionFcm.Titulo,Gen_NotificacionFcm.Msg," +
                    " DATE_FORMAT(Gen_NotificacionFcm.FechaEmision,'%Y-%m-%d %h:%i:%s') AS FechaEmision,Gen_NotificacionFcm.IdUsuarioReg,Gen_Empresa.RazonSocial,Seg_Usuario.NombreUsuario " +
                    " FROM Gen_NotificacionFcm LEFT JOIN Seg_Usuario ON Gen_NotificacionFcm.IdUsuarioReg = Seg_Usuario.IdUsuario LEFT JOIN Gen_Empresa ON Gen_NotificacionFcm.IdEmpresa = Gen_Empresa.IdEmpresa " + condicion);
                let resultadoNotificacionFinal = JSON.parse(JSON.stringify(resultadoNotificacion[0]));
                if (resultadoNotificacionFinal.length > 0) {
                    return res.json({ success: true, data: resultadoNotificacionFinal });
                }
                else {
                    return res.json({ success: false, msg: 'No existe notificaciones' });
                }
            }
            catch (error) {
                return res.sendStatus(400);
            }
        }
        else {
            return res.json({ success: false, msg: 'No se proporcionaron datos de acceso anuncios', data: {} });
        }
    });
}
function EnviarNuevaNotificacion(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.body.IdOpcion != undefined && req.body.Data != undefined) {
            let idEmpresa = req.body.Data.IdEmpresa;
            let topic = req.body.Data.Topico;
            let titulo = req.body.Data.Titulo;
            let msg = req.body.Data.Msg;
            let opcion = req.body.IdOpcion;
            let idUsuario = req.body.IdUsuario;
            try {
                switch (opcion) {
                    case 1: {
                        let respuesta = yield (0, fcm_1.NotificacionTopicoTodos)(titulo + '', msg + '');
                        const hoy = (0, moment_timezone_1.default)().tz("America/Lima");
                        moment_timezone_1.default.locale('es');
                        const hoyformateado = hoy.format('YYYY-MM-DD HH:mm:ss');
                        let conn = yield database.conexionObtener();
                        let insertar = yield conn.query("INSERT INTO Gen_NotificacionFcm(TipoFcm,Titulo,Msg,FechaEmision,IdUsuarioReg)" +
                            " VALUES ('GLOBAL','" + titulo + "','" + msg + "','" + hoyformateado + "'," + idUsuario + ")");
                        return res.json({ success: true });
                        break;
                    }
                    case 2: {
                        let respuesta = yield (0, fcm_1.NotificacionTopico)(topic + '', titulo + '', msg + '');
                        const hoy = (0, moment_timezone_1.default)().tz("America/Lima");
                        moment_timezone_1.default.locale('es');
                        const hoyformateado = hoy.format('YYYY-MM-DD HH:mm:ss');
                        let conn = yield database.conexionObtener();
                        let insertar = yield conn.query("INSERT INTO Gen_NotificacionFcm(TipoFcm,Topico,Titulo,Msg,FechaEmision,IdUsuarioReg)" +
                            " VALUES ('ANUNCIO','" + topic + "','" + titulo + "','" + msg + "','" + hoyformateado + "'," + idUsuario + ")");
                        return res.json({ success: true });
                        break;
                    }
                    case 3: {
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
                            let respuesta = yield (0, fcm_1.NotificacionTopicoPromo)(topic + '', titulo + '', msg + '', notificacionesFinales[0]);
                            const hoy = (0, moment_timezone_1.default)().tz("America/Lima");
                            moment_timezone_1.default.locale('es');
                            const hoyformateado = hoy.format('YYYY-MM-DD HH:mm:ss');
                            let conn = yield database.conexionObtener();
                            let insertar = yield conn.query("INSERT INTO Gen_NotificacionFcm(TipoFcm,Topico,IdEmpresa,Titulo,Msg,FechaEmision,IdUsuarioReg)" +
                                " VALUES ('PROMOCION','" + topic + "'," + idEmpresa + ",'" + titulo + "','" + msg + "','" + hoyformateado + "'," + idUsuario + ")");
                            return res.json({ success: true });
                        }
                        else {
                            return res.sendStatus(400);
                        }
                        break;
                    }
                    default:
                        return res.sendStatus(400);
                        break;
                }
            }
            catch (error) {
                return res.sendStatus(400);
            }
        }
        else {
            return res.sendStatus(400);
        }
    });
}
/* FIN DE NOTIFICACIONES FCM */
/* INICIO DE PEDIDOS */
function PedidosTotal(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.query.DepartamentoUbicacion != undefined) {
            let departamentoUbicacion = req.query.DepartamentoUbicacion;
            let serve = req.headers.host;
            let protocolo = req.protocol + "://";
            let servidor = protocolo + serve;
            let rutaAlmacenamiento = "/img/empresas/";
            let rutaFinal = servidor + rutaAlmacenamiento;
            try {
                let conn = yield database.conexionObtener();
                let resultadoPedido = yield conn.query("SELECT Gen_Pedido.*,CONCAT(Gen_Cliente.Nombres,' ',Gen_Cliente.Apellidos) AS Cliente, " +
                    " IF(ISNULL(Gen_Pedido.IdMotorizado), NULL, CONCAT(Gen_Motorizado.Nombres,' ',Gen_Motorizado.Apellidos)) AS Motorizado, Gen_Empresa.RazonSocial,Gen_Empresa.Direccion AS EmpresaDireccion,Gen_Empresa.DepartamentoUbicacion, " +
                    " Gen_Empresa.Latitud AS EmpresaLatitud, Gen_Empresa.Longitud AS EmpresaLongitud, Gen_Pedido.IdMotorizado,Gen_Pedido.IdCliente, Gen_Cliente.Telefono AS TelefonoCliente, Gen_Pedido.Referencia, DATE_FORMAT(Gen_Pedido.FechaReg, '%Y-%m-%d %H:%i:%s') AS FechaRegFormat, " +
                    " DetallePedidos.Productos,CONCAT('" + rutaFinal + "',Gen_Empresa.ImagenUrl) AS ImagenUrl FROM Gen_Pedido " +
                    " INNER JOIN Gen_Cliente ON Gen_Pedido.IdCliente = Gen_Cliente.IdCliente " +
                    " LEFT JOIN Gen_Motorizado ON Gen_Pedido.IdMotorizado = Gen_Motorizado.IdMotorizado " +
                    " INNER JOIN Gen_Empresa ON Gen_Pedido.IdEmpresa = Gen_Empresa.IdEmpresa " +
                    " LEFT JOIN (SELECT Gen_PedidoDet.IdPedido, " +
                    " CONCAT( '[', GROUP_CONCAT( CONCAT( '{ \"IdPedidoDet\":', Gen_PedidoDet.IdPedidoDet ,',\"IdPedido\":', Gen_PedidoDet.IdPedido , ',\"IdProducto\":',Gen_PedidoDet.IdProducto,',\"Producto\":\"',Gen_PedidoDet.Producto,'\",\"Descripcion\":\"',Gen_PedidoDet.Descripcion,'\",\"Cantidad\":', Gen_PedidoDet.Cantidad, ',\"ProductoImagenUrl\":\"',Gen_PedidoDet.ProductoImagenUrl,'\",\"Indicacion\":\"',Gen_PedidoDet.Indicacion,'\",\"Precio\":',Gen_PedidoDet.Precio,' }' ) SEPARATOR ', '), ']' ) AS Productos FROM Gen_PedidoDet GROUP BY Gen_PedidoDet.IdPedido )  AS DetallePedidos ON DetallePedidos.IdPedido = Gen_Pedido.IdPedido " +
                    " WHERE (Gen_Pedido.Estado <> 'F' AND Gen_Pedido.Estado <> 'C') AND Gen_Empresa.DepartamentoUbicacion like '%" + departamentoUbicacion + "' ORDER BY Gen_Pedido.FechaReg ASC ");
                let resultadofinalPedido = JSON.parse(JSON.stringify(resultadoPedido[0]));
                if (resultadofinalPedido.length > 0) {
                    return res.json({ success: true, data: resultadofinalPedido });
                }
                else {
                    return res.json({ success: false, msg: 'No existe ningun pedido' });
                }
            }
            catch (error) {
                return res.sendStatus(400);
            }
        }
        else {
            return res.sendStatus(400);
        }
    });
}
function ReportePedidos(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.query.IdEmpresa != undefined && req.query.Estado != undefined && req.query.FechaInicio != undefined
            && req.query.FechaFin != undefined) {
            let idEmpresa = req.query.IdEmpresa;
            let estado = '' + req.query.Estado;
            let fechaInicio = req.query.FechaInicio;
            let fechaFin = req.query.FechaFin;
            let condicion = '';
            switch (estado) {
                case '0':
                    condicion = " AND (Gen_Pedido.Estado = 'F' OR Gen_Pedido.Estado = 'C')";
                    break;
                case '1':
                    condicion = " AND Gen_Pedido.Estado = 'F' ";
                    break;
                case '2':
                    condicion = " AND Gen_Pedido.Estado = 'C' ";
                    break;
                default:
                    break;
            }
            try {
                let conn = yield database.conexionObtener();
                let resultadoPedido = yield conn.query("SELECT Gen_Pedido.*,CONCAT(Gen_Cliente.Nombres,' ',Gen_Cliente.Apellidos) AS Cliente, " +
                    " IF(ISNULL(Gen_Pedido.IdMotorizado), NULL, CONCAT(Gen_Motorizado.Nombres,' ',Gen_Motorizado.Apellidos)) AS Motorizado, Gen_Empresa.RazonSocial,Gen_Empresa.Direccion AS EmpresaDireccion,Gen_Empresa.DepartamentoUbicacion, " +
                    " Gen_Empresa.Latitud AS EmpresaLatitud, Gen_Empresa.Longitud AS EmpresaLongitud, Gen_Pedido.IdMotorizado,Gen_Pedido.IdCliente, Gen_Cliente.Telefono AS TelefonoCliente, Gen_Pedido.Referencia, DATE_FORMAT(Gen_Pedido.FechaReg, '%Y-%m-%d %H:%i:%s') AS FechaRegFormat, " +
                    " DetallePedidos.Productos FROM Gen_Pedido " +
                    " INNER JOIN Gen_Cliente ON Gen_Pedido.IdCliente = Gen_Cliente.IdCliente " +
                    " LEFT JOIN Gen_Motorizado ON Gen_Pedido.IdMotorizado = Gen_Motorizado.IdMotorizado " +
                    " INNER JOIN Gen_Empresa ON Gen_Pedido.IdEmpresa = Gen_Empresa.IdEmpresa " +
                    " LEFT JOIN (SELECT Gen_PedidoDet.IdPedido, " +
                    " CONCAT( '[', GROUP_CONCAT( CONCAT( '{ \"IdPedidoDet\":', Gen_PedidoDet.IdPedidoDet ,',\"IdPedido\":', Gen_PedidoDet.IdPedido , ',\"IdProducto\":',Gen_PedidoDet.IdProducto,',\"Producto\":\"',Gen_PedidoDet.Producto,'\",\"Descripcion\":\"',Gen_PedidoDet.Descripcion,'\",\"Cantidad\":', Gen_PedidoDet.Cantidad, ',\"ProductoImagenUrl\":\"',Gen_PedidoDet.ProductoImagenUrl,'\",\"Indicacion\":\"',Gen_PedidoDet.Indicacion,'\",\"Precio\":',Gen_PedidoDet.Precio,' }' ) SEPARATOR ', '), ']' ) AS Productos FROM Gen_PedidoDet GROUP BY Gen_PedidoDet.IdPedido )  AS DetallePedidos ON DetallePedidos.IdPedido = Gen_Pedido.IdPedido " +
                    " WHERE Gen_Empresa.IdEmpresa =" + idEmpresa + " " + condicion + " AND Gen_Pedido.FechaReg BETWEEN '" + fechaInicio + " 00:00:00' AND '" + fechaFin + " 23:59:59' ORDER BY Gen_Pedido.FechaReg ASC ");
                let resultadofinalPedido = JSON.parse(JSON.stringify(resultadoPedido[0]));
                if (resultadofinalPedido.length > 0) {
                    return res.json({ success: true, data: resultadofinalPedido });
                }
                else {
                    return res.json({ success: false, msg: 'No existe ningun pedido' });
                }
            }
            catch (error) {
                return res.sendStatus(400);
            }
        }
        else {
            return res.sendStatus(400);
        }
    });
}
/* FIN PEDIDOS*/
/*
export async function Empresa(req: Request, res: Response): Promise<Response> {
    if(req.query.IdEmpresa != undefined){
        let idEmpresa = req.query.IdEmpresa;
        try {
            let conn = await database.conexionObtener();
            let resultadoEmpresa = await conn.query("SELECT * FROM Gen_Empresa WHERE IdEmpresa = "+idEmpresa);
            let resultadoEmpresaFinal = JSON.parse(JSON.stringify(resultadoEmpresa[0]));
    
            if (resultadoEmpresaFinal.length > 0) {
                   
                return res.json({ success: true, data:resultadoEmpresaFinal[0] });
    
            } else {
    
                return res.json({ success: false, msg:'No existe empresa' });
    
            }
    
        } catch (error) {
            return res.sendStatus(400);
        }
    }else{
        return res.json({ success: false, msg:'No se proporcionaron datos de acceso', data:{} });
    }
}


export async function EmpresaDepartamento(req: Request, res: Response): Promise<Response> {
    try {
        let conn = await database.conexionObtener();
        let resultadoEmpresa = await conn.query("SELECT DISTINCT DepartamentoUbicacion FROM Gen_Empresa");
        let resultadoEmpresaFinal = JSON.parse(JSON.stringify(resultadoEmpresa[0]));

        if (resultadoEmpresaFinal.length > 0) {
                
            return res.json({ success: true, data:resultadoEmpresaFinal });

        } else {

            return res.json({ success: false, msg:'No existe departamentos' });

        }

    } catch (error) {
        return res.sendStatus(400);
    }

}

export async function EmpresaDistrito(req: Request, res: Response): Promise<Response> {

    try {
        let conn = await database.conexionObtener();
        let resultadoEmpresa = await conn.query("SELECT DISTINCT DistritoUbicacion FROM Gen_Empresa");
        let resultadoEmpresaFinal = JSON.parse(JSON.stringify(resultadoEmpresa[0]));

        if (resultadoEmpresaFinal.length > 0) {
                
            return res.json({ success: true, data:resultadoEmpresaFinal });

        } else {

            return res.json({ success: false, msg:'No existe empresa' });

        }

    } catch (error) {
        return res.sendStatus(400);
    }
}


export async function EmpresaConfig(req: Request, res: Response): Promise<Response> {
    if(req.query.IdEmpresa != undefined){
    let idEmpresa = req.query.IdEmpresa;
        try {
            let conn = await database.conexionObtener();
            let resultadoEmpresa = await conn.query("SELECT PrecioDelivery,HabilitadoPedido,KmArea,PrecioKm FROM Gen_Empresa WHERE IdEmpresa="+idEmpresa);
            let resultadoEmpresaFinal = JSON.parse(JSON.stringify(resultadoEmpresa[0]));

            if (resultadoEmpresaFinal.length > 0) {
                    
                return res.json({ success: true, data:resultadoEmpresaFinal[0] });

            } else {

                return res.json({ success: false, msg:'No existe empresa' });

            }

        } catch (error) {
            return res.sendStatus(400);
        }

    }else{
        return res.sendStatus(400);
    }
}


export async function ClienteAnuncios(req: Request, res: Response): Promise<Response> {
    if(req.query.Departamento != undefined){
        let departamento = req.query.Departamento;
        try {
            let conn = await database.conexionObtener();
            let resultadoAnuncios = await conn.query("SELECT * FROM Gen_Anuncio WHERE Anulado = 0 AND Departamento='"+departamento+"' ORDER BY Orden ASC ");
            let resultadoAnunciosFinal = JSON.parse(JSON.stringify(resultadoAnuncios[0]));

            if (resultadoAnunciosFinal.length > 0) {
                    
                return res.json({ success: true, data:resultadoAnunciosFinal });

            } else {

                return res.json({ success: false, msg:'No existe anuncios' });

            }

        } catch (error) {
            return res.sendStatus(400);
        }
    }else{
        return res.sendStatus(400);
    }
}

export async function CategoriasEmpresa(req: Request, res: Response): Promise<Response> {

    try {
        let conn = await database.conexionObtener();
        let resultadoEmpresa = await conn.query("SELECT * FROM Gen_EmpresaCategoria WHERE Anulado = 0 ORDER BY Orden ASC");
        let resultadoEmpresaFinal = JSON.parse(JSON.stringify(resultadoEmpresa[0]));

        if (resultadoEmpresaFinal.length > 0) {
                
            return res.json({ success: true, data:resultadoEmpresaFinal });

        } else {

            return res.json({ success: false, msg:'No hay categorias' });

        }

    } catch (error) {
        return res.sendStatus(400);
    }
}
*/ 
