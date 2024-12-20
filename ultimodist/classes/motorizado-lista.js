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
exports.MotorizadosLista = void 0;
const database_1 = __importDefault(require("../classes/database"));
const database = database_1.default.instance;
class MotorizadosLista {
    constructor() {
        this.listaMotorizado = [];
    }
    addMotorizado(motorizado) {
        return __awaiter(this, void 0, void 0, function* () {
            this.listaMotorizado.push(motorizado);
            if (motorizado.tokenFcm != '') {
                try {
                    let conn = yield database.conexionObtener();
                    yield conn.query("UPDATE Gen_Motorizado SET TokenFcm ='" + motorizado.tokenFcm + "' WHERE IdMotorizado = " + motorizado.iddb);
                }
                catch (error) {
                }
            }
        });
    }
    getListaMotorizado() {
        return this.listaMotorizado;
    }
    getMotorizado(id) {
        return this.listaMotorizado.find((motorizado) => motorizado.idws === id);
    }
    getMotorizadoIdWs(idws) {
        return this.listaMotorizado.find((motorizado) => motorizado.idws === idws);
    }
    getMotorizadoIdDb(iddb) {
        return this.listaMotorizado.find((motorizado) => motorizado.iddb === iddb);
    }
    existeMotorizado(iddb) {
        return this.listaMotorizado.some((motorizado) => motorizado.iddb === iddb);
    }
    //Borrar un usuario
    deleteMotorizado(idws) {
        let objIndex = this.listaMotorizado.findIndex((motorizado) => motorizado.idws === idws);
        if (objIndex !== -1) {
            this.listaMotorizado.splice(objIndex, 1);
        }
    }
    actualizarCoordMotorizado(iddb, lat, lon, empresas, idregion) {
        let objIndex = this.listaMotorizado.findIndex((m) => m.iddb === iddb);
        if (objIndex !== -1) {
            this.listaMotorizado[objIndex].lat = lat;
            this.listaMotorizado[objIndex].lon = lon;
            this.listaMotorizado[objIndex].empresasMotorizado = empresas;
            this.listaMotorizado[objIndex].idregion = idregion;
            return this.listaMotorizado[objIndex];
        }
        else {
            return null;
        }
    }
}
exports.MotorizadosLista = MotorizadosLista;
