import Server from "./classes/server";
import express from "express";
import router from "./routes/router";
import routeradmin from "./routes/routeradmin";
import routerwhatsapp from "./routes/routerwhatsapp";
import bodyPaser from "body-parser";
import cors from "cors";
import fs from "fs";
import * as path from 'path';
import qrcodeImage from 'qrcode';
//import { Client, LocalAuth } from 'whatsapp-web.js'
const server = Server.instance;

declare global {
  var client: any;
  var authed:boolean;
}

if (fs.existsSync(path.join(__dirname, 'public','qr.png'))) {
  fs.unlinkSync(path.join(__dirname, 'public','qr.png'))
}

function iniciar(){
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
server.app.use(bodyPaser.urlencoded({ extended: true, limit: "5mb" }));
server.app.use(bodyPaser.json({ limit: "5mb" }));

//CORS
server.app.use(cors({ origin: true, credentials: true }));

//rutas de servicios
server.app.use(express.static(__dirname + "/public"));
//http://localhost:5000/img/empresas/kfc.png
server.app.use("/", router);
server.app.use("/", routeradmin);
server.app.use("/", routerwhatsapp);

server.start(() => {
  console.log(`Servidor corriendo en el puerto ${server.port}`);
});
