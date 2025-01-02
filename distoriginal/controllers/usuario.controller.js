"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
export async function loginUsuario(req: Request, res: Response): Promise<Response> {
    if (req.header('APP-Signature') != undefined) {
        if (req.header('APP-Signature') == 'renzo') {
            let celularbody = req.body.celular;
            let pinbody = req.body.pin;

            try {
                const conn = await database.conexionObtener();
                const cliente = await conn.query("SELECT * FROM cliente WHERE celular= '" + celularbody + "'");
                let resultado = JSON.parse(JSON.stringify(cliente[0]));
                if (resultado.length > 0) {
                    let pinres = resultado[0].pin;
                    if (pinres == pinbody) {
                        return res.json(resultado[0]);
                    } else {
                        return res.json({ success: false, msg: 'El PIN de seguridad es incorrecto.' });
                    }

                } else {
                    return res.json({ success: false, msg: 'Celular no encontrado, verique sus datos.' });
                }
            } catch (error) {
                return res.sendStatus(400);
            }

        } else {
            return res.sendStatus(400);
        }
    } else {
        return res.sendStatus(400);
    }
}

export async function puntosUsuario(req: Request, res: Response): Promise<Response> {
    if (req.header('APP-Signature') != undefined && req.body.code != undefined) {
        if (req.header('APP-Signature') == 'renzo') {
            let celularbody = req.body.celular;

            try {
                const conn = await database.conexionObtener();
                const cliente = await conn.query("SELECT puntos FROM cliente WHERE celular= '" + celularbody + "'");
                let resultado = JSON.parse(JSON.stringify(cliente[0]));
                return res.json(resultado[0].puntos);


            } catch (error) {
                return res.sendStatus(400);
            }

        } else {
            return res.sendStatus(400);
        }
    } else {
        return res.sendStatus(400);
    }
}

export async function notificacionesUsuario(req: Request, res: Response): Promise<Response> {
    if (req.header('APP-Signature') != undefined && req.body.code != undefined) {
        if (req.header('APP-Signature') == 'renzo') {
            let serve = req.headers.host;
            let protocolo = "https://";
            let servidor = protocolo + serve;
            let celularbody = req.body.celular;

            try {
                const conn = await database.conexionObtener();
                const cliente = await conn.query("SELECT n.id,CONCAT('" + servidor + "',o.url_imagen) as url_imagen,n.mensaje,n.leido,n.fecha FROM notificaciones n INNER JOIN opc_notificacion o ON n.opc_notificacion=o.id WHERE n.cliente='" + celularbody + "' ORDER BY n.fecha DESC, id DESC");
                let resultado = JSON.parse(JSON.stringify(cliente[0]));

                if (resultado.length > 0) {
                    return res.json(resultado);
                } else {
                    return res.json(null);
                }

            } catch (error) {
                return res.sendStatus(400);
            }

        } else {
            return res.sendStatus(400);
        }
    } else {
        return res.sendStatus(400);
    }
}

export async function notificacionesActualizar(req: Request, res: Response): Promise<Response> {
    if (req.header('APP-Signature') != undefined && req.body.code != undefined) {
        if (req.header('APP-Signature') == 'renzo') {

            let celularbody = req.body.celular;

            try {
                const conn = await database.conexionObtener();
                const resultado = await conn.query("UPDATE notificaciones SET leido = 's' WHERE cliente = '" + celularbody + "'");
                return res.json({ success: true });


            } catch (error) {
                return res.sendStatus(400);
            }

        } else {
            return res.sendStatus(400);
        }
    } else {
        return res.sendStatus(400);
    }
}

export async function notificacionBorrar(req: Request, res: Response): Promise<Response> {
    if (req.header('APP-Signature') != undefined && req.body.code != undefined && req.body.id != undefined) {
        if (req.header('APP-Signature') == 'renzo') {

            let celularbody = req.body.celular;
            let idbody = req.body.id;
            try {
                const conn = await database.conexionObtener();
                const resultado = await conn.query("DELETE FROM notificaciones WHERE id = '" + idbody + "' AND cliente = '" + celularbody + "'");
                return res.json({ success: true });


            } catch (error) {
                return res.sendStatus(400);
            }

        } else {
            return res.sendStatus(400);
        }
    } else {
        return res.sendStatus(400);
    }
}

export async function contactoUsuario(req: Request, res: Response): Promise<Response> {
    if (req.header('APP-Signature') != undefined && req.body.code != undefined && req.body.celular != undefined
        && req.body.msg != undefined && req.body.opc != undefined && req.body.correo != undefined) {
        if (req.header('APP-Signature') == 'renzo') {

            let celularbody = req.body.celular;
            let correobody = req.body.correo;
            let opcbody = req.body.opc;
            let msgbody = req.body.msg;
            const hoy = moment();
            moment.locale('es');
            const hoyformateado = hoy.format('YYYY-MM-DD');
            try {
                const conn = await database.conexionObtener();
                const resultado = await conn.query("INSERT INTO hablanos (opc_hablanos,cliente,correo,mensaje,fecha_recibido) " +
                    "VALUES ('" + opcbody + "','" + celularbody + "','" + correobody + "','" + msgbody + "','" + hoyformateado + "')");
                return res.json({ success: true });


            } catch (error) {
                return res.sendStatus(400);
            }

        } else {
            return res.sendStatus(400);
        }
    } else {
        return res.sendStatus(400);
    }
}

export async function registroUsuario(req: Request, res: Response): Promise<Response> {
    if (req.header('APP-Signature') != undefined && req.body.code != undefined && req.body.celular != undefined
        && req.body.pin != undefined && req.body.dni != undefined && req.body.nombres != undefined && req.body.apellidos != undefined) {
        if (req.header('APP-Signature') == 'renzo') {

            let celularbody = req.body.celular;
            let pinbody = req.body.pin;
            let dnibody = req.body.dni;
            let nombresbody = req.body.nombres;
            let apellidosbody = req.body.apellidos;
            const hoy = moment();
            moment.locale('es');
            const hoyformateado = hoy.format('YYYY-MM-DD');
            try {
                const conn = await database.conexionObtener();
                const resultado = await conn.query("INSERT INTO cliente(celular,pin,dni,nombres,apellidos,puntos,fecha_registro,estado) " +
                    " VALUES ('" + celularbody + "','" + pinbody + "','" + dnibody + "','" + nombresbody + "','" + apellidosbody + "','10','" + hoyformateado + "','A')");
                return res.json({ success: true, msg: 'Registrado! Tiene 10 puntos gratis para sus pedidos!' });


            } catch (error) {
                return res.sendStatus(400);
            }

        } else {
            return res.sendStatus(400);
        }
    } else {
        return res.sendStatus(400);
    }
}

export async function existeUsuario(req: Request, res: Response): Promise<Response> {
    if (req.header('APP-Signature') != undefined && req.body.code != undefined && req.body.celular != undefined) {
        if (req.header('APP-Signature') == 'renzo') {

            let celularbody = req.body.celular;


            try {
                const conn = await database.conexionObtener();
                const cliente = await conn.query("SELECT * FROM cliente WHERE celular= '" + celularbody + "'");
                let resultado = JSON.parse(JSON.stringify(cliente[0]));

                if (resultado.length > 0) {
                    return res.json({ success: false, msg: 'Error, el número ingresado ya se encuentra registrado, utilize otro.' });
                } else {
                    return res.json({ success: true });
                }

            } catch (error) {
                return res.sendStatus(400);
            }

        } else {
            return res.sendStatus(400);
        }
    } else {
        return res.sendStatus(400);
    }
}

export async function favoritosUsuario(req: Request, res: Response): Promise<Response> {
    if (req.header('APP-Signature') != undefined && req.body.code != undefined) {
        if (req.header('APP-Signature') == 'renzo') {
            let serve = req.headers.host;
            let protocolo = "https://";
            let servidor = protocolo + serve;
            let celularbody = req.body.celular;

            try {
                const conn = await database.conexionObtener();
                const cliente = await conn.query("SELECT p.id,p.empresa_ruc,e.razon_social AS empresa_razon_social,p.nombre,p.descripcion,p.categoria_menu,CONCAT('" + servidor + "',p.url_imagen) as url_imagen,p.precio_unitario,p.ranking,TIME_FORMAT(e.horario_inicio, '%H:%i') as horario_inicio,TIME_FORMAT(e.horario_fin, '%H:%i') as horario_fin FROM favoritos f INNER JOIN producto p ON f.producto=p.id INNER JOIN empresa e ON p.empresa_ruc=e.ruc WHERE f.cliente='" + celularbody + "' AND p.estado='A' AND e.estado='A'");
                let resultado = JSON.parse(JSON.stringify(cliente[0]));

                if (resultado.length > 0) {
                    return res.json(resultado);
                } else {
                    return res.json(null);
                }

            } catch (error) {
                return res.sendStatus(400);
            }

        } else {
            return res.sendStatus(400);
        }
    } else {
        return res.sendStatus(400);
    }
}

export async function accionFavoritoUsuario(req: Request, res: Response): Promise<Response> {
    if (req.header('APP-Signature') != undefined && req.body.code != undefined && req.body.celular != undefined
        && req.body.id != undefined && req.body.accion != undefined) {
        if (req.header('APP-Signature') == 'renzo') {

            let celularbody = req.body.celular;
            let idbody = req.body.id;
            let accionbody = req.body.accion;

            switch (accionbody) {
                case 'agregar': {
                    try {
                        let conn = await database.conexionObtener();
                        let resultado = await conn.query("SELECT cliente, producto FROM favoritos WHERE cliente='" + celularbody + "' AND producto='" + idbody + "'");
                        let resultadofinal = JSON.parse(JSON.stringify(resultado[0]));

                        if (resultadofinal.length > 0) {
                            return res.json({ success: false, 'msg': 'Error, vuelva atrás.' });

                        } else {

                            try {
                                let conn = await database.conexionObtener();
                                let resultado = await conn.query("INSERT INTO favoritos(cliente,producto) VALUES ('" + celularbody + "','" + idbody + "')");
                                return res.json({ success: true, msg: ' se agrego a favoritos!' });
                            } catch (error) {
                                return res.sendStatus(400);
                            }
                        }

                    } catch (error) {
                        return res.sendStatus(400);
                    }

                }


                case 'quitar': {

                    try {
                        const conn = await database.conexionObtener();
                        const resultado = await conn.query("DELETE FROM favoritos WHERE cliente = '" + celularbody + "' AND producto='" + idbody + "'");
                        return res.json({ success: true, msg: ' se quito de favoritos!' });


                    } catch (error) {
                        return res.sendStatus(400);
                    }
                }

                default:
                    return res.sendStatus(400);
            }




        } else {
            return res.sendStatus(400);
        }
    } else {
        return res.sendStatus(400);
    }
}

export async function realizarPedido(req: Request, res: Response): Promise<Response> {
    if (req.header('APP-Signature') != undefined && req.body.code != undefined && req.body.celular != undefined
        && req.body.pedidos != undefined && req.body.precio_delivery != undefined && req.body.precio_productos != undefined
        && req.body.ubi_lat != undefined && req.body.ubi_lon != undefined && req.body.ubi_referencia!= undefined) {
        if (req.header('APP-Signature') == 'renzo') {

            let celularbody = req.body.celular;
            let ubi_latbody = req.body.ubi_lat;
            let ubi_lonbody = req.body.ubi_lon;
            let pedidosbody = req.body.pedidos;
            let precio_deliverybody = req.body.precio_delivery;
            let precio_productosbody = req.body.precio_productos;
            let ubi_referenciabody = req.body.ubi_referencia

            console.log(celularbody, pedidosbody, precio_deliverybody, precio_productosbody);
            const hoy = moment();
            moment.locale('es');
            const hoyformateado = hoy.format('YYYY-MM-DD');

            try {
                let conn = await database.conexionObtener();
                let resultado = await conn.query("SELECT idpedidos FROM pedidos WHERE cliente = '" + celularbody + "' AND (estado <> 'F' AND estado <> 'C')");
                let resultadofinal = JSON.parse(JSON.stringify(resultado[0]));

                if (resultadofinal.length > 0) {
                    return res.json({ success: false });

                } else {

                    try {

                        let resultado1 = await conn.query("INSERT INTO pedidos (cliente,ubi_lat,ubi_lon,precio_delivery,precio_productos,fecha,estado,chat,ubi_referencia) " +
                            " VALUES ('" + celularbody + "','" + ubi_latbody + "','" + ubi_lonbody + "','" + precio_deliverybody + "','" + precio_productosbody + "','" + hoyformateado + "','E','','"+ubi_referenciabody+"')");
                        //AND fecha='" + hoyformateado + "'
                        let resultado2 = await conn.query("SELECT idpedidos as idpedido FROM pedidos WHERE cliente = '" + celularbody + "' AND (estado <> 'F' AND estado <> 'C') ");
                        let resultadofinal2 = JSON.parse(JSON.stringify(resultado2[0]));
                        let idpedido = resultadofinal2[0].idpedido;

                        for (let i = 0; i < pedidosbody.length; i++) {

                            let resultado3 = await conn.query("INSERT INTO detalle_pedido(pedido,producto,cantidad,precio_unitario,subtotal)" +
                                "VALUES ('" + idpedido + "','" + pedidosbody[i].id + "','" + pedidosbody[i].cantidad + "','" + pedidosbody[i].precio_unitario + "','" + pedidosbody[i].subtotal + "')");
                        }

                        return res.json({ success: true });
                    } catch (error) {
                        return res.sendStatus(400);
                    }
                }

            } catch (error) {
                return res.sendStatus(400);
            }

        } else {
            return res.sendStatus(400);
        }
    } else {
        return res.sendStatus(400);
    }
}


export async function existePedido(req: Request, res: Response): Promise<Response> {
    if (req.header('APP-Signature') != undefined && req.body.code != undefined && req.body.celular != undefined) {
        if (req.header('APP-Signature') == 'renzo') {

            let celularbody = req.body.celular;
            try {
                let conn = await database.conexionObtener();
                let resultado = await conn.query("SELECT idpedidos FROM pedidos WHERE cliente = '" + celularbody + "' AND (estado <> 'F' AND estado <> 'C')");
                let resultadofinal = JSON.parse(JSON.stringify(resultado[0]));

                if (resultadofinal.length > 0) {
                    return res.json({ success: true });

                } else {

                    return res.json({ success: false });

                }

            } catch (error) {
                return res.sendStatus(400);
            }

        } else {
            return res.sendStatus(400);
        }
    } else {
        return res.sendStatus(400);
    }
}

export async function estadoUsuario(req: Request, res: Response): Promise<Response> {
    if (req.header('APP-Signature') != undefined && req.body.code != undefined && req.body.celular != undefined) {
        if (req.header('APP-Signature') == 'renzo') {

            let celularbody = req.body.celular;


            try {
                let conn = await database.conexionObtener();
                let resultado = await conn.query("SELECT estado FROM cliente WHERE celular='"+celularbody+"'");
                let resultadofinal = JSON.parse(JSON.stringify(resultado[0]));

                
                return res.json(resultadofinal[0].estado);
           

            } catch (error) {
                return res.sendStatus(400);
            }

        } else {
            return res.sendStatus(400);
        }
    } else {
        return res.sendStatus(400);
    }
}

export async function traerPedido(req: Request, res: Response): Promise<Response> {
    if (req.header('APP-Signature') != undefined && req.body.code != undefined && req.body.celular != undefined) {
        if (req.header('APP-Signature') == 'renzo') {

            let celularbody = req.body.celular;
            try {
                let conn = await database.conexionObtener();
                let resultado = await conn.query("SELECT p.idpedidos,p.motorizado,p.ubi_lat,p.ubi_lon,p.precio_delivery,p.ubi_referencia,p.precio_productos,p.estado,p.chat FROM pedidos p WHERE p.cliente = '" + celularbody + "' AND (p.estado <> 'F' AND p.estado <> 'C')");
                let resultadofinal = JSON.parse(JSON.stringify(resultado[0]));
                if (resultadofinal.length > 0) {
                    return res.json( resultadofinal[0]);

                } else {

                    return res.json({ success: false });

                }

            } catch (error) {
                return res.sendStatus(400);
            }

        } else {
            return res.sendStatus(400);
        }
    } else {
        return res.sendStatus(400);
    }
}

export async function traerPedidoId(req: Request, res: Response): Promise<Response> {
   // if (req.header('APP-Signature') != undefined) {
     //   if (req.header('APP-Signature') == 'renzo9221') {

            let pedidoId = req.body.pedidoId;
            try {
                let conn = await database.conexionObtener();
                let resultado = await conn.query("SELECT p.idpedidos,p.motorizado,p.ubi_lat,p.ubi_lon,p.precio_delivery,p.ubi_referencia,p.precio_productos,p.estado,p.chat,cliente.nombres,cliente.apellidos,cliente.celular,cliente.direccion  FROM pedidos p"+
                " INNER JOIN cliente ON p.cliente = cliente.celular WHERE p.idpedidos  = " + pedidoId );
                let resultadofinal = JSON.parse(JSON.stringify(resultado[0]));
                let resultadoDet = await conn.query("SELECT producto.nombre,producto.descripcion,detalle_pedido.cantidad,detalle_pedido.precio_unitario,detalle_pedido.subtotal FROM detalle_pedido INNER JOIN producto ON detalle_pedido.producto = producto.id"+
                " WHERE detalle_pedido.pedido= " + pedidoId );
                let resultadofinalDet = JSON.parse(JSON.stringify(resultadoDet[0]));
                if (resultadofinal.length > 0) {
                    resultadofinal[0].detalle_pedido=resultadofinalDet;
                    return res.json( resultadofinal[0]);

                } else {

                    return res.json({ success: false });

                }

            } catch (error) {
                return res.sendStatus(400);
            }

     //   } else {
     //       return res.sendStatus(400);
     //   }
   // } else {
   //     return res.sendStatus(400);
   // }
}

export async function traerMotorizado(req: Request, res: Response): Promise<Response> {
    if (req.header('APP-Signature') != undefined && req.body.idpedido != undefined ) {
        if (req.header('APP-Signature') == 'renzo') {

            let idpedidobody = req.body.idpedido;
            try {
                let conn = await database.conexionObtener();
                let resultado = await conn.query("SELECT m.dni,m.nombres,m.apellidos,m.telefono FROM motorizados m INNER JOIN pedidos p ON p.motorizado=m.dni WHERE p.idpedidos='"+idpedidobody+"'");
                let resultadofinal = JSON.parse(JSON.stringify(resultado[0]));
                if (resultadofinal.length > 0) {
                    return res.json( resultadofinal[0] );

                } else {

                    return res.json(null);

                }

            } catch (error) {
                return res.sendStatus(400);
            }

        } else {
            return res.sendStatus(400);
        }
    } else {
        return res.sendStatus(400);
    }
}


export async function cancelarPedido(req: Request, res: Response): Promise<Response> {
    if (req.header('APP-Signature') != undefined && req.body.code != undefined && req.body.celular != undefined) {
        if (req.header('APP-Signature') == 'renzo') {

            let celularbody = req.body.celular;
            try {
                let conn = await database.conexionObtener();
                let resultado = await conn.query("SELECT idpedidos as idpedido FROM pedidos  WHERE cliente = '" + celularbody + "' AND estado='E'");
                let resultadofinal = JSON.parse(JSON.stringify(resultado[0]));

                if (resultadofinal.length > 0) {
                    let idpedido = resultadofinal[0].idpedido;
                    let resultado1 = await conn.query("UPDATE pedidos SET estado ='C' WHERE idpedidos = '"+idpedido+"'");
                    return res.json({ success: true });

                } else {

                    return res.json({ success: false });

                }

            } catch (error) {
                return res.sendStatus(400);
            }

        } else {
            return res.sendStatus(400);
        }
    } else {
        return res.sendStatus(400);
    }
}


export async function traerDetallePedido(req: Request, res: Response): Promise<Response> {
    if (req.header('APP-Signature') != undefined && req.body.code != undefined && req.body.idpedido != undefined) {
        if (req.header('APP-Signature') == 'renzo') {
            let serve = req.headers.host;
            let protocolo = "https://";
            let servidor = protocolo + serve;
            let idpedidobody = req.body.idpedido;
            try {
                let conn = await database.conexionObtener();
                let resultado = await conn.query("SELECT dp.id,e.razon_social,p.nombre,CONCAT('" + servidor + "',p.url_imagen) AS url_imagen,p.ranking,dp.cantidad,dp.precio_unitario,dp.subtotal FROM detalle_pedido dp INNER JOIN producto p ON dp.producto=p.id "+
                " INNER JOIN empresa e ON p.empresa_ruc=e.ruc WHERE dp.pedido='"+idpedidobody+"'");
                let resultadofinal = JSON.parse(JSON.stringify(resultado[0]));
                if (resultadofinal.length > 0) {
                    return res.json( resultadofinal);

                } else {

                    return res.json({ success: false });

                }

            } catch (error) {
                return res.sendStatus(400);
            }

        } else {
            return res.sendStatus(400);
        }
    } else {
        return res.sendStatus(400);
    }
}
*/ 
