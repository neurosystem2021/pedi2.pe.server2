import express from "express";
import { SERVER_PORT } from "../global/environment";
import socketIO from "socket.io";
import http from "http";

import * as socket from "../sockets/socket";

export default class Server {
  private static _instance: Server;

  public app: express.Application;
  public port: number;
  public io: socketIO.Server;
  private httpServer: http.Server;

  private constructor() {
    this.app = express();
    this.port = SERVER_PORT;
    this.httpServer = new http.Server(this.app);
    this.io = socketIO(this.httpServer,{origins: '*:*'});
    this.escucharSockets();
  }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  private escucharSockets() {
    console.log("Escuchando conexiones - sockets");
    this.io.on("connection", (cliente) => {
      //conectar cliente
      socket.conectar(cliente, this.io);
      socket.desconectar(cliente, this.io);
      //socket.estadoMotorizado(cliente, this.io);
      socket.pedidoNuevo(cliente, this.io);
      socket.pedidoCancelado(cliente, this.io);
      socket.estadoPedidoAdmin(cliente,this.io);
      socket.nuevoViaje(cliente, this.io);
      socket.mensajeChat(cliente, this.io); //nuevo
      socket.estadoPedidoCambio(cliente, this.io); //nuevo
      socket.ubicacionMotorizado(cliente, this.io) //nuevo
      socket.motoriazadosOnlineAdmin(cliente, this.io) //nuevo
      socket.estadoPedidoPlataforma(cliente, this.io);
      socket.motorizadosOnlinePlataforma(cliente, this.io);
      socket.ObtenerCoordenadasMotorizado(cliente, this.io);
    });
  }

  start(callback: any) {
    this.httpServer.listen(this.port, callback);
  }
}
