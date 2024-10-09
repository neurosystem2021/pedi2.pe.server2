import { sign, SignOptions, verify, VerifyOptions } from 'jsonwebtoken';
import * as fs from 'fs';
import * as path from 'path';

/**
 * generates JWT used for local testing
 */
export default function generarToken(IdUsuario:number,NombreUsuario:string) {
  // information to be encoded in the JWT
  const payload = {
    NombreUsuario: NombreUsuario,
    IdUser: IdUsuario,
  };
  // read private key valuefs
  const privateKey = "M1cl4v3s3cre374";

  const signInOptions: SignOptions = {
    // RS256 uses a public/private key pair. The API provides the private key
    // to generate the JWT. The client gets a public key to validate the
    // signature
    //algorithm: 'RS256',
    expiresIn: '6h'
  };

  // generate JWT
  return sign(payload, privateKey, signInOptions);
};

