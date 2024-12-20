"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const environment_1 = require("../global/environment");
const http_1 = __importDefault(require("http"));
const socket_io_1 = __importDefault(require("socket.io")); // Importar socket.io
const cors_1 = __importDefault(require("cors")); // Importa cors
const socket = __importStar(require("../sockets/socket"));
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = environment_1.SERVER_PORT;
        this.httpServer = http_1.default.createServer(this.app); // Crea el servidor HTTP
        // Configuracion de CORS en express
        this.app.use((0, cors_1.default)({
            origin: 'https://panel.pedi2.pe', // Permitir conexiones solo desde este origen
            methods: ['GET', 'POST'],
            allowedHeaders: ['Content-Type'],
            credentials: true,
        }));
        // Inicializa socket.io y configura CORS
        this.io = (0, socket_io_1.default)(this.httpServer, { origins: '*:*' });
        // Configura CORS para socket.io (versión 2.x)
        this.io.origins('https://panel.pedi2.pe:*'); // Configurar el origen permitido
        this.escucharSockets();
    }
    static get instance() {
        return this._instance || (this._instance = new this());
    }
    escucharSockets() {
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
    start(callback) {
        this.httpServer.listen(this.port, callback);
    }
}
exports.default = Server;
