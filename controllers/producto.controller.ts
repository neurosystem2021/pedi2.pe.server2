import { Request, Response } from 'express';
import Database from "../classes/database";
const database = Database.instance;

export async function getProductos(req: Request, res: Response): Promise<Response> {

    if (req.header('APP-Signature') != undefined) {
        if(req.header('APP-Signature')=='renzo'){
            let ruc = req.params.ruc;
            let serve = req.headers.host;
            let protocolo = "https://";
            let servidor = protocolo + serve;
            try {
                const conn = await database.conexionObtener();
                const productos = await conn.query("SELECT p.id,p.empresa_ruc,e.razon_social AS empresa_razon_social,p.nombre,p.descripcion,p.categoria_menu,CONCAT('" + servidor + "',p.url_imagen) as url_imagen,p.precio_unitario, p.ranking,TIME_FORMAT(e.horario_inicio, '%H:%i') AS horario_inicio,TIME_FORMAT(e.horario_fin, '%H:%i') AS horario_fin FROM producto p INNER JOIN empresa e ON p.empresa_ruc=e.ruc WHERE p.empresa_ruc='" + ruc + "' AND p.estado='A' AND p.tipo='n'");
                 if (JSON.parse(JSON.stringify(productos[0])).length > 0) {
                    return res.json(productos[0]);
                } else {
                    return res.json({ success: false });
                }
            } catch (error) {
                return res.sendStatus(400);
            }
        }else{
            return res.sendStatus(400);
        }
    } else {
        return res.sendStatus(400);
    }
}

export async function getPromociones(req: Request, res: Response): Promise<Response> {

    if (req.header('APP-Signature') != undefined && req.body.code !=undefined) {
        if(req.header('APP-Signature')=='renzo'){
            let serve = req.headers.host;
            let protocolo = "https://";
            let servidor = protocolo + serve;
            try {
                const conn = await database.conexionObtener();
                const productos = await conn.query("SELECT p.id,p.empresa_ruc,e.razon_social AS empresa_razon_social,p.nombre,p.descripcion,p.categoria_menu,CONCAT('"+servidor+"',p.url_imagen) as url_imagen,p.precio_unitario, p.ranking,TIME_FORMAT(e.horario_inicio, '%H:%i') AS horario_inicio,TIME_FORMAT(e.horario_fin, '%H:%i') AS horario_fin,p.fecha_inicio,p.fecha_fin FROM producto p INNER JOIN empresa e ON p.empresa_ruc=e.ruc  AND p.estado='A' AND p.tipo='p' AND e.estado='A' AND CURDATE() BETWEEN p.fecha_inicio AND p.fecha_fin");
                 if (JSON.parse(JSON.stringify(productos[0])).length > 0) {
                    return res.json(productos[0]);
                } else {
                    return res.json({ success: false });
                }
            } catch (error) {
                return res.sendStatus(400);
            }
        }else{
            return res.sendStatus(400);
        }
    } else {
        return res.sendStatus(400);
    }
}