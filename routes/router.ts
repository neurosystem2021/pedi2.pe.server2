import { Router } from "express";
import fs from "fs";
import { LoginMotorizado,EmpresasMotorizado, InfoMotorizado, MotorizadoGrupo } from "../controllers/motorizado.controller";
import { Motorizados, obtenerTodosPedidos, PedidoAsignacion, PedidoDetallePlataforma, PedidoPreparar } from "../controllers/web.controller";
import { PedidoAccion,chatPedidoUpdate, PedidoMotorizadoSolicitud,
PedidoMotorizadoSolicitudDetalle, PedidoMotorizadoActivo,
chatPedidoObtener, PedidoMotorizadoActivoDetalle, PedidoCambiarUbicación, PedidoCambiarFinalizar, PedidoCambiarCamino, } from "../controllers/pedido.controller";
import { ClienteBuscarDni, ClienteDirecciones, ClienteEditarDireccion, ClienteEliminarDireccion, ClienteExiste, clienteHablanos, ClienteNotificaciones, ClienteNotificacionesActualizar, ClienteNotificacionesEliminar, ClienteNuevaDireccion, ClienteNuevoOtp, ClienteNumeroNotificaciones, ClientePedidoHistorial, ClienteRegistro, ClienteValidarOtp, EstadoPedido, LoginCliente , PedidoCancelar, PedidoClienteExiste, PedidoClienteExisteDetalle, PedidoRealizar, ProductosBusqueda } from "../controllers/cliente.controller";
import { Empresas, Empresa, EmpresaDepartamento, EmpresaDistrito, EmpresaConfig, ClienteAnuncios, CategoriasEmpresa, EmpresaProductos, EmpresaCategorias, EmpresaConsultaSistema, EmpresasDirecta } from "../controllers/empresa.controller";
import { EmpresaDatos, PedidoAceptar, PlataformaDetallePedido, PlataformaPedidos, PedidoAsignarMotorizado, PedidoCambiarMotorizado, cancelarEstadoPedido, PedidoRechazar } from "../controllers/plataforma.controller";
import { ConfiguracionApp } from "../controllers/configuracion.controller";
import { EnviarNotificacionCliente, EnviarNotificacionMotorizado, EnviarNotificacionTopicoAnuncio, EnviarNotificacionTopicoAnuncioTodos, EnviarNotificacionTopicoPromo } from "../controllers/notificaciones.controller";
const router = Router();

//Motorizado
router.get("/api/login/motorizado", LoginMotorizado);
router.get("/api/empresas/motorizado", EmpresasMotorizado);
router.get("/api/empresas/motorizado/grupo", MotorizadoGrupo);

//Pedidos
router.get("/api/pedidos/motorizado/solicitud", PedidoMotorizadoSolicitud)
router.get("/api/pedidos/motorizado/solicitud/detalle", PedidoMotorizadoSolicitudDetalle)
router.post("/api/pedidos/motorizado/accion", PedidoAccion)
router.get("/api/pedidos/motorizado/activo/id", PedidoMotorizadoActivo)
router.get("/api/pedidos/motorizado/activo/detalle", PedidoMotorizadoActivoDetalle)
router.get("/api/pedidos/chat", chatPedidoObtener)
router.post("/api/pedidos/chat/actualizar", chatPedidoUpdate)
router.get("/api/pedidos/motorizado/info", InfoMotorizado)


router.post("/api/pedidos/motorizado/cambiar/camino", PedidoCambiarCamino)
router.post("/api/pedidos/motorizado/cambiar/ubicacion", PedidoCambiarUbicación)
router.post("/api/pedidos/motorizado/cambiar/finalizar", PedidoCambiarFinalizar)


//Cliente
router.get("/api/login/cliente", LoginCliente)
router.get("/api/pedidos/cliente/existe", PedidoClienteExiste)
router.get("/api/pedidos/cliente/existe/detalle", PedidoClienteExisteDetalle)
router.get("/api/pedidos/activo/estado", EstadoPedido)
router.get("/api/empresas",Empresas)
router.get("/api/empresa",Empresa)
router.get("/api/empresa/config",EmpresaConfig)
router.get("/api/empresa/departamento",EmpresaDepartamento)
router.get("/api/empresa/categorias",CategoriasEmpresa)
router.get("/api/empresa/productos/busqueda",ProductosBusqueda)
router.get("/api/empresa/distrito",EmpresaDistrito)
router.post("/api/pedido/realizar", PedidoRealizar)
router.post("/api/pedido/cancelar", PedidoCancelar)
router.post("/api/cliente/existe", ClienteExiste)
router.post("/api/cliente/registro", ClienteRegistro)
router.get("/api/cliente/anuncios", ClienteAnuncios)
router.post("/api/cliente/hablanos", clienteHablanos)
router.get("/api/empresa/directa", EmpresasDirecta)

router.get("/api/cliente/direcciones", ClienteDirecciones)
router.post("/api/cliente/nueva/direccion", ClienteNuevaDireccion)
router.post("/api/cliente/editar/direccion", ClienteEditarDireccion)
router.post("/api/cliente/eliminar/direccion", ClienteEliminarDireccion)

router.get("/api/cliente/pedido/historial", ClientePedidoHistorial)

router.get("/api/cliente/notificaciones", ClienteNotificaciones)
router.get("/api/cliente/notificaciones/numero", ClienteNumeroNotificaciones)
router.post("/api/cliente/notificaciones/actualizar", ClienteNotificacionesActualizar)
router.post("/api/cliente/notificaciones/eliminar", ClienteNotificacionesEliminar)

//codigo otp
router.post("/api/cliente/validar/otp", ClienteValidarOtp)
router.post("/api/cliente/nuevo/otp", ClienteNuevoOtp)
//Buscad dni
router.post("/api/cliente/buscar/dni", ClienteBuscarDni)



//Web
router.get("/api/pedidos", obtenerTodosPedidos)
router.get("/api/pedido/detalle", PedidoDetallePlataforma)
router.post("/api/pedido/asignacion", PedidoAsignacion)
router.get("/api/motorizados", Motorizados)
router.post("/api/pedido/preparar", PedidoPreparar)

//Platadorma
router.get("/api/plataforma/empresa", EmpresaDatos)
router.get("/api/plataforma/pedidos", PlataformaPedidos)
router.get("/api/plataforma/detalle/pedido", PlataformaDetallePedido)
router.post("/api/plataforma/pedidos/aceptar", PedidoAceptar)
router.post("/api/plataforma/pedido/motorizado/asignar", PedidoAsignarMotorizado)
router.post("/api/plataforma/pedido/motorizado/cambiar", PedidoCambiarMotorizado)
router.post("/api/plataforma/pedido/cancelar", cancelarEstadoPedido) 
router.post("/api/plataforma/pedido/rechazar", PedidoRechazar)

//Configuracion 
router.get("/api/config/app", ConfiguracionApp)


//Notificaciones
router.get("/fcm/cliente", EnviarNotificacionCliente)
router.get("/fcm/motorizado", EnviarNotificacionMotorizado)
//router.get("/fcm/topico/promo", EnviarNotificacionTopicoPromo)
//router.get("/fcm/topico/anuncio", EnviarNotificacionTopicoAnuncio)
//router.get("/fcm/todos", EnviarNotificacionTopicoAnuncioTodos)

//Productos sin sistema
router.get("/api/empresa/productos/categorias" , EmpresaCategorias);
router.get("/api/empresa/productos/", EmpresaProductos);
router.get("/api/consulta/sistema", EmpresaConsultaSistema);

export default router;
