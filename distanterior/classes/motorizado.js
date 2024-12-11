"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Motorizado = void 0;
class Motorizado {
    constructor(idws, iddb, nombres, apellidos, tokenFcm, lat = 0, lon = 0, empresasMotorizado = [], idRegion = 0) {
        this.idregion = 0;
        this.idws = idws;
        this.iddb = iddb;
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.tokenFcm = tokenFcm;
        this.lat = lat;
        this.lon = lon;
        this.empresasMotorizado = empresasMotorizado;
        this.idregion = idRegion;
    }
}
exports.Motorizado = Motorizado;
