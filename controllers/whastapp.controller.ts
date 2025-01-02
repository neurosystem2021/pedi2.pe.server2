import { Request, Response } from 'express';
import path, { join } from "path";
import fs from 'fs'

export async function CerrarSesionWsp(req: Request, res: Response): Promise<Response> {
    try {

        if (fs.existsSync(path.join(__dirname,'..','public','qr.png'))) {
            return res.json({ success: false, msg:"No existe Sesión" });

        } else {
            await client.logout();
            return res.json({ success: true, msg:"Sesion Desconectada" });
       }
        
    } catch (error) {
        return res.status(500);
    }
    
}

export async function CodigoQR(req: Request, res: Response): Promise<Response> {
    try {
        if (fs.existsSync(path.join(__dirname,'..','public','qr.png'))) {
            let serve = req.headers.host;
                let protocolo = "https://";
                let servidor = protocolo + serve;
    
                return res.json({ success: true, msg:"Qr Generado", url:servidor+"/qr.png"});
        }else{
            return res.json({ success: false, msg:"Existe una sesión activa" });
        }

    } catch (error) {
        return res.status(400)
    }
}

/////////////////////////////////////////////// WHATSAPP DESDE NODE JS //////////////////////////////////////
export async function EnvioWsp(req: Request, res: Response): Promise<Response> {
    try {
        let texto = req.body.Texto;
        let numero = req.body.Numero;

        let codigoUs = '@c.us';

        client.sendMessage(numero+codigoUs, texto);

        return res.json({ success: true });
        
    } catch (error) {
        console.log(error);
        return res.json({ success: false });
    }
    
}

/////////////////////////////////////////////// WHATSAPP DESDE NODE JS //////////////////////////////////////