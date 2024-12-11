"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = generarToken;
const jsonwebtoken_1 = require("jsonwebtoken");
/**
 * generates JWT used for local testing
 */
function generarToken(IdUsuario, NombreUsuario) {
    // information to be encoded in the JWT
    const payload = {
        NombreUsuario: NombreUsuario,
        IdUser: IdUsuario,
    };
    // read private key valuefs
    const privateKey = "M1cl4v3s3cre374";
    const signInOptions = {
        // RS256 uses a public/private key pair. The API provides the private key
        // to generate the JWT. The client gets a public key to validate the
        // signature
        //algorithm: 'RS256',
        expiresIn: '6h'
    };
    // generate JWT
    return (0, jsonwebtoken_1.sign)(payload, privateKey, signInOptions);
}
;
