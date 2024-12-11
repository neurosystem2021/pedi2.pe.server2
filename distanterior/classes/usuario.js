"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usuario = void 0;
class Usuario {
    constructor(idws, iddb, tipo, urlPlat, lat = 0, lon = 0, empresasMotorizado = []) {
        this.idws = idws;
        this.iddb = iddb;
        this.tipo = tipo;
        this.urlPlat = urlPlat;
        this.lat = lat;
        this.lon = lon;
        this.empresasMotorizado = empresasMotorizado;
    }
}
exports.Usuario = Usuario;
