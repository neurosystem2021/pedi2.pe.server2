"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlataformasLista = void 0;
class PlataformasLista {
    constructor() {
        this.listaPlataforma = [];
    }
    addPlataforma(Plataforma) {
        this.listaPlataforma.push(Plataforma);
    }
    getListaPlataforma() {
        return this.listaPlataforma;
    }
    getPlataforma(id) {
        return this.listaPlataforma.find((plataforma) => plataforma.idws === id);
    }
    getPlataformaIdWs(idws) {
        return this.listaPlataforma.find((plataforma) => plataforma.idws === idws);
    }
    getPlataformaIdDb(iddb) {
        return this.listaPlataforma.find((plataforma) => plataforma.iddb === iddb);
    }
    existePlataforma(iddb) {
        return this.listaPlataforma.some((plataforma) => plataforma.iddb === iddb);
    }
    //Borrar un usuario
    deletePlataforma(idws) {
        let objIndex = this.listaPlataforma.findIndex((plataforma) => plataforma.idws === idws);
        if (objIndex !== -1) {
            this.listaPlataforma.splice(objIndex, 1);
        }
    }
}
exports.PlataformasLista = PlataformasLista;
