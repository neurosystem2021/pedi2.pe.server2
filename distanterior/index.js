"use strict";
// Importaciones existentes
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const server_1 = __importDefault(require("./classes/server"));
const express_1 = __importDefault(require("express"));
const router_1 = __importDefault(require("./routes/router"));
const routeradmin_1 = __importDefault(require("./routes/routeradmin"));
const routerwhatsapp_1 = __importDefault(require("./routes/routerwhatsapp"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const path = require("path");
const qrcode_1 = __importDefault(require("qrcode"));
const whatsapp_web_js_1 = require("whatsapp-web.js");
const https = require('https'); // Agregamos HTTPS
const fs = require('fs'); // Agregamos FS para leer los certificados

const server = server_1.default.instance;

// Eliminar archivo QR si existe
if (fs_1.default.existsSync(path.join(__dirname, 'public', 'qr.png'))) {
    fs_1.default.unlinkSync(path.join(__dirname, 'public', 'qr.png'));
}

// Función de inicialización de WhatsApp
function iniciar() {
    console.log("RESET");
    try {
        global.client = new whatsapp_web_js_1.Client({
            authStrategy: new whatsapp_web_js_1.LocalAuth({
                clientId: "client-one"
            }),
            puppeteer: {
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            }
        });

        client.on('qr', (qr) => {
            qrcode_1.default.toFile(path.join(__dirname, 'public', 'qr.png'), qr);
        });

        client.on('ready', () => {
            console.log("ACTIVO");
        });

        client.on('auth_failure', (session) => {
            console.log("ERROR", session);
        });

        client.on('authenticated', (session) => {
            if (fs_1.default.existsSync(path.join(__dirname, 'public', 'qr.png'))) {
                fs_1.default.unlinkSync(path.join(__dirname, 'public', 'qr.png'));
            }
            console.log("AUTENTIFICADO CORRECTAMENTE");
        });

        client.on('disconnected', () => {
            console.log("Cliente se desconectó");
            global.client = null;
            iniciar();
        });

        client.initialize();
    } catch (error) {
        console.log("Fallo Whastapp");
        console.log(error);
    }
}

// Iniciar el cliente de WhatsApp después de 1 segundo
setTimeout(() => {
    iniciar();
}, 1000);

// Bodyparser
server.app.use(body_parser_1.default.urlencoded({ extended: true, limit: "5mb" }));
server.app.use(body_parser_1.default.json({ limit: "5mb" }));

// CORS
server.app.use(cors_1.default({ origin: true, credentials: true }));

// Rutas de servicios
server.app.use(express_1.default.static(__dirname + "/public"));
server.app.use("/", router_1.default);
server.app.use("/", routeradmin_1.default);
server.app.use("/", routerwhatsapp_1.default);

// Opciones del certificado SSL
const sslOptions = {
    key: fs.readFileSync('/etc/letsencrypt/live/pedi2.pe/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/pedi2.pe/fullchain.pem'),
    ca: fs.readFileSync('/etc/letsencrypt/live/pedi2.pe/chain.pem')
};

// Crear y levantar el servidor HTTPS
const port = 5000;
https.createServer(sslOptions, server.app).listen(port, () => {
    console.log(`Servidor HTTPS corriendo en el puerto ${port}`);
});
