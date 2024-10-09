import { Request, Response } from 'express';
import Database from "../classes/database";
const database = Database.instance;


export async function LoginMotorizado(req: Request, res: Response): Promise<Response> {
    if(req.query.Dni != undefined && req.query.Password != undefined){
        let dni = req.query.Dni;
        let password = req.query.Password;
        try {
            let conn = await database.conexionObtener();
            let resultado = await conn.query("SELECT Gm.IdMotorizado, Gm.Nombres, Gm.Apellidos, Gm.Dni, Gm.Telefono, Gm.Password, Gm.Email, Gm.Direccion,"+
            " Gm.VehiculoPlaca, Gm.VehiculoColor, Gm.FechaReg, Gm.FechaMod, Gm.Anulado FROM Gen_Motorizado Gm WHERE Gm.Dni='"+dni+"' AND Gm.Password='"+password+"'");
            let resultadoFinal = JSON.parse(JSON.stringify(resultado[0]));

            if (resultadoFinal.length > 0) {
                let motorizadoInfo = resultadoFinal[0];
                if(motorizadoInfo.Anulado==0){
                    return res.json({success: true, msg:'Bienvenido motorizado.', data: motorizadoInfo, anulado:motorizadoInfo.Anulado});
                }else{
                    return res.json({ success: false, msg: 'Se ha bloqueado el acceso para este usuario .',data:{}, anulado:motorizadoInfo.Anulado });
                }

            } else {
                return res.json({ success: false, msg: 'Motorizado no encontrado, verifique sus datos.',data:{}, anulado:null });
            }
    
        } catch (error) {
            return res.sendStatus(400);
        } 
    }else{
        return res.json({ success: false, msg:'No se proporcionaron datos de acceso', data:{} });
    }
 
}

export async function EmpresasMotorizado(req: Request, res: Response): Promise<Response> {
    if(req.query.IdMotorizado != undefined){
        let idMotorizado = req.query.IdMotorizado
        let serve = req.headers.host;
        let protocolo = req.protocol + "://";
        let servidor = protocolo + serve;
        let rutaAlmacenamiento = "/img/empresas/";
        let rutaFinal = servidor + rutaAlmacenamiento;
        try {
            let conn = await database.conexionObtener();

            let queryMotorizado = await conn.query("SELECT Gen_Motorizado.IdMotorizado,Gen_Motorizado.Nombres,Gen_Motorizado.Apellidos,Gen_Motorizado.Anulado AS MotorizadoAnulado,Gen_Motorizado.IdGrupoMotorizado, "+
            " Gen_GrupoMotorizado.NombreGrupo, IFNULL(Gen_GrupoMotorizado.IdRegion,0) AS IdRegion FROM Gen_Motorizado LEFT JOIN Gen_GrupoMotorizado ON Gen_Motorizado.IdGrupoMotorizado = Gen_GrupoMotorizado.IdGrupoMotorizado "+
            " WHERE Gen_Motorizado.IdMotorizado ="+idMotorizado);
            let queryMotorizadoFinal = JSON.parse(JSON.stringify(queryMotorizado[0]));
            
            let queryEmpresas = await conn.query("SELECT Gen_Empresa.*,CONCAT('"+rutaFinal+"',Gen_Empresa.ImagenUrl) AS ImagenUrlCom, Gen_EmpresaCategoria.EmpresaCategoria FROM Empresa_Has_Motorizado "+ 
            " INNER JOIN Gen_Empresa ON Empresa_Has_Motorizado.IdEmpresa = Gen_Empresa.IdEmpresa "+
            " INNER JOIN Gen_Motorizado ON Empresa_Has_Motorizado.IdMotorizado = Gen_Motorizado.IdMotorizado "+
            " INNER JOIN Gen_EmpresaCategoria ON Gen_Empresa.IdEmpresaCategoria = Gen_EmpresaCategoria.IdEmpresaCategoria "+
            " WHERE Empresa_Has_Motorizado.IdMotorizado="+idMotorizado+" AND Gen_Empresa.Anulado=0");
            let resultadoEmpresas = JSON.parse(JSON.stringify(queryEmpresas[0]));
            if (queryMotorizadoFinal.length > 0) {
                return res.json({success: true, msg:'Empresas obtenidas', info:queryMotorizadoFinal[0], data: resultadoEmpresas, totalEmpresas:resultadoEmpresas.length});
            } else {
                return res.json({ success: false, msg: 'El motorizado no existe'});
            }
    
        } catch (error) {
            return res.sendStatus(400);
        } 
    }else{
        return res.json({ success: false, msg:'No se proporciono datos del motorizado', data:[] });
    }
 
}

export async function MotorizadoGrupo(req: Request, res: Response): Promise<Response> {
    if(req.query.IdMotorizado != undefined){
        let idMotorizado = req.query.IdMotorizado
        try {
            let conn = await database.conexionObtener();

            let queryMotorizado = await conn.query("SELECT Gen_Motorizado.IdGrupoMotorizado, Gen_GrupoMotorizado.NombreGrupo, IFNULL(Gen_GrupoMotorizado.IdRegion,0) AS IdRegion "+ 
            " FROM Gen_Motorizado INNER JOIN Gen_GrupoMotorizado ON Gen_Motorizado.IdGrupoMotorizado = Gen_GrupoMotorizado.IdGrupoMotorizado "+
            " WHERE Gen_Motorizado.IdMotorizado ="+idMotorizado);
            let queryMotorizadoFinal = JSON.parse(JSON.stringify(queryMotorizado[0]));
            
            return res.json({success: true, idRegion:(queryMotorizadoFinal.length > 0?queryMotorizadoFinal[0].IdRegion:0) });
        } catch (error) {
            return res.sendStatus(400);
        } 
    }else{
        return res.json({ success: false, msg:'No se proporciono datos del motorizado', data:[] });
    }
 
}

export async function InfoMotorizado(req: Request, res: Response): Promise<Response> {
    if(req.query.IdMotorizado != undefined){
        let idMotorizado = req.query.IdMotorizado
        try {
            let conn = await database.conexionObtener();
            let queryMotorizado = await conn.query("SELECT IdMotorizado,Nombres,Apellidos,Dni,Telefono,Vehiculo, VehiculoPlaca, VehiculoColor  FROM Gen_Motorizado  WHERE Anulado = 0 AND IdMotorizado="+idMotorizado+" LIMIT 1");
            let resultadoMotorizado = JSON.parse(JSON.stringify(queryMotorizado[0]));

            if (resultadoMotorizado.length > 0) {
                return res.json({success: true, msg:'Motorizado Obtenido', data: resultadoMotorizado[0]});
            } else {
                return res.json({ success: false, msg: 'No existe motorizado',data:[] });
            }
    
        } catch (error) {
            return res.sendStatus(400);
        } 
    }else{
        return res.json({ success: false, msg:'No se proporciono datos del motorizado', data:[] });
    }
 
}
