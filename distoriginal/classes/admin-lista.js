"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminLista = void 0;
class AdminLista {
    constructor() {
        this.listaAdmin = [];
    }
    addAdmin(Admin) {
        this.listaAdmin.push(Admin);
    }
    getListaAdmin() {
        return this.listaAdmin;
    }
    getAdmin(id) {
        return this.listaAdmin.find((admin) => admin.idws === id);
    }
    getAdminIdWs(idws) {
        return this.listaAdmin.find((admin) => admin.idws === idws);
    }
    getAdminIdDb(iddb) {
        return this.listaAdmin.find((admin) => admin.iddb === iddb);
    }
    existeAdmin(iddb) {
        return this.listaAdmin.some((admin) => admin.iddb === iddb);
    }
    //Borrar un usuario
    deleteAdmin(idws) {
        let objIndex = this.listaAdmin.findIndex((admin) => admin.idws === idws);
        if (objIndex !== -1) {
            this.listaAdmin.splice(objIndex, 1);
        }
    }
}
exports.AdminLista = AdminLista;
