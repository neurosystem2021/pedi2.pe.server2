"use strict";
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
//import { Client, LocalAuth } from 'whatsapp-web.js';  // Comentado
const server = server_1.default.instance;
// Si ya no quieres usar el código de whatsapp-web.js, comentamos todo el bloque relacionado
/*
if (fs.existsSync(path.join(__dirname, 'public','qr.png'))) {
  fs.unlinkSync(path.join(__dirname, 'public','qr.png'))
}

function iniciar(){
  console.log("RESET")
  try {
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
  }
}

setTimeout(() => {
  iniciar();
}, 1000);
*/
// Bodyparser
server.app.use(body_parser_1.default.urlencoded({ extended: true, limit: "5mb" }));
server.app.use(body_parser_1.default.json({ limit: "5mb" }));
// CORS
server.app.use((0, cors_1.default)({ origin: true, credentials: true }));
// rutas de servicios
server.app.use(express_1.default.static(__dirname + "/public"));
//http://localhost:5000/img/empresas/kfc.png
server.app.use("/", router_1.default);
server.app.use("/", routeradmin_1.default);
server.app.use("/", routerwhatsapp_1.default);
server.start(() => {
    console.log(`Servidor corriendo en el puerto ${server.port}`);
});
