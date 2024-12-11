"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuariosLista = void 0;
class UsuariosLista {
    constructor() {
        this.lista = [];
    }
    //Agregar un usuario
    agregar(usuario) {
        this.lista.push(usuario);
        return usuario;
    }
    addUsuario(usuario) {
        this.lista.push(usuario);
    }
    //obtener lista de usuarios
    getLista() {
        return this.lista;
    }
    getUsuario(id) {
        return this.lista.find((usuario) => usuario.idws === id);
    }
    getUsuarioCelular(celular) {
        return this.lista.find((usuario) => usuario.iddb === celular);
    }
    getUsuarioIdWs(idws) {
        return this.lista.find((usuario) => usuario.idws === idws);
    }
    getUsuarioIdDb(iddb) {
        return this.lista.find((usuario) => usuario.iddb === iddb);
    }
    existeUsuario(iddb, tipo) {
        return this.lista.some((usuario) => usuario.iddb === iddb && usuario.tipo === tipo);
    }
    //Borrar un usuario
    borrarUsuario(idws) {
        let objIndex = this.lista.findIndex((usuario) => usuario.idws === idws);
        if (objIndex !== -1) {
            this.lista.splice(objIndex, 1);
        }
    }
    actualizarCoordMotorizado(iddb, lat, lon, empresas) {
        let objIndex = this.lista.findIndex((usuario) => usuario.iddb === iddb && usuario.tipo == 'MOTORIZADO');
        if (objIndex !== -1) {
            this.lista[objIndex].lat = lat;
            this.lista[objIndex].lon = lon;
            this.lista[objIndex].empresasMotorizado = empresas;
            return this.lista[objIndex];
        }
        else {
            return null;
        }
    }
}
exports.UsuariosLista = UsuariosLista;
