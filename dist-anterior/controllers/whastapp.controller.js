"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CerrarSesionWsp = CerrarSesionWsp;
exports.CodigoQR = CodigoQR;
exports.EnvioWsp = EnvioWsp;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
function CerrarSesionWsp(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (fs_1.default.existsSync(path_1.default.join(__dirname, '..', 'public', 'qr.png'))) {
                return res.json({ success: false, msg: "No existe Sesión" });
            }
            else {
                yield client.logout();
                return res.json({ success: true, msg: "Sesion Desconectada" });
            }
        }
        catch (error) {
            return res.status(500);
        }
    });
}
function CodigoQR(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (fs_1.default.existsSync(path_1.default.join(__dirname, '..', 'public', 'qr.png'))) {
                let serve = req.headers.host;
                let protocolo = req.protocol + "://";
                let servidor = protocolo + serve;
                return res.json({ success: true, msg: "Qr Generado", url: servidor + "/qr.png" });
            }
            else {
                return res.json({ success: false, msg: "Existe una sesión activa" });
            }
        }
        catch (error) {
            return res.status(400);
        }
    });
}
/////////////////////////////////////////////// WHATSAPP DESDE NODE JS //////////////////////////////////////
function EnvioWsp(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let texto = req.body.Texto;
            let numero = req.body.Numero;
            let codigoUs = '@c.us';
            client.sendMessage(numero + codigoUs, texto);
            return res.json({ success: true });
        }
        catch (error) {
            console.log(error);
            return res.json({ success: false });
        }
    });
}
/////////////////////////////////////////////// WHATSAPP DESDE NODE JS //////////////////////////////////////
