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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObtenerCoordenadasMotorizado = exports.motoriazadosOnlineAdmin = exports.motorizadosOnlinePlataforma = exports.estadoPedidoAdmin = exports.estadoPedidoPlataforma = exports.ubicacionMotorizado = exports.estadoPedidoCambio = exports.mensajeChat = exports.nuevoViaje = exports.pedidoNuevo = exports.pedidoCancelado = exports.desconectar = exports.conectar = exports.adminsConectados = exports.plataformasConectados = exports.clientesConectados = exports.motorizadosConectados = exports.usuariosConectados = void 0;
const usuario_lista_1 = require("../classes/usuario-lista");
const plataforma_lista_1 = require("../classes/plataforma-lista");
const cliente_lista_1 = require("../classes/cliente-lista");
const motorizado_lista_1 = require("../classes/motorizado-lista");
const admin_lista_1 = require("../classes/admin-lista");
const motorizado_1 = require("../classes/motorizado");
const cliente_1 = require("../classes/cliente");
const plataforma_1 = require("../classes/plataforma");
const admin_1 = require("../classes/admin");
exports.usuariosConectados = new usuario_lista_1.UsuariosLista();
exports.motorizadosConectados = new motorizado_lista_1.MotorizadosLista();
exports.clientesConectados = new cliente_lista_1.ClientesLista();
exports.plataformasConectados = new plataforma_lista_1.PlataformasLista();
exports.adminsConectados = new admin_lista_1.AdminLista();
const conectar = (clienteSocket, io) => {
    clienteSocket.on("conectar", (payload, callback2) => __awaiter(void 0, void 0, void 0, function* () {
        //console.log(payload.objeto);
        let existe;
        switch (payload.tipo) {
            case 'MOTORIZADO':
                //existe = motorizadosConectados.existeMotorizado(payload.objeto.iddb);
                existe = false;
                break;
            case 'CLIENTE':
                //existe = clientesConectados.existeCliente(payload.objeto.iddb);
                existe = false;
                break;
            case 'PLATAFORMA':
                existe = false;
                break;
            case 'ADMIN':
                existe = false;
                break;
            default:
                existe = false;
                break;
        }
        if (!existe) {
            switch (payload.tipo) {
                case 'MOTORIZADO':
                    const motorizado = new motorizado_1.Motorizado(clienteSocket.id, payload.objeto.iddb, payload.objeto.nombres, payload.objeto.apellidos, payload.objeto.token, 0, 0, [], payload.objeto.idregion);
                    exports.motorizadosConectados.addMotorizado(motorizado);
                    let listaPlataformas = exports.plataformasConectados.getListaPlataforma();
                    let listaPlataformasfiltrada = listaPlataformas.map((a) => a.idws);
                    for (let index = 0; index < listaPlataformasfiltrada.length; index++) {
                        io.to("" + listaPlataformasfiltrada).emit("lista-on-motorizado", exports.motorizadosConectados.getListaMotorizado());
                    }
                    if (payload.objeto.idregion != 0) {
                        let lista = exports.adminsConectados.getListaAdmin().filter((a) => a.idregion == payload.objeto.idregion);
                        let listaFiltrada = lista.map((a) => a.idws);
                        for (let index = 0; index < listaFiltrada.length; index++) {
                            io.to("" + listaFiltrada).emit("lista-on-motorizado", exports.motorizadosConectados.getListaMotorizado().filter((m) => m.idregion == payload.objeto.idregion));
                        }
                    }
                    break;
                case 'CLIENTE':
                    const cliente = new cliente_1.Cliente(clienteSocket.id, payload.objeto.iddb, payload.objeto.nombres, payload.objeto.apellidos, payload.objeto.token);
                    exports.clientesConectados.addCliente(cliente);
                    break;
                case 'PLATAFORMA':
                    const plataforma = new plataforma_1.Plataforma(clienteSocket.id, payload.objeto.iddb, payload.objeto.urlplat, payload.objeto.idalmacen);
                    exports.plataformasConectados.addPlataforma(plataforma);
                case 'ADMIN':
                    const admin = new admin_1.Admin(clienteSocket.id, payload.objeto.iddb, payload.objeto.nombre, payload.objeto.idperfil, payload.objeto.idregion);
                    exports.adminsConectados.addAdmin(admin);
                    break;
            }
        }
        else {
        }
        yield callback2({
            existe: existe,
            //estado: estado
        });
    }));
};
exports.conectar = conectar;
const desconectar = (clienteSocket, io) => {
    clienteSocket.on("disconnect", () => {
        let cliente = exports.clientesConectados.getClienteIdWs(clienteSocket.id);
        let motorizado = exports.motorizadosConectados.getMotorizadoIdWs(clienteSocket.id);
        let plataforma = exports.plataformasConectados.getPlataformaIdWs(clienteSocket.id);
        let admin = exports.adminsConectados.getAdminIdWs(clienteSocket.id);
        if (cliente != undefined) {
            exports.clientesConectados.deleteCliente(clienteSocket.id);
            //console.log("Cliente "+cliente.nombres + " desconectado." );
        }
        else if (motorizado != undefined) {
            exports.motorizadosConectados.deleteMotorizado(clienteSocket.id);
            emitirActulizacionMotorizado(io, motorizado.empresasMotorizado);
            emitirActulizacionMotorizadoAdmin(io, motorizado.idregion);
            //console.log("Motorizado "+motorizado.nombres + " desconectado.");
        }
        else if (plataforma != undefined) {
            exports.plataformasConectados.deletePlataforma(clienteSocket.id);
            //console.log("Plataforma "+plataforma.urlPlat + " desconectada.");
        }
        else if (admin != undefined)
            exports.adminsConectados.deleteAdmin(clienteSocket.id);
    });
};
exports.desconectar = desconectar;
const emitirActulizacionMotorizado = (io, empresas) => {
    //borrar online motorizado
    if (empresas.length > 0) {
        for (let index = 0; index < empresas.length; index++) {
            let plataformas = exports.plataformasConectados.getListaPlataforma().filter((plat) => plat.urlPlat == empresas[index].FacturaUrl && plat.idAlmacen == empresas[index].IdAlmacen);
            let plataformasFiltrada = plataformas.map((a) => a.idws);
            let motorizadosFiltro = [];
            exports.motorizadosConectados.getListaMotorizado().map((motorizado) => {
                motorizado.empresasMotorizado.map((emp) => {
                    if (emp.FacturaUrl == empresas[index].FacturaUrl && emp.IdAlmacen == empresas[index].IdAlmacen) {
                        motorizadosFiltro.push(motorizado);
                    }
                });
            });
            for (let index = 0; index < plataformas.length; index++) {
                io.to("" + plataformasFiltrada[index]).emit("lista-on-motorizado", motorizadosFiltro);
            }
        }
    }
};
const emitirActulizacionMotorizadoAdmin = (io, idregion) => {
    //borrar online motorizado
    if (idregion != 0) {
        let lista = exports.adminsConectados.getListaAdmin().filter((a) => a.idregion == idregion);
        let listaFiltrada = lista.map((a) => a.idws);
        for (let index = 0; index < listaFiltrada.length; index++) {
            io.to("" + listaFiltrada).emit("lista-on-motorizado", exports.motorizadosConectados.getListaMotorizado().filter((m) => m.idregion == idregion));
        }
    }
};
const pedidoCancelado = (cliente, io) => {
    cliente.on("emitir-cancelado-pedido", (payload, callback) => __awaiter(void 0, void 0, void 0, function* () {
        let data = {
            nombre: payload.nombre,
            idPedido: payload.idPedido,
            idEmpresa: payload.idEmpresa
        };
        let plataformas = exports.plataformasConectados.getListaPlataforma().filter((plat) => plat.iddb == payload.idEmpresa);
        let plataformasFiltrada = plataformas.map((a) => a.idws);
        for (let index = 0; index < plataformas.length; index++) {
            io.to("" + plataformasFiltrada[index]).emit("cancelado-pedido", data);
        }
    }));
};
exports.pedidoCancelado = pedidoCancelado;
const pedidoNuevo = (cliente, io) => {
    cliente.on("emitir-nuevo-pedido", (payload, callback) => __awaiter(void 0, void 0, void 0, function* () {
        let lista = [];
        let listaFiltrada = [];
        let listaAdminDash = exports.adminsConectados.getListaAdmin().map((a) => a.idws);
        if (payload.tienesistema == 0) {
            lista = exports.adminsConectados.getListaAdmin().filter((a) => a.idregion == payload.idregion);
            listaFiltrada = lista.map((a) => a.idws);
        }
        else {
            lista = exports.plataformasConectados.getListaPlataforma().filter((p) => p.urlPlat === payload.plataforma && p.idAlmacen == payload.idalmacen);
            listaFiltrada = lista.map((a) => a.idws);
        }
        let data = {
            nombre: payload.nombres
        };
        for (let index = 0; index < listaFiltrada.length; index++) {
            io.to("" + listaFiltrada[index]).emit("nuevo-pedido", data);
        }
        for (let index2 = 0; index2 < listaAdminDash.length; index2++) {
            io.to("" + listaAdminDash[index2]).emit("nuevo-pedido-dash", data);
        }
    }));
};
exports.pedidoNuevo = pedidoNuevo;
/*
export const motorizadosOnline = (cliente: Socket, io: SocketIO.Server) => {
  cliente.on("motorizado-nuevo-on", (callback: Function) => {
    let listaweb = usuariosConectados.getLista().filter((u) => u.tipo == "web");
    let listamotorizado = usuariosConectados.getLista().filter((u) => u.tipo == "MOTORIZADO");
    let listaWebfiltrada = listaweb.map((a) => a.idws);
    let listaMotorizado= usuariosConectados.getLista().filter((u) => u.tipo == "MOTORIZADO");

    for (let index = 0; index < listaweb.length; index++) {
      io.to("" + listaWebfiltrada[index]).emit(
        "lista-on-motorizado",
        listaMotorizado
      );
    }

    callback({
      ok: true,
      mensaje: "recibio info motorizado",
    });
  });
};
*/
const nuevoViaje = (cliente, io) => {
    cliente.on("nuevo-viaje-solicitado", (payload, callback) => {
        let listaMotorizado = exports.motorizadosConectados.getListaMotorizado().filter((m) => m.iddb == payload.idmotorizado);
        let listafiltradaMotorizado = listaMotorizado.map((a) => a.idws);
        for (let index = 0; index < listafiltradaMotorizado.length; index++) {
            io.to("" + listafiltradaMotorizado[index]).emit("nuevo-viaje-recibido", payload);
        }
    });
};
exports.nuevoViaje = nuevoViaje;
//NUEVOS SOCKET
//escuchar mensaje verificar
const mensajeChat = (cliente, io) => {
    cliente.on("mensaje-emitir", (payload, callback) => {
        switch (payload.tipo) {
            case 'CLIENTE':
                let listaCliente = exports.clientesConectados.getListaCliente().filter((c) => c.iddb == payload.iddb);
                let listafiltradaCliente = listaCliente.map((a) => a.idws);
                for (let index = 0; index < listafiltradaCliente.length; index++) {
                    io.to("" + listafiltradaCliente[index]).emit("mensaje-recibido", payload);
                }
            case 'MOTORIZADO':
                let listaMotorizado = exports.motorizadosConectados.getListaMotorizado().filter((m) => m.iddb == payload.iddb);
                let listafiltradaMotorizado = listaMotorizado.map((a) => a.idws);
                for (let index = 0; index < listafiltradaMotorizado.length; index++) {
                    io.to("" + listafiltradaMotorizado[index]).emit("mensaje-recibido", payload);
                }
        }
    });
};
exports.mensajeChat = mensajeChat;
//
const estadoPedidoCambio = (cliente, io) => {
    cliente.on("estado-pedido-actualizar", (payload, callback) => {
        switch (payload.tipo) {
            case 'CLIENTE':
                let listaCliente = exports.clientesConectados.getListaCliente().filter((c) => c.iddb == payload.iddb);
                let listafiltradaCliente = listaCliente.map((a) => a.idws);
                for (let index = 0; index < listafiltradaCliente.length; index++) {
                    io.to("" + listafiltradaCliente[index]).emit("estado-pedido-actualizado", payload);
                }
                let lista = exports.plataformasConectados.getListaPlataforma().filter((p) => p.urlPlat === payload.plataforma && p.idAlmacen == payload.idalmacen);
                let listafiltrada = lista.map((a) => a.idws);
                for (let index = 0; index < listafiltrada.length; index++) {
                    io.to("" + listafiltrada[index]).emit("estado-pedido-actualizado-plataforma", payload);
                }
                if (payload.idregion != 0) {
                    let lista = exports.adminsConectados.getListaAdmin().filter((a) => a.idregion == payload.idregion);
                    let listaFiltrada = lista.map((a) => a.idws);
                    for (let index = 0; index < listaFiltrada.length; index++) {
                        io.to("" + listaFiltrada).emit("estado-pedido-actualizado", payload);
                    }
                }
                break;
            case 'MOTORIZADO':
                let listaMotorizado = exports.motorizadosConectados.getListaMotorizado().filter((m) => m.iddb == payload.iddb);
                let listafiltradaMotorizado = listaMotorizado.map((a) => a.idws);
                for (let index = 0; index < listafiltradaMotorizado.length; index++) {
                    io.to("" + listafiltradaMotorizado[index]).emit("estado-pedido-actualizado", payload);
                }
                break;
        }
    });
};
exports.estadoPedidoCambio = estadoPedidoCambio;
const ubicacionMotorizado = (cliente, io) => {
    cliente.on("ubicacion-motorizado-actualizar", (payload, callback) => {
        switch (payload.tipo) {
            case 'CLIENTE':
                let infoMotorizado = {
                    IdMotorizado: payload.idmotorizado,
                    IdCliente: payload.idcliente,
                    IdPedido: payload.idpedido,
                    Latitud: payload.latitud,
                    Longitud: payload.longitud
                };
                let listaCliente = exports.clientesConectados.getListaCliente().filter((c) => c.iddb == payload.idcliente);
                let listafiltradaCliente = listaCliente.map((a) => a.idws);
                for (let index = 0; index < listafiltradaCliente.length; index++) {
                    io.to("" + listafiltradaCliente[index]).emit("ubicacion-motorizado-recibir", infoMotorizado);
                }
                break;
        }
    });
};
exports.ubicacionMotorizado = ubicacionMotorizado;
const estadoPedidoPlataforma = (cliente, io) => {
    cliente.on("estado-pedido-emitir-plataforma", (payload, callback) => {
        let infoPedido = {
            IdPedido: payload.IdPedido,
            Estado: payload.Estado
        };
        let listaCliente = exports.clientesConectados.getListaCliente().filter((c) => c.iddb == payload.IdCliente);
        let listafiltradaCliente = listaCliente.map((a) => a.idws);
        for (let index = 0; index < listafiltradaCliente.length; index++) {
            io.to("" + listafiltradaCliente[index]).emit("estado-pedido-actualizado", infoPedido);
        }
        if (payload.IdMotorizado != null) {
            let listaMotorizado = exports.motorizadosConectados.getListaMotorizado().filter((m) => m.iddb == payload.IdMotorizado);
            let listafiltradaMotorizado = listaMotorizado.map((a) => a.idws);
            for (let index = 0; index < listafiltradaMotorizado.length; index++) {
                io.to("" + listafiltradaMotorizado[index]).emit("estado-pedido-actualizado", infoPedido);
            }
        }
    });
};
exports.estadoPedidoPlataforma = estadoPedidoPlataforma;
const estadoPedidoAdmin = (cliente, io) => {
    cliente.on("estado-pedido-emitir-admin", (payload, callback) => {
        let infoPedido = {
            IdPedido: payload.IdPedido,
            Estado: payload.Estado
        };
        let listaCliente = exports.clientesConectados.getListaCliente().filter((c) => c.iddb == payload.IdCliente);
        let listafiltradaCliente = listaCliente.map((a) => a.idws);
        for (let index = 0; index < listafiltradaCliente.length; index++) {
            io.to("" + listafiltradaCliente[index]).emit("estado-pedido-actualizado", infoPedido);
        }
        let listaAdmin = exports.adminsConectados.getListaAdmin().filter((a) => a.idregion == payload.IdRegion);
        let listafiltradaAdmin = listaAdmin.map((a) => a.idws);
        for (let index = 0; index < listafiltradaAdmin.length; index++) {
            io.to("" + listafiltradaAdmin[index]).emit("estado-pedido-actualizado", infoPedido);
        }
        if (payload.IdMotorizado != null) {
            let listaMotorizado = exports.motorizadosConectados.getListaMotorizado().filter((m) => m.iddb == payload.IdMotorizado);
            let listafiltradaMotorizado = listaMotorizado.map((a) => a.idws);
            for (let index = 0; index < listafiltradaMotorizado.length; index++) {
                io.to("" + listafiltradaMotorizado[index]).emit("estado-pedido-actualizado", infoPedido);
            }
        }
    });
};
exports.estadoPedidoAdmin = estadoPedidoAdmin;
const motorizadosOnlinePlataforma = (cliente, io) => {
    cliente.on("motorizado-on-consulta", (payload, callback) => {
        let motorizadosFiltro = [];
        exports.motorizadosConectados.getListaMotorizado().map((motorizado) => {
            motorizado.empresasMotorizado.map((emp) => {
                if (emp.FacturaUrl == payload.facturaurl && emp.IdAlmacen == payload.idalmacen) {
                    motorizadosFiltro.push(motorizado);
                }
            });
        });
        let lista = exports.plataformasConectados.getListaPlataforma().filter((p) => p.urlPlat === payload.facturaurl && p.idAlmacen == payload.idalmacen);
        let listafiltrada = lista.map((a) => a.idws);
        for (let index = 0; index < listafiltrada.length; index++) {
            io.to("" + listafiltrada[index]).emit("lista-on-motorizado", exports.motorizadosConectados.getListaMotorizado());
        }
    });
};
exports.motorizadosOnlinePlataforma = motorizadosOnlinePlataforma;
const motoriazadosOnlineAdmin = (cliente, io) => {
    cliente.on("motorizado-on-consulta-admin", (payload, callback) => {
        let lista = exports.adminsConectados.getListaAdmin().filter((a) => a.idregion == payload.idregion);
        let listaFiltrada = lista.map((a) => a.idws);
        for (let index = 0; index < listaFiltrada.length; index++) {
            io.to("" + listaFiltrada).emit("lista-on-motorizado", exports.motorizadosConectados.getListaMotorizado().filter((m) => m.idregion == payload.idregion));
        }
    });
};
exports.motoriazadosOnlineAdmin = motoriazadosOnlineAdmin;
const ObtenerCoordenadasMotorizado = (cliente, io) => {
    cliente.on("coordenadas-motorizado", (payload, callback) => {
        let motorizado = exports.motorizadosConectados.actualizarCoordMotorizado(payload.IdMotorizado, payload.Lat, payload.Lon, payload.Empresas, payload.IdRegion);
        if (payload.Empresas.length > 0 && motorizado != null) {
            for (let index = 0; index < payload.Empresas.length; index++) {
                let plataformas = exports.plataformasConectados.getListaPlataforma().filter((plat) => plat.urlPlat == payload.Empresas[index].FacturaUrl && plat.idAlmacen == payload.Empresas[index].IdAlmacen);
                if (plataformas.length > 0) {
                    let plataformasFiltrada = plataformas.map((a) => a.idws);
                    for (let index2 = 0; index2 < plataformasFiltrada.length; index2++) {
                        io.to("" + plataformasFiltrada[index2]).emit("coordenadas-motorizado-nueva", motorizado);
                    }
                }
            }
        }
        if (payload.IdRegion != 0 && motorizado != null) {
            let admins = exports.adminsConectados.getListaAdmin().filter((adm) => adm.idregion == payload.IdRegion);
            let adminsFiltrado = admins.map((a) => a.idws);
            for (let index3 = 0; index3 < adminsFiltrado.length; index3++) {
                io.to("" + adminsFiltrado[index3]).emit("coordenadas-motorizado-nueva", motorizado);
            }
        }
    });
};
exports.ObtenerCoordenadasMotorizado = ObtenerCoordenadasMotorizado;
