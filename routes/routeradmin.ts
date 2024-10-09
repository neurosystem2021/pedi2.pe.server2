import { Router } from "express";
import { Empresas, Categorias, EnivarMensaje, LoginAdmin, Anuncios,
     Departamentos, AnuncioEditar, AnuncioAnular, AnuncioEliminar, AnuncioNuevo, AnuncioOrden, 
     Motorizados,EmpresasIds,MotorizadoEditar,MotorizadoAnular, MotorizadoNuevo,MotorizadoEmpresas,MotorizadoRemoverEmpresa,
     MotorizadoAsignarEmpresa,EmpresaAnular,EmpresaEditar,SubCategorias,EmpresaConfigurar,EmpresaNueva, Pedidos, ProductosEmpresa
     ,ProductosCategoriasEmpresa,ProductosCategoriaAgregar, ProductoNuevo, ProductoEditar, ProductoAnular,ProductosCategoriaAnular,
     ProductosCategoriaMostrar,ProductosCategoriaOrden,PedidoProceso, MotorizadosServicio, PedidoAsignar, MotorizadoGrupos,
     MotorizadoGrupoEditar, Regiones, MotorizadoGrupoNuevo, NotificacionesFcm, EnviarNuevaNotificacion, PedidosTotal, PedidoCambiar, ReportePedidos} from "../controllers/admin.controller";
import { EnviarNotificacionTopicoAnuncio, EnviarNotificacionTopicoAnuncioTodos, EnviarNotificacionTopicoPromo } from "../controllers/notificaciones.controller";
import { validarJWT } from "../middleware/validar-jwt";
const router = Router();

//Usurio
router.post("/api/admin/login", LoginAdmin);


/* UTILIDADES INICIO */
router.get("/api/admin/categorias", [validarJWT] , Categorias);
router.get("/api/admin/subcategorias", [validarJWT] , SubCategorias);
router.get("/api/admin/regiones", [validarJWT] , Regiones);
/* UTILIDADES FIN */
//Empresas

router.get("/api/admin/anuncios", [validarJWT] , Anuncios);
router.get("/api/admin/departamentos", [validarJWT] , Departamentos);
router.get("/api/admin/mensaje", EnivarMensaje);
router.post("/api/admin/anuncio/editar", [validarJWT] , AnuncioEditar);
router.post("/api/admin/anuncio/anular", [validarJWT] , AnuncioAnular)
router.post("/api/admin/anuncio/eliminar", [validarJWT] , AnuncioEliminar)
router.post("/api/admin/anuncio/nuevo", [validarJWT] , AnuncioNuevo)
router.post("/api/admin/anuncio/orden", [validarJWT] , AnuncioOrden)

/*RUTAS MOTORIZADO*/
router.get("/api/admin/motorizados", [validarJWT] , Motorizados);
router.post("/api/admin/motorizado/editar", [validarJWT] , MotorizadoEditar);
router.post("/api/admin/motorizado/anular", [validarJWT] , MotorizadoAnular);
router.post("/api/admin/motorizado/nuevo", [validarJWT] , MotorizadoNuevo);
router.get("/api/admin/motorizado/empresas", [validarJWT] , MotorizadoEmpresas);
router.post("/api/admin/motorizado/empresa/remover", [validarJWT] , MotorizadoRemoverEmpresa);
router.post("/api/admin/motorizado/empresa/asignar", [validarJWT] , MotorizadoAsignarEmpresa);
router.get("/api/admin/motorizado/grupos", [validarJWT] , MotorizadoGrupos);
router.post("/api/admin/motorizado/grupo/editar", [validarJWT] , MotorizadoGrupoEditar);
router.post("/api/admin/motorizado/grupo/nuevo", [validarJWT] , MotorizadoGrupoNuevo);
/*FIN RUTAS MOTORIZADO*/

/*RUTAS EMPRESA*/
router.get("/api/admin/empresas",[validarJWT], Empresas);
router.get("/api/admin/empresas/ids",[validarJWT], EmpresasIds);
router.post("/api/admin/empresa/anular", [validarJWT] , EmpresaAnular);
router.post("/api/admin/empresa/configurar", [validarJWT] , EmpresaConfigurar);
router.post("/api/admin/empresa/editar", [validarJWT] , EmpresaEditar);
router.post("/api/admin/empresa/nueva", [validarJWT] , EmpresaNueva);
/*FIN RUTAS EMPRESA*/

/* RUTAS PEDIDOS */
router.get("/api/admin/pedidos", [validarJWT] , Pedidos);
router.get("/api/admin/pedidos/total", [validarJWT] , PedidosTotal);
router.post("/api/admin/pedido/proceso", [validarJWT] , PedidoProceso);
router.get("/api/admin/pedido/motorizados", [validarJWT] , MotorizadosServicio);
router.post("/api/admin/pedido/motorizado/asignar", [validarJWT] , PedidoAsignar);
router.post("/api/admin/pedido/motorizado/cambiar", [validarJWT] , PedidoCambiar);
/* FIN RUTAS PEDIDOS */

/* RUTAS PRODUCTOS */
router.get("/api/admin/productos/categorias/empresa", [validarJWT] , ProductosCategoriasEmpresa);
router.get("/api/admin/productos/empresa", [validarJWT] , ProductosEmpresa);
router.post("/api/admin/productos/categoria/agregar", [validarJWT] , ProductosCategoriaAgregar);
router.post("/api/admin/producto/nuevo", [validarJWT] , ProductoNuevo);
router.post("/api/admin/producto/editar", [validarJWT] , ProductoEditar);
router.post("/api/admin/producto/anular", [validarJWT] , ProductoAnular);
router.post("/api/admin/productos/categoria/anular", [validarJWT] , ProductosCategoriaAnular);
router.post("/api/admin/productos/categoria/mostrar", [validarJWT] , ProductosCategoriaMostrar);
router.post("/api/admin/productos/categoria/orden", [validarJWT] , ProductosCategoriaOrden);
/* FIN RUTAS PRODUCTOS */


/* FCM */
router.get("/api/admin/notificaciones/fcm", [validarJWT] , NotificacionesFcm);
router.post("/api/fcm/anuncio", [validarJWT] , EnviarNotificacionTopicoAnuncio);
router.post("/api/fcm/promo", [validarJWT] , EnviarNotificacionTopicoPromo);
router.post("/api/fcm/todo", [validarJWT] , EnviarNotificacionTopicoAnuncioTodos);
router.post("/api/fcm/nuevo", [validarJWT] , EnviarNuevaNotificacion);
/* FIN FCM */


/* REPORTES */
router.get("/api/admin/reporte/pedidos", [validarJWT] , ReportePedidos);
/* FIN REPORTES */
export default router;
