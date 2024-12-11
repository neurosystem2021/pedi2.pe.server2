import express from "express";
import { SERVER_PORT } from "../global/environment";
import http from "http";
import socketIO from "socket.io"; // Importar socket.io
import cors from "cors"; // Importa cors

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
    this.httpServer = http.createServer(this.app); // Crea el servidor HTTP

    // Configuracion de CORS en express
    this.app.use(cors({
      origin: 'https://panel.pedi2.pe', // Permitir conexiones solo desde este origen
      methods: ['GET', 'POST'],        
      allowedHeaders: ['Content-Type'], 
      credentials: true,
    }));

    // Inicializa socket.io y configura CORS
    this.io = socketIO(this.httpServer, { origins: '*:*' });

    // Configura CORS para socket.io (versión 2.x)
    this.io.origins('https://panel.pedi2.pe:*'); // Configurar el origen permitido

    this.escucharSockets();
  }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  private escucharSockets() {
    console.log("Escuchando conexiones - sockets");
    this.io.on("connection", (cliente) => {
      // Conectar cliente
      socket.conectar(cliente, this.io);
      socket.desconectar(cliente, this.io);
      // socket.estadoMotorizado(cliente, this.io);
      socket.pedidoNuevo(cliente, this.io);
      socket.pedidoCancelado(cliente, this.io);
      socket.estadoPedidoAdmin(cliente, this.io);
      socket.nuevoViaje(cliente, this.io);
      socket.mensajeChat(cliente, this.io); // nuevo
      socket.estadoPedidoCambio(cliente, this.io); // nuevo
      socket.ubicacionMotorizado(cliente, this.io); // nuevo
      socket.motoriazadosOnlineAdmin(cliente, this.io); // nuevo
      socket.estadoPedidoPlataforma(cliente, this.io);
      socket.motorizadosOnlinePlataforma(cliente, this.io);
      socket.ObtenerCoordenadasMotorizado(cliente, this.io);
    });
  }

  start(callback: any) {
    this.httpServer.listen(this.port, callback);
  }
}
