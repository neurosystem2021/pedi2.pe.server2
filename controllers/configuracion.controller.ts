import { Request, Response } from 'express';
import Database from "../classes/database";
const database = Database.instance;

export async function ConfiguracionApp(req: Request, res: Response): Promise<Response> {

    try {
        let conn = await database.conexionObtener();
        let resultadoEmpresa = await conn.query("SELECT * FROM Gen_Configuracion WHERE IdConfiguracion  = 1");
        let resultadoEmpresaFinal = JSON.parse(JSON.stringify(resultadoEmpresa[0]));

        if (resultadoEmpresaFinal.length > 0) {
                
            return res.json({ success: true, data:resultadoEmpresaFinal[0] });

        } else {

            return res.json({ success: false, msg:'No hay config' });

        }

    } catch (error) {
        return res.sendStatus(400);
    }
}