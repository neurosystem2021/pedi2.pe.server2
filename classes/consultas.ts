import Database from "../classes/database";


const database = Database.instance;
export const cambiarEstado = async (celular: string, idpedido: string, estado: string) => {

    try {
        const conn = await database.conexionObtener();
        let resultado1 = await conn.query("UPDATE pedidos SET estado ='" + estado + "' " +
            " WHERE idpedidos = '" + idpedido + "' AND cliente='" + celular + "'");

    } catch (error) {

    }

}

export const obtenerEstado = async (idCliente: string) => {
   
    try {
        let conn = await database.conexionObtener();
        let resultado = await conn.query("SELECT Gen_Pedido.Estado FROM Gen_Pedido WHERE Gen_Pedido.IdCliente="+idCliente+"  AND (Gen_Pedido.Estado <> 'F' AND Gen_Pedido.Estado <> 'C') LIMIT 1");
        let resultadofinal = JSON.parse(JSON.stringify(resultado[0]));
        
        if (resultadofinal.length > 0) {
           return resultadofinal[0].estado;

        } else {

            return null;

        }

    } catch (error) {
        return null ;
    }

}

//consulta web
export const obtenerPedidos = async () => {
   
    try {
        let conn = await database.conexionObtener();
        const pedidos = await conn.query("SELECT p.idpedidos as idpedido,p.estado,p.cliente,CONCAT(c.apellidos,' ',c.nombres) AS cliente_nombre,"+
        "p.motorizado,CONCAT(m.apellidos,' ',m.nombres) AS motorizado_nombre,p.precio_productos,p.precio_delivery,p.ubi_lat,p.ubi_lon,p.fecha,(p.precio_productos+p.precio_delivery) AS total "+
        " FROM pedidos p INNER JOIN cliente c ON p.cliente=c.celular LEFT JOIN motorizados m ON p.motorizado=m.dni WHERE (p.estado <> 'F' AND p.estado <> 'C')");
        let pedidosfinal = JSON.parse(JSON.stringify(pedidos[0]));
        
        if (pedidosfinal.length > 0) {
           return pedidosfinal;

        } else {

            return [];

        }

    } catch (error) {
        return [];
    }

}