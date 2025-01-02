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
exports.getProductos = getProductos;
exports.getPromociones = getPromociones;
const database_1 = __importDefault(require("../classes/database"));
const database = database_1.default.instance;
function getProductos(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.header('APP-Signature') != undefined) {
            if (req.header('APP-Signature') == 'renzo') {
                let ruc = req.params.ruc;
                let serve = req.headers.host;
                let protocolo = "https://";
                let servidor = protocolo + serve;
                try {
                    const conn = yield database.conexionObtener();
                    const productos = yield conn.query("SELECT p.id,p.empresa_ruc,e.razon_social AS empresa_razon_social,p.nombre,p.descripcion,p.categoria_menu,CONCAT('" + servidor + "',p.url_imagen) as url_imagen,p.precio_unitario, p.ranking,TIME_FORMAT(e.horario_inicio, '%H:%i') AS horario_inicio,TIME_FORMAT(e.horario_fin, '%H:%i') AS horario_fin FROM producto p INNER JOIN empresa e ON p.empresa_ruc=e.ruc WHERE p.empresa_ruc='" + ruc + "' AND p.estado='A' AND p.tipo='n'");
                    if (JSON.parse(JSON.stringify(productos[0])).length > 0) {
                        return res.json(productos[0]);
                    }
                    else {
                        return res.json({ success: false });
                    }
                }
                catch (error) {
                    return res.sendStatus(400);
                }
            }
            else {
                return res.sendStatus(400);
            }
        }
        else {
            return res.sendStatus(400);
        }
    });
}
function getPromociones(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.header('APP-Signature') != undefined && req.body.code != undefined) {
            if (req.header('APP-Signature') == 'renzo') {
                let serve = req.headers.host;
                let protocolo = "https://";
                let servidor = protocolo + serve;
                try {
                    const conn = yield database.conexionObtener();
                    const productos = yield conn.query("SELECT p.id,p.empresa_ruc,e.razon_social AS empresa_razon_social,p.nombre,p.descripcion,p.categoria_menu,CONCAT('" + servidor + "',p.url_imagen) as url_imagen,p.precio_unitario, p.ranking,TIME_FORMAT(e.horario_inicio, '%H:%i') AS horario_inicio,TIME_FORMAT(e.horario_fin, '%H:%i') AS horario_fin,p.fecha_inicio,p.fecha_fin FROM producto p INNER JOIN empresa e ON p.empresa_ruc=e.ruc  AND p.estado='A' AND p.tipo='p' AND e.estado='A' AND CURDATE() BETWEEN p.fecha_inicio AND p.fecha_fin");
                    if (JSON.parse(JSON.stringify(productos[0])).length > 0) {
                        return res.json(productos[0]);
                    }
                    else {
                        return res.json({ success: false });
                    }
                }
                catch (error) {
                    return res.sendStatus(400);
                }
            }
            else {
                return res.sendStatus(400);
            }
        }
        else {
            return res.sendStatus(400);
        }
    });
}
