"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const whastapp_controller_1 = require("../controllers/whastapp.controller");
const router = (0, express_1.Router)();
router.get("/api/whatsapp/qr", whastapp_controller_1.CodigoQR);
//Enviar Email
router.post("/api/whatsapp/envio", whastapp_controller_1.EnvioWsp);
//Enviar Email
router.get("/api/whatsapp/logout", whastapp_controller_1.CerrarSesionWsp);
exports.default = router;
