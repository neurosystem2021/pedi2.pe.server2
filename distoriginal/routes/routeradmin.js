"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin.controller");
const notificaciones_controller_1 = require("../controllers/notificaciones.controller");
const validar_jwt_1 = require("../middleware/validar-jwt");
const router = (0, express_1.Router)();
//Usurio
router.post("/api/admin/login", admin_controller_1.LoginAdmin);
/* UTILIDADES INICIO */
router.get("/api/admin/categorias", [validar_jwt_1.validarJWT], admin_controller_1.Categorias);
router.get("/api/admin/subcategorias", [validar_jwt_1.validarJWT], admin_controller_1.SubCategorias);
router.get("/api/admin/regiones", [validar_jwt_1.validarJWT], admin_controller_1.Regiones);
/* UTILIDADES FIN */
//Empresas
router.get("/api/admin/anuncios", [validar_jwt_1.validarJWT], admin_controller_1.Anuncios);
router.get("/api/admin/departamentos", [validar_jwt_1.validarJWT], admin_controller_1.Departamentos);
router.get("/api/admin/mensaje", admin_controller_1.EnivarMensaje);
router.post("/api/admin/anuncio/editar", [validar_jwt_1.validarJWT], admin_controller_1.AnuncioEditar);
router.post("/api/admin/anuncio/anular", [validar_jwt_1.validarJWT], admin_controller_1.AnuncioAnular);
router.post("/api/admin/anuncio/eliminar", [validar_jwt_1.validarJWT], admin_controller_1.AnuncioEliminar);
router.post("/api/admin/anuncio/nuevo", [validar_jwt_1.validarJWT], admin_controller_1.AnuncioNuevo);
router.post("/api/admin/anuncio/orden", [validar_jwt_1.validarJWT], admin_controller_1.AnuncioOrden);
/*RUTAS MOTORIZADO*/
router.get("/api/admin/motorizados", [validar_jwt_1.validarJWT], admin_controller_1.Motorizados);
router.post("/api/admin/motorizado/editar", [validar_jwt_1.validarJWT], admin_controller_1.MotorizadoEditar);
router.post("/api/admin/motorizado/anular", [validar_jwt_1.validarJWT], admin_controller_1.MotorizadoAnular);
router.post("/api/admin/motorizado/nuevo", [validar_jwt_1.validarJWT], admin_controller_1.MotorizadoNuevo);
router.get("/api/admin/motorizado/empresas", [validar_jwt_1.validarJWT], admin_controller_1.MotorizadoEmpresas);
router.post("/api/admin/motorizado/empresa/remover", [validar_jwt_1.validarJWT], admin_controller_1.MotorizadoRemoverEmpresa);
router.post("/api/admin/motorizado/empresa/asignar", [validar_jwt_1.validarJWT], admin_controller_1.MotorizadoAsignarEmpresa);
router.get("/api/admin/motorizado/grupos", [validar_jwt_1.validarJWT], admin_controller_1.MotorizadoGrupos);
router.post("/api/admin/motorizado/grupo/editar", [validar_jwt_1.validarJWT], admin_controller_1.MotorizadoGrupoEditar);
router.post("/api/admin/motorizado/grupo/nuevo", [validar_jwt_1.validarJWT], admin_controller_1.MotorizadoGrupoNuevo);
/*FIN RUTAS MOTORIZADO*/
/*RUTAS EMPRESA*/
router.get("/api/admin/empresas", [validar_jwt_1.validarJWT], admin_controller_1.Empresas);
router.get("/api/admin/empresas/ids", [validar_jwt_1.validarJWT], admin_controller_1.EmpresasIds);
router.post("/api/admin/empresa/anular", [validar_jwt_1.validarJWT], admin_controller_1.EmpresaAnular);
router.post("/api/admin/empresa/configurar", [validar_jwt_1.validarJWT], admin_controller_1.EmpresaConfigurar);
router.post("/api/admin/empresa/editar", [validar_jwt_1.validarJWT], admin_controller_1.EmpresaEditar);
router.post("/api/admin/empresa/nueva", [validar_jwt_1.validarJWT], admin_controller_1.EmpresaNueva);
/*FIN RUTAS EMPRESA*/
/* RUTAS PEDIDOS */
router.get("/api/admin/pedidos", [validar_jwt_1.validarJWT], admin_controller_1.Pedidos);
router.get("/api/admin/pedidos/total", [validar_jwt_1.validarJWT], admin_controller_1.PedidosTotal);
router.post("/api/admin/pedido/proceso", [validar_jwt_1.validarJWT], admin_controller_1.PedidoProceso);
router.get("/api/admin/pedido/motorizados", [validar_jwt_1.validarJWT], admin_controller_1.MotorizadosServicio);
router.post("/api/admin/pedido/motorizado/asignar", [validar_jwt_1.validarJWT], admin_controller_1.PedidoAsignar);
router.post("/api/admin/pedido/motorizado/cambiar", [validar_jwt_1.validarJWT], admin_controller_1.PedidoCambiar);
/* FIN RUTAS PEDIDOS */
/* RUTAS PRODUCTOS */
router.get("/api/admin/productos/categorias/empresa", [validar_jwt_1.validarJWT], admin_controller_1.ProductosCategoriasEmpresa);
router.get("/api/admin/productos/empresa", [validar_jwt_1.validarJWT], admin_controller_1.ProductosEmpresa);
router.post("/api/admin/productos/categoria/agregar", [validar_jwt_1.validarJWT], admin_controller_1.ProductosCategoriaAgregar);
router.post("/api/admin/producto/nuevo", [validar_jwt_1.validarJWT], admin_controller_1.ProductoNuevo);
router.post("/api/admin/producto/editar", [validar_jwt_1.validarJWT], admin_controller_1.ProductoEditar);
router.post("/api/admin/producto/anular", [validar_jwt_1.validarJWT], admin_controller_1.ProductoAnular);
router.post("/api/admin/productos/categoria/anular", [validar_jwt_1.validarJWT], admin_controller_1.ProductosCategoriaAnular);
router.post("/api/admin/productos/categoria/mostrar", [validar_jwt_1.validarJWT], admin_controller_1.ProductosCategoriaMostrar);
router.post("/api/admin/productos/categoria/orden", [validar_jwt_1.validarJWT], admin_controller_1.ProductosCategoriaOrden);
/* FIN RUTAS PRODUCTOS */
/* FCM */
router.get("/api/admin/notificaciones/fcm", [validar_jwt_1.validarJWT], admin_controller_1.NotificacionesFcm);
router.post("/api/fcm/anuncio", [validar_jwt_1.validarJWT], notificaciones_controller_1.EnviarNotificacionTopicoAnuncio);
router.post("/api/fcm/promo", [validar_jwt_1.validarJWT], notificaciones_controller_1.EnviarNotificacionTopicoPromo);
router.post("/api/fcm/todo", [validar_jwt_1.validarJWT], notificaciones_controller_1.EnviarNotificacionTopicoAnuncioTodos);
router.post("/api/fcm/nuevo", [validar_jwt_1.validarJWT], admin_controller_1.EnviarNuevaNotificacion);
/* FIN FCM */
/* REPORTES */
router.get("/api/admin/reporte/pedidos", [validar_jwt_1.validarJWT], admin_controller_1.ReportePedidos);
/* FIN REPORTES */
exports.default = router;
