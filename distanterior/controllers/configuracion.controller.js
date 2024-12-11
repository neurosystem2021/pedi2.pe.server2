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
exports.ConfiguracionApp = ConfiguracionApp;
const database_1 = __importDefault(require("../classes/database"));
const database = database_1.default.instance;
function ConfiguracionApp(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let conn = yield database.conexionObtener();
            let resultadoEmpresa = yield conn.query("SELECT * FROM Gen_Configuracion WHERE IdConfiguracion  = 1");
            let resultadoEmpresaFinal = JSON.parse(JSON.stringify(resultadoEmpresa[0]));
            if (resultadoEmpresaFinal.length > 0) {
                return res.json({ success: true, data: resultadoEmpresaFinal[0] });
            }
            else {
                return res.json({ success: false, msg: 'No hay config' });
            }
        }
        catch (error) {
            return res.sendStatus(400);
        }
    });
}
