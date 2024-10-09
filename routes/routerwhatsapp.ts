import { Router } from "express";
import { CodigoQR, EnvioWsp , CerrarSesionWsp,  } from "../controllers/whastapp.controller";

const router = Router();

router.get("/api/whatsapp/qr", CodigoQR);

//Enviar Email
router.post("/api/whatsapp/envio", EnvioWsp);

//Enviar Email
router.get("/api/whatsapp/logout", CerrarSesionWsp);

export default router;