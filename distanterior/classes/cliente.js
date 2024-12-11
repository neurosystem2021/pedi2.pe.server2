"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cliente = void 0;
class Cliente {
    constructor(idws, iddb, nombres, apellidos, tokenFcm) {
        this.idws = idws;
        this.iddb = iddb;
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.tokenFcm = tokenFcm;
    }
}
exports.Cliente = Cliente;
