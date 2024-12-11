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
const server_1 = __importDefault(require("./classes/server"));
const express_1 = __importDefault(require("express"));
const router_1 = __importDefault(require("./routes/router"));
const routeradmin_1 = __importDefault(require("./routes/routeradmin"));
const routerwhatsapp_1 = __importDefault(require("./routes/routerwhatsapp"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const path = __importStar(require("path"));
//import { Client, LocalAuth } from 'whatsapp-web.js'
const server = server_1.default.instance;
if (fs_1.default.existsSync(path.join(__dirname, 'public', 'qr.png'))) {
    fs_1.default.unlinkSync(path.join(__dirname, 'public', 'qr.png'));
}
function iniciar() {
    /*   try {
        global.client = new Client({
          authStrategy: new LocalAuth({
            clientId: "client-one"
          }),
            puppeteer: {headless: true,
             args: ['--no-sandbox', '--disable-setuid-sandbox']
            }
        });
    
        client.on('qr', (qr:any) => {
            qrcodeImage.toFile(path.join(__dirname, 'public', 'qr.png'),qr);
        });
    
        client.on('ready', () => {
            console.log("ACTIVO");
        });
    
        client.on('auth_failure', (session:any) => {
            console.log("ERROR",session);
        });
    
        client.on('authenticated', (session:any) => {
          if (fs.existsSync(path.join(__dirname, 'public','qr.png'))) {
            fs.unlinkSync(path.join(__dirname, 'public','qr.png'))
          }
          console.log("AUTENTIFICADO CORRECTAMENTE");
        });
    
        client.on('disconnected', () => {
          console.log("Cliente se desconectó");
          global.client=null;
          iniciar();
        });
    
        client.initialize();
    
      } catch (error) {
        console.log("Fallo Whastapp");
        console.log(error);
      } */
}
setTimeout(() => {
    iniciar();
}, 1000);
//Bodyparser
server.app.use(body_parser_1.default.urlencoded({ extended: true, limit: "5mb" }));
server.app.use(body_parser_1.default.json({ limit: "5mb" }));
//CORS
server.app.use((0, cors_1.default)({ origin: true, credentials: true }));
//rutas de servicios
server.app.use(express_1.default.static(__dirname + "/public"));
//http://localhost:5000/img/empresas/kfc.png
server.app.use("/", router_1.default);
server.app.use("/", routeradmin_1.default);
server.app.use("/", routerwhatsapp_1.default);
server.start(() => {
    console.log(`Servidor corriendo en el puerto ${server.port}`);
});
