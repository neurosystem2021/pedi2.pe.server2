import { Server } from "socket.io";
import { UsuariosLista } from "../classes/usuario-lista";
import { Usuario } from "../classes/usuario";

import { PlataformasLista } from "../classes/plataforma-lista";
import { ClientesLista } from "../classes/cliente-lista";
import { MotorizadosLista } from "../classes/motorizado-lista";
import { AdminLista } from "../classes/admin-lista";

import { Motorizado } from "../classes/motorizado";
import { Cliente } from "../classes/cliente";
import { Plataforma } from "../classes/plataforma";
import { Admin } from "../classes/admin";

export const usuariosConectados = new UsuariosLista();
export const motorizadosConectados = new MotorizadosLista();
export const clientesConectados = new ClientesLista();
export const plataformasConectados = new PlataformasLista();
export const adminsConectados = new AdminLista();

export const conectar = (clienteSocket: any, io: Server) => {
  clienteSocket.on(
    "conectar",
    async (payload: { tipo: string; objeto: any }, callback: Function) => {
      let existe = false;

      switch (payload.tipo) {
        case "MOTORIZADO":
          existe = motorizadosConectados.getMotorizadoIdDb(payload.objeto.iddb) !== null;
          break;
        case "CLIENTE":
          existe = clientesConectados.getClienteIdDb(payload.objeto.iddb) !== null;
          break;
        case "PLATAFORMA":
          existe = plataformasConectados.getPlataformaIdDb(payload.objeto.iddb) !== null;
          break;
        case "ADMIN":
          existe = adminsConectados.getAdminIdDb(payload.objeto.iddb) !== null;
          break;
      }

      if (!existe) {
        switch (payload.tipo) {
          case "MOTORIZADO":
            const motorizado = new Motorizado(
              clienteSocket.id,
              payload.objeto.iddb,
              payload.objeto.nombres,
              payload.objeto.apellidos,
              payload.objeto.token,
              0,
              0,
              [],
              payload.objeto.idregion
            );
            motorizadosConectados.addMotorizado(motorizado);
            actualizarPlataformas(io);
            actualizarAdmins(io, motorizado.idregion);
            break;

          case "CLIENTE":
            const cliente = new Cliente(
              clienteSocket.id,
              payload.objeto.iddb,
              payload.objeto.nombres,
              payload.objeto.apellidos,
              payload.objeto.token
            );
            clientesConectados.addCliente(cliente);
            break;

          case "PLATAFORMA":
            const plataforma = new Plataforma(
              clienteSocket.id,
              payload.objeto.iddb,
              payload.objeto.urlplat,
              payload.objeto.idalmacen
            );
            plataformasConectados.addPlataforma(plataforma);
            break;

          case "ADMIN":
            const admin = new Admin(
              clienteSocket.id,
              payload.objeto.iddb,
              payload.objeto.nombre,
              payload.objeto.idperfil,
              payload.objeto.idregion
            );
            adminsConectados.addAdmin(admin);
            break;
        }
      }

      await callback({ existe });
    }
  );
};

export const desconectar = (clienteSocket: any, io: Server) => {
  clienteSocket.on("disconnect", () => {
    const cliente = clientesConectados.getClienteIdWs(clienteSocket.id);
    const motorizado = motorizadosConectados.getMotorizadoIdWs(clienteSocket.id);
    const plataforma = plataformasConectados.getPlataformaIdWs(clienteSocket.id);
    const admin = adminsConectados.getAdminIdWs(clienteSocket.id);

    if (cliente) {
      clientesConectados.deleteCliente(clienteSocket.id);
    } else if (motorizado) {
      motorizadosConectados.deleteMotorizado(clienteSocket.id);
      actualizarPlataformas(io);
      actualizarAdmins(io, motorizado.idregion);
    } else if (plataforma) {
      plataformasConectados.deletePlataforma(clienteSocket.id);
    } else if (admin) {
      adminsConectados.deleteAdmin(clienteSocket.id);
    }
  });
};

const actualizarPlataformas = (io: Server) => {
  const plataformas = plataformasConectados.getListaPlataforma();
  plataformas.forEach((plataforma) => {
    io.to(plataforma.idws).emit(
      "lista-on-motorizado",
      motorizadosConectados.getListaMotorizado()
    );
  });
};

const actualizarAdmins = (io: Server, idregion: number) => {
  if (idregion !== 0) {
    const admins = adminsConectados
      .getListaAdmin()
      .filter((admin) => admin.idregion === idregion);
    admins.forEach((admin) => {
      io.to(admin.idws).emit(
        "lista-on-motorizado",
        motorizadosConectados
          .getListaMotorizado()
          .filter((motorizado) => motorizado.idregion === idregion)
      );
    });
  }
};

// Eventos personalizados
export const pedidoNuevo = (cliente: any, io: Server, data: any) => {
  // Lógica para manejar nuevo pedido
  console.log("Nuevo pedido:", data);
  // Emitir actualización
  io.emit("nuevoPedido", data);
};

export const pedidoCancelado = (cliente: any, io: Server, data: any) => {
  // Lógica para manejar cancelación de pedido
  console.log("Pedido cancelado:", data);
  // Emitir actualización
  io.emit("pedidoCancelado", data);
};

export const estadoPedidoAdmin = (cliente: any, io: Server, data: any) => {
  // Lógica para manejar cambio de estado de pedido por admin
  console.log("Estado del pedido actualizado por admin:", data);
  // Emitir actualización
  io.emit("estadoPedidoAdmin", data);
};

export const nuevoViaje = (cliente: any, io: Server, data: any) => {
  // Lógica para manejar un nuevo viaje
  console.log("Nuevo viaje iniciado:", data);
  // Emitir actualización
  io.emit("nuevoViaje", data);
};

export const mensajeChat = (cliente: any, io: Server, data: any) => {
  // Lógica para manejar mensaje de chat
  console.log("Mensaje de chat:", data);
  // Emitir mensaje a los participantes en el chat
  io.emit("mensajeChat", data);
};

export const estadoPedidoCambio = (cliente: any, io: Server, data: any) => {
  // Lógica para manejar el cambio de estado del pedido
  console.log("Cambio de estado de pedido:", data);
  // Emitir actualización
  io.emit("estadoPedidoCambio", data);
};

export const ubicacionMotorizado = (cliente: any, io: Server, data: any) => {
  // Lógica para manejar la actualización de ubicación del motorizado
  console.log("Ubicación del motorizado:", data);
  // Emitir la ubicación actualizada
  io.emit("ubicacionMotorizado", data);
};

export const motorizadosOnlineAdmin = (cliente: any, io: Server, data: any) => {
  // Lógica para manejar consulta de motorizados online desde admin
  console.log("Motorizados online - Admin:", data);
  // Emitir lista de motorizados online a admin
  io.emit("motorizadosOnlineAdmin", motorizadosConectados.getListaMotorizado());
};

export const estadoPedidoPlataforma = (cliente: any, io: Server, data: any) => {
  // Lógica para manejar estado de pedido en la plataforma
  console.log("Estado del pedido actualizado en la plataforma:", data);
  // Emitir actualización
  io.emit("estadoPedidoPlataforma", data);
};

export const motorizadosOnlinePlataforma = (cliente: any, io: Server, data: any) => {
  // Lógica para manejar consulta de motorizados online desde plataforma
  console.log("Motorizados online - Plataforma:", data);
  // Emitir lista de motorizados online a la plataforma
  io.emit("motorizadosOnlinePlataforma", motorizadosConectados.getListaMotorizado());
};

export const ObtenerCoordenadasMotorizado = (cliente: any, io: Server, data: any) => {
  // Lógica para obtener coordenadas de motorizado
  console.log("Obteniendo coordenadas de motorizado:", data);
  // Emitir las coordenadas de motorizado
  io.emit("coordenadasMotorizado", data);
};
