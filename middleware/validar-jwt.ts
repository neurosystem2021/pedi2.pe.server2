import { Request, Response, NextFunction } from 'express';
import { verify } from "jsonwebtoken";

export async function validarJWT(req: Request, res: Response, next: NextFunction){
    const token = req.header('x-token')
    if(!token){
        return res.status(401).json({
            msg:'No autorizado, no proporcionado.'
        });
    }

    try {
        let payload:any = await verify(token,'M1cl4v3s3cre374')
        const uid = payload.IdUser
        req.body.IdUsuario = uid
        next();

    } catch (error:any) {
        if (error.name === 'TokenExpiredError') {
            res.status(401).json({ msg: 'No autorizado, expirado.' });
            return;
        }

        res.status(401).json({
            msg: 'No autorizado, no valido.'
        })
    }
        
}