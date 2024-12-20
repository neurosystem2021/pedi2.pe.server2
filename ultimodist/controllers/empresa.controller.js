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
exports.Empresas = Empresas;
exports.Empresa = Empresa;
exports.EmpresaCategorias = EmpresaCategorias;
exports.EmpresaProductos = EmpresaProductos;
exports.EmpresaConsultaSistema = EmpresaConsultaSistema;
exports.EmpresaDepartamento = EmpresaDepartamento;
exports.EmpresaDistrito = EmpresaDistrito;
exports.EmpresaConfig = EmpresaConfig;
exports.ClienteAnuncios = ClienteAnuncios;
exports.CategoriasEmpresa = CategoriasEmpresa;
exports.EmpresasDirecta = EmpresasDirecta;
const database_1 = __importDefault(require("../classes/database"));
const database = database_1.default.instance;
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
                let resultadoEmpresa = yield conn.query("SELECT Gen_Empresa.*,CONCAT('" + rutaFinal + "',Gen_Empresa.ImagenUrl) AS ImagenUrl,Gen_EmpresaSubCategoria.SubCategoria, Gen_EmpresaSubCategoria.ImagenUrlSubCate FROM Gen_Empresa " +
                    " INNER JOIN Gen_EmpresaSubCategoria ON Gen_Empresa.IdEmpresaSubCategoria=Gen_EmpresaSubCategoria.IdEmpresaSubCategoria " +
                    " WHERE Gen_Empresa.IdEmpresaCategoria=" + idCategoria + " AND Gen_Empresa.Anulado = 0 AND Gen_Empresa.DepartamentoUbicacion='" + departamento + "' " +
                    " AND Gen_Empresa.RazonSocial LIKE '%" + busqueda + "%'");
                let resultadoEmpresaFinal = JSON.parse(JSON.stringify(resultadoEmpresa[0]));
                if (resultadoEmpresaFinal.length > 0) {
                    return res.json({ success: true, data: resultadoEmpresaFinal });
                }
                else {
                    return res.json({ success: false, msg: 'No existe empresas' });
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
function Empresa(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.query.IdEmpresa != undefined) {
            let idEmpresa = req.query.IdEmpresa;
            try {
                let conn = yield database.conexionObtener();
                let resultadoEmpresa = yield conn.query("SELECT * FROM Gen_Empresa WHERE IdEmpresa = " + idEmpresa);
                let resultadoEmpresaFinal = JSON.parse(JSON.stringify(resultadoEmpresa[0]));
                if (resultadoEmpresaFinal.length > 0) {
                    return res.json({ success: true, data: resultadoEmpresaFinal[0] });
                }
                else {
                    return res.json({ success: false, msg: 'No existe empresa' });
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
function EmpresaCategorias(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.query.IdEmpresa != undefined) {
            let idEmpresa = req.query.IdEmpresa;
            try {
                let conn = yield database.conexionObtener();
                let resultadoEmpresa = yield conn.query("SELECT Gen_ProductoCategoria.IdProductoCategoria, Gen_ProductoCategoria.ProductoCategoria" +
                    " FROM Gen_ProductoCategoria WHERE Anulado <> 1 AND Gen_ProductoCategoria.IdEmpresa=" + idEmpresa + " AND MostrarDelivery=1 ORDER BY Orden ASC ");
                let resultadoEmpresaFinal = JSON.parse(JSON.stringify(resultadoEmpresa[0]));
                if (resultadoEmpresaFinal.length > 0) {
                    return res.json(resultadoEmpresaFinal);
                }
                else {
                    return res.json([]);
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
function EmpresaProductos(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.query.IdProductoCategoria != undefined) {
            let idProductoCategoria = req.query.IdProductoCategoria;
            try {
                let serve = req.headers.host;
                let protocolo = req.protocol + "://";
                let servidor = protocolo + serve;
                let rutaAlmacenamiento = "/img/productos/";
                let rutaFinal = servidor + rutaAlmacenamiento;
                let conn = yield database.conexionObtener();
                let resultadoEmpresa = yield conn.query("SELECT Gen_Producto.IdProducto,CONCAT('" + rutaFinal + "',Gen_Producto.Imagen) AS Imagen,Gen_Producto.PrecioContado,Gen_Producto.Producto " +
                    " FROM Gen_Producto INNER JOIN Gen_ProductoCategoria ON Gen_Producto.IdProductoCategoria = Gen_ProductoCategoria.IdProductoCategoria " +
                    " WHERE Gen_Producto.Anulado <> 1 AND Gen_Producto.PrecioContado > 0 AND Gen_ProductoCategoria.IdProductoCategoria = " + idProductoCategoria);
                let resultadoEmpresaFinal = JSON.parse(JSON.stringify(resultadoEmpresa[0]));
                return res.json(resultadoEmpresaFinal.length > 0 ? resultadoEmpresaFinal : []);
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
function EmpresaConsultaSistema(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.query.IdEmpresa != undefined) {
            let idEmpresa = req.query.IdEmpresa;
            try {
                let serve = req.headers.host;
                let protocolo = req.protocol + "://";
                let servidor = protocolo + serve;
                let conn = yield database.conexionObtener();
                let resultadoEmpresa = yield conn.query("SELECT TieneSistema,FacturaUrl FROM Gen_Empresa WHERE IdEmpresa =" + idEmpresa);
                let resultadoEmpresaFinal = JSON.parse(JSON.stringify(resultadoEmpresa[0]));
                if (resultadoEmpresaFinal.length > 0) {
                    let sistema = resultadoEmpresaFinal[0].TieneSistema;
                    return res.json({ success: true, data: sistema, url: sistema == 1 ? resultadoEmpresaFinal[0].FacturaUrl : servidor });
                }
                else {
                    return res.json({ success: false, msg: 'No existe empresa' });
                }
            }
            catch (error) {
                return res.sendStatus(400);
            }
        }
        else {
            return res.json({ success: false, msg: 'No se proporcionaron datos de acceso', data: [] });
        }
    });
}
function EmpresaDepartamento(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let conn = yield database.conexionObtener();
            let resultadoEmpresa = yield conn.query("SELECT DISTINCT DepartamentoUbicacion FROM Gen_Empresa");
            let resultadoEmpresaFinal = JSON.parse(JSON.stringify(resultadoEmpresa[0]));
            if (resultadoEmpresaFinal.length > 0) {
                return res.json({ success: true, data: resultadoEmpresaFinal });
            }
            else {
                return res.json({ success: false, msg: 'No existe departamentos' });
            }
        }
        catch (error) {
            return res.sendStatus(400);
        }
    });
}
function EmpresaDistrito(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let conn = yield database.conexionObtener();
            let resultadoEmpresa = yield conn.query("SELECT DISTINCT DistritoUbicacion FROM Gen_Empresa");
            let resultadoEmpresaFinal = JSON.parse(JSON.stringify(resultadoEmpresa[0]));
            if (resultadoEmpresaFinal.length > 0) {
                return res.json({ success: true, data: resultadoEmpresaFinal });
            }
            else {
                return res.json({ success: false, msg: 'No existe empresa' });
            }
        }
        catch (error) {
            return res.sendStatus(400);
        }
    });
}
function EmpresaConfig(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.query.IdEmpresa != undefined) {
            let idEmpresa = req.query.IdEmpresa;
            try {
                let conn = yield database.conexionObtener();
                let resultadoEmpresa = yield conn.query("SELECT PrecioDelivery,HabilitadoPedido,KmArea,PrecioKm,TieneSistema,IdRegion FROM Gen_Empresa WHERE IdEmpresa=" + idEmpresa);
                let resultadoEmpresaFinal = JSON.parse(JSON.stringify(resultadoEmpresa[0]));
                if (resultadoEmpresaFinal.length > 0) {
                    return res.json({ success: true, data: resultadoEmpresaFinal[0] });
                }
                else {
                    return res.json({ success: false, msg: 'No existe empresa' });
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
function ClienteAnuncios(req, res) {
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
                let resultadoAnuncios = yield conn.query("SELECT IdAnuncio,Empresa,Nombre,Descripcion,CONCAT('" + rutaFinal + "',ImagenUrl) AS ImagenUrl,Departamento,FechaInicio,FechaFin,Orden,Anulado FROM Gen_Anuncio WHERE Anulado = 0 AND Departamento='" + departamento + "' ORDER BY Orden ASC ");
                let resultadoAnunciosFinal = JSON.parse(JSON.stringify(resultadoAnuncios[0]));
                if (resultadoAnunciosFinal.length > 0) {
                    return res.json({ success: true, data: resultadoAnunciosFinal });
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
            return res.sendStatus(400);
        }
    });
}
function CategoriasEmpresa(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let conn = yield database.conexionObtener();
            let resultadoEmpresa = yield conn.query("SELECT * FROM Gen_EmpresaCategoria WHERE Anulado = 0 ORDER BY Orden ASC");
            let resultadoEmpresaFinal = JSON.parse(JSON.stringify(resultadoEmpresa[0]));
            if (resultadoEmpresaFinal.length > 0) {
                return res.json({ success: true, data: resultadoEmpresaFinal });
            }
            else {
                return res.json({ success: false, msg: 'No hay categorias' });
            }
        }
        catch (error) {
            return res.sendStatus(400);
        }
    });
}
function EmpresasDirecta(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.query.IdCategoria != undefined && req.query.Departamento != undefined) {
            let idCategoria = req.query.IdCategoria;
            let departamento = req.query.Departamento;
            let serve = req.headers.host;
            let protocolo = req.protocol + "://";
            let servidor = protocolo + serve;
            let rutaAlmacenamiento = "/img/empresas/";
            let rutaFinal = servidor + rutaAlmacenamiento;
            try {
                let conn = yield database.conexionObtener();
                let resultadoEmpresa = yield conn.query("SELECT Gen_Empresa.*,CONCAT('" + rutaFinal + "',Gen_Empresa.ImagenUrl) AS ImagenUrl, Gen_EmpresaSubCategoria.SubCategoria FROM Gen_Empresa " +
                    " INNER JOIN Gen_EmpresaSubCategoria ON Gen_Empresa.IdEmpresaSubCategoria=Gen_EmpresaSubCategoria.IdEmpresaSubCategoria  WHERE Gen_Empresa.Anulado = 0 AND Gen_Empresa.MostrarDirecto = 1 AND Gen_Empresa.IdEmpresaCategoria = " + idCategoria + " AND Gen_Empresa.DepartamentoUbicacion='" + departamento + "'");
                let resultadoEmpresaFinal = JSON.parse(JSON.stringify(resultadoEmpresa[0]));
                if (resultadoEmpresaFinal.length > 0) {
                    return res.json({ success: true, data: resultadoEmpresaFinal[0] });
                }
                else {
                    return res.json({ success: false, msg: 'No hay empresas directa' });
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
