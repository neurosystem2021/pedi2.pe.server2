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
exports.ClientesLista = void 0;
const database_1 = __importDefault(require("../classes/database"));
const database = database_1.default.instance;
class ClientesLista {
    constructor() {
        this.listaCliente = [];
    }
    addCliente(Cliente) {
        return __awaiter(this, void 0, void 0, function* () {
            this.listaCliente.push(Cliente);
            if (Cliente.tokenFcm != '') {
                try {
                    let conn = yield database.conexionObtener();
                    yield conn.query("UPDATE Gen_Cliente SET TokenFcm ='" + Cliente.tokenFcm + "' WHERE IdCliente = " + Cliente.iddb);
                }
                catch (error) {
                }
            }
        });
    }
    getListaCliente() {
        return this.listaCliente;
    }
    getCliente(id) {
        return this.listaCliente.find((cliente) => cliente.idws === id);
    }
    getClienteIdWs(idws) {
        return this.listaCliente.find((cliente) => cliente.idws === idws);
    }
    getClienteIdDb(iddb) {
        return this.listaCliente.find((cliente) => cliente.iddb === iddb);
    }
    existeCliente(iddb) {
        return this.listaCliente.some((cliente) => cliente.iddb === iddb);
    }
    //Borrar un usuario
    deleteCliente(idws) {
        let objIndex = this.listaCliente.findIndex((cliente) => cliente.idws === idws);
        if (objIndex !== -1) {
            this.listaCliente.splice(objIndex, 1);
        }
    }
}
exports.ClientesLista = ClientesLista;
