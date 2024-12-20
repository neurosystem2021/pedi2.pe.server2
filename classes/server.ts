import express from "express";
import { SERVER_PORT } from "../global/environment";
import http from "http";
import { Server as SocketIOServer } from "socket.io"; // Importar correctamente socket.io
import cors from "cors"; // Importar cors

import {
  conectar,
  desconectar,
  pedidoNuevo,
  pedidoCancelado,
  estadoPedidoAdmin,
  nuevoViaje,
  mensajeChat,
  estadoPedidoCambio,
  ubicacionMotorizado,
  motorizadosOnlineAdmin,
  estadoPedidoPlataforma,
  motorizadosOnlinePlataforma,
  ObtenerCoordenadasMotorizado
} from "../sockets/socket";

export default class Server {
  private static _instance: Server;

  public app: express.Application;
  public port: number;
  public io: SocketIOServer; // Tipo actualizado
  private httpServer: http.Server;

  private constructor() {
    this.app = express();
    this.port = SERVER_PORT;
    this.httpServer = http.createServer(this.app); // Crear el servidor HTTP

    // Configuración de CORS en express
    this.app.use(
      cors({
        origin: "*", // Permitimos todas las conexiones temporalmente
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: true,
      })
    );

    // Inicializar socket.io y configurar CORS
    this.io = new SocketIOServer(this.httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
	credentials: true,
      },
    });

    this.escucharSockets();
  }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  private escucharSockets() {
    console.log("Escuchando conexiones - sockets");

    this.io.on("connection", (cliente) => {
      console.log(`Cliente conectado: ${cliente.id}`);

      // Conectar al cliente y pasarle el Socket.IO server
      conectar(cliente, this.io);

      // Escuchar los eventos de desconexión y otros eventos
      cliente.on("disconnect", () => {
        console.log(`Cliente desconectado: ${cliente.id}`);
        desconectar(cliente, this.io);
      });

      // Escuchar los eventos personalizados
      cliente.on("pedidoNuevo", (data: any) => pedidoNuevo(cliente, this.io, data));
      cliente.on("pedidoCancelado", (data: any) => pedidoCancelado(cliente, this.io, data));
      cliente.on("estadoPedidoAdmin", (data: any) => estadoPedidoAdmin(cliente, this.io, data));
      cliente.on("nuevoViaje", (data: any) => nuevoViaje(cliente, this.io, data));
      cliente.on("mensajeChat", (data: any) => mensajeChat(cliente, this.io, data));
      cliente.on("estadoPedidoCambio", (data: any) => estadoPedidoCambio(cliente, this.io, data));
      cliente.on("ubicacionMotorizado", (data: any) => ubicacionMotorizado(cliente, this.io, data));
      cliente.on("motorizadosOnlineAdmin", (data: any) => motorizadosOnlineAdmin(cliente, this.io, data));
      cliente.on("estadoPedidoPlataforma", (data: any) => estadoPedidoPlataforma(cliente, this.io, data));
      cliente.on("motorizadosOnlinePlataforma", (data: any) => motorizadosOnlinePlataforma(cliente, this.io, data));
      cliente.on("ObtenerCoordenadasMotorizado", (data: any) => ObtenerCoordenadasMotorizado(cliente, this.io, data));
    });
  }

  start(callback: any) {
    this.httpServer.listen(this.port, callback);
  }
}
