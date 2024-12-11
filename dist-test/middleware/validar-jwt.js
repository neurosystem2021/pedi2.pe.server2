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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarJWT = validarJWT;
const jsonwebtoken_1 = require("jsonwebtoken");
function validarJWT(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.header('x-token');
        if (!token) {
            return res.status(401).json({
                msg: 'No autorizado, no proporcionado.'
            });
        }
        try {
            let payload = yield (0, jsonwebtoken_1.verify)(token, 'M1cl4v3s3cre374');
            const uid = payload.IdUser;
            req.body.IdUsuario = uid;
            next();
        }
        catch (error) {
            if (error.name === 'TokenExpiredError') {
                res.status(401).json({ msg: 'No autorizado, expirado.' });
                return;
            }
            res.status(401).json({
                msg: 'No autorizado, no valido.'
            });
        }
    });
}
