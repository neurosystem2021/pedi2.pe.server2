"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const motorizado_controller_1 = require("../controllers/motorizado.controller");
const web_controller_1 = require("../controllers/web.controller");
const pedido_controller_1 = require("../controllers/pedido.controller");
const cliente_controller_1 = require("../controllers/cliente.controller");
const empresa_controller_1 = require("../controllers/empresa.controller");
const plataforma_controller_1 = require("../controllers/plataforma.controller");
const configuracion_controller_1 = require("../controllers/configuracion.controller");
const notificaciones_controller_1 = require("../controllers/notificaciones.controller");
const router = (0, express_1.Router)();
//Motorizado
router.get("/api/login/motorizado", motorizado_controller_1.LoginMotorizado);
router.get("/api/empresas/motorizado", motorizado_controller_1.EmpresasMotorizado);
router.get("/api/empresas/motorizado/grupo", motorizado_controller_1.MotorizadoGrupo);
//Pedidos
router.get("/api/pedidos/motorizado/solicitud", pedido_controller_1.PedidoMotorizadoSolicitud);
router.get("/api/pedidos/motorizado/solicitud/detalle", pedido_controller_1.PedidoMotorizadoSolicitudDetalle);
router.post("/api/pedidos/motorizado/accion", pedido_controller_1.PedidoAccion);
router.get("/api/pedidos/motorizado/activo/id", pedido_controller_1.PedidoMotorizadoActivo);
router.get("/api/pedidos/motorizado/activo/detalle", pedido_controller_1.PedidoMotorizadoActivoDetalle);
router.get("/api/pedidos/chat", pedido_controller_1.chatPedidoObtener);
router.post("/api/pedidos/chat/actualizar", pedido_controller_1.chatPedidoUpdate);
router.get("/api/pedidos/motorizado/info", motorizado_controller_1.InfoMotorizado);
router.post("/api/pedidos/motorizado/cambiar/camino", pedido_controller_1.PedidoCambiarCamino);
router.post("/api/pedidos/motorizado/cambiar/ubicacion", pedido_controller_1.PedidoCambiarUbicación);
router.post("/api/pedidos/motorizado/cambiar/finalizar", pedido_controller_1.PedidoCambiarFinalizar);
//Cliente
router.get("/api/login/cliente", cliente_controller_1.LoginCliente);
router.get("/api/pedidos/cliente/existe", cliente_controller_1.PedidoClienteExiste);
router.get("/api/pedidos/cliente/existe/detalle", cliente_controller_1.PedidoClienteExisteDetalle);
router.get("/api/pedidos/activo/estado", cliente_controller_1.EstadoPedido);
router.get("/api/empresas", empresa_controller_1.Empresas);
router.get("/api/empresa", empresa_controller_1.Empresa);
router.get("/api/empresa/config", empresa_controller_1.EmpresaConfig);
router.get("/api/empresa/departamento", empresa_controller_1.EmpresaDepartamento);
router.get("/api/empresa/categorias", empresa_controller_1.CategoriasEmpresa);
router.get("/api/empresa/productos/busqueda", cliente_controller_1.ProductosBusqueda);
router.get("/api/empresa/distrito", empresa_controller_1.EmpresaDistrito);
router.post("/api/pedido/realizar", cliente_controller_1.PedidoRealizar);
router.post("/api/pedido/cancelar", cliente_controller_1.PedidoCancelar);
router.post("/api/cliente/existe", cliente_controller_1.ClienteExiste);
router.post("/api/cliente/registro", cliente_controller_1.ClienteRegistro);
router.get("/api/cliente/anuncios", empresa_controller_1.ClienteAnuncios);
router.post("/api/cliente/hablanos", cliente_controller_1.clienteHablanos);
router.get("/api/empresa/directa", empresa_controller_1.EmpresasDirecta);
router.get("/api/cliente/direcciones", cliente_controller_1.ClienteDirecciones);
router.post("/api/cliente/nueva/direccion", cliente_controller_1.ClienteNuevaDireccion);
router.post("/api/cliente/editar/direccion", cliente_controller_1.ClienteEditarDireccion);
router.post("/api/cliente/eliminar/direccion", cliente_controller_1.ClienteEliminarDireccion);
router.get("/api/cliente/pedido/historial", cliente_controller_1.ClientePedidoHistorial);
router.get("/api/cliente/notificaciones", cliente_controller_1.ClienteNotificaciones);
router.get("/api/cliente/notificaciones/numero", cliente_controller_1.ClienteNumeroNotificaciones);
router.post("/api/cliente/notificaciones/actualizar", cliente_controller_1.ClienteNotificacionesActualizar);
router.post("/api/cliente/notificaciones/eliminar", cliente_controller_1.ClienteNotificacionesEliminar);
//codigo otp
router.post("/api/cliente/validar/otp", cliente_controller_1.ClienteValidarOtp);
router.post("/api/cliente/nuevo/otp", cliente_controller_1.ClienteNuevoOtp);
//Buscad dni
router.post("/api/cliente/buscar/dni", cliente_controller_1.ClienteBuscarDni);
//Web
router.get("/api/pedidos", web_controller_1.obtenerTodosPedidos);
router.get("/api/pedido/detalle", web_controller_1.PedidoDetallePlataforma);
router.post("/api/pedido/asignacion", web_controller_1.PedidoAsignacion);
router.get("/api/motorizados", web_controller_1.Motorizados);
router.post("/api/pedido/preparar", web_controller_1.PedidoPreparar);
//Platadorma
router.get("/api/plataforma/empresa", plataforma_controller_1.EmpresaDatos);
router.get("/api/plataforma/pedidos", plataforma_controller_1.PlataformaPedidos);
router.get("/api/plataforma/detalle/pedido", plataforma_controller_1.PlataformaDetallePedido);
router.post("/api/plataforma/pedidos/aceptar", plataforma_controller_1.PedidoAceptar);
router.post("/api/plataforma/pedido/motorizado/asignar", plataforma_controller_1.PedidoAsignarMotorizado);
router.post("/api/plataforma/pedido/motorizado/cambiar", plataforma_controller_1.PedidoCambiarMotorizado);
router.post("/api/plataforma/pedido/cancelar", plataforma_controller_1.cancelarEstadoPedido);
router.post("/api/plataforma/pedido/rechazar", plataforma_controller_1.PedidoRechazar);
//Configuracion 
router.get("/api/config/app", configuracion_controller_1.ConfiguracionApp);
//Notificaciones
router.get("/fcm/cliente", notificaciones_controller_1.EnviarNotificacionCliente);
router.get("/fcm/motorizado", notificaciones_controller_1.EnviarNotificacionMotorizado);
//router.get("/fcm/topico/promo", EnviarNotificacionTopicoPromo)
//router.get("/fcm/topico/anuncio", EnviarNotificacionTopicoAnuncio)
//router.get("/fcm/todos", EnviarNotificacionTopicoAnuncioTodos)
//Productos sin sistema
router.get("/api/empresa/productos/categorias", empresa_controller_1.EmpresaCategorias);
router.get("/api/empresa/productos/", empresa_controller_1.EmpresaProductos);
router.get("/api/consulta/sistema", empresa_controller_1.EmpresaConsultaSistema);
exports.default = router;
