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
exports.obtenerPedidos = exports.obtenerEstado = exports.cambiarEstado = void 0;
const database_1 = __importDefault(require("../classes/database"));
const database = database_1.default.instance;
const cambiarEstado = (celular, idpedido, estado) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conn = yield database.conexionObtener();
        let resultado1 = yield conn.query("UPDATE pedidos SET estado ='" + estado + "' " +
            " WHERE idpedidos = '" + idpedido + "' AND cliente='" + celular + "'");
    }
    catch (error) {
    }
});
exports.cambiarEstado = cambiarEstado;
const obtenerEstado = (idCliente) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let conn = yield database.conexionObtener();
        let resultado = yield conn.query("SELECT Gen_Pedido.Estado FROM Gen_Pedido WHERE Gen_Pedido.IdCliente=" + idCliente + "  AND (Gen_Pedido.Estado <> 'F' AND Gen_Pedido.Estado <> 'C') LIMIT 1");
        let resultadofinal = JSON.parse(JSON.stringify(resultado[0]));
        if (resultadofinal.length > 0) {
            return resultadofinal[0].estado;
        }
        else {
            return null;
        }
    }
    catch (error) {
        return null;
    }
});
exports.obtenerEstado = obtenerEstado;
//consulta web
const obtenerPedidos = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let conn = yield database.conexionObtener();
        const pedidos = yield conn.query("SELECT p.idpedidos as idpedido,p.estado,p.cliente,CONCAT(c.apellidos,' ',c.nombres) AS cliente_nombre," +
            "p.motorizado,CONCAT(m.apellidos,' ',m.nombres) AS motorizado_nombre,p.precio_productos,p.precio_delivery,p.ubi_lat,p.ubi_lon,p.fecha,(p.precio_productos+p.precio_delivery) AS total " +
            " FROM pedidos p INNER JOIN cliente c ON p.cliente=c.celular LEFT JOIN motorizados m ON p.motorizado=m.dni WHERE (p.estado <> 'F' AND p.estado <> 'C')");
        let pedidosfinal = JSON.parse(JSON.stringify(pedidos[0]));
        if (pedidosfinal.length > 0) {
            return pedidosfinal;
        }
        else {
            return [];
        }
    }
    catch (error) {
        return [];
    }
});
exports.obtenerPedidos = obtenerPedidos;
