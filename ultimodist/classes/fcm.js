"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificacionCliente = NotificacionCliente;
exports.NotificacionMotorizado = NotificacionMotorizado;
exports.NotificacionTopicoTodos = NotificacionTopicoTodos;
exports.NotificacionTopico = NotificacionTopico;
exports.NotificacionTopicoPromo = NotificacionTopicoPromo;
exports.NotificacionEstadoPedido = NotificacionEstadoPedido;
exports.NotificacionEstadoMotorizado = NotificacionEstadoMotorizado;
exports.NotificacionMensaje = NotificacionMensaje;
const database_1 = __importDefault(require("../classes/database"));
const fcm_node_1 = __importDefault(require("fcm-node"));
const database = database_1.default.instance;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const SERVER_KEY = process.env.SERVER_KEY;
const SERVER_KEY_MOTORIZADO = process.env.SERVER_KEY_MOTORIZADO;
function NotificacionCliente(token, titulo, msg) {
    return __awaiter(this, void 0, void 0, function* () {
        let fcm = new fcm_node_1.default(SERVER_KEY);
        var message = {
            to: token,
            notification: {
                title: "" + titulo,
                body: "" + msg,
                sound: "jingle",
                vibration: true,
                visibility: 1,
                click_action: "FCM_PLUGIN_ACTIVITY",
                priority: "high",
                color: '#6563A4',
                icon: "fcm_push_icon"
            },
            data: {
                body: 'body',
                title: 'title',
                sound: 'jingle.mp3',
                actionUrl: 'action',
                vibration: true,
                visibility: 1,
            }
        };
        yield new Promise((resolve, reject) => {
            fcm.send(message, (err, response) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(response);
                }
            });
        });
    });
}
function NotificacionMotorizado(token, titulo, msg) {
    return __awaiter(this, void 0, void 0, function* () {
        let fcm = new fcm_node_1.default(SERVER_KEY_MOTORIZADO);
        var message = {
            to: token,
            notification: {
                title: "" + titulo,
                body: "" + msg,
                sound: "jingle",
                click_action: "FCM_PLUGIN_ACTIVITY",
                priority: "high",
                icon: "https://i.pinimg.com/736x/b6/9b/d3/b69bd3f147c5a368a376c65bbf2f9b81--bead-patterns-perler-patterns.jpg'",
                color: '#6563A4',
                //image: 'https://i.pinimg.com/736x/b6/9b/d3/b69bd3f147c5a368a376c65bbf2f9b81--bead-patterns-perler-patterns.jpg'
            },
            data: {
                body: 'body',
                title: 'title',
                actionUrl: 'action'
            }
        };
        yield new Promise((resolve, reject) => {
            fcm.send(message, (err, response) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(response);
                }
            });
        });
    });
}
function NotificacionTopicoTodos(titulo, msg) {
    return __awaiter(this, void 0, void 0, function* () {
        let fcm = new fcm_node_1.default(SERVER_KEY);
        var message = {
            to: "/topics/all",
            notification: {
                title: titulo,
                body: msg,
                sound: "jingle.mp3",
                color: '#6563A4',
                click_action: "FCM_PLUGIN_ACTIVITY",
                priority: "high",
                icon: "fcm_push_icon"
            },
            data: { //you can send only notification or only data(or include both)
            }
        };
        yield new Promise((resolve, reject) => {
            fcm.send(message, (err, response) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(response);
                }
            });
        });
    });
}
function NotificacionTopico(topico, titulo, msg) {
    return __awaiter(this, void 0, void 0, function* () {
        let fcm = new fcm_node_1.default(SERVER_KEY);
        var message = {
            to: "/topics/anuncio-" + topico,
            notification: {
                title: titulo,
                body: msg,
                sound: "jingle.mp3",
                color: '#6563A4',
                click_action: "FCM_PLUGIN_ACTIVITY",
                priority: "high",
                icon: "fcm_push_icon"
            },
            data: {
                anuncio: true
            }
        };
        yield new Promise((resolve, reject) => {
            fcm.send(message, (err, response) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(response);
                }
            });
        });
    });
}
function NotificacionTopicoPromo(topico, titulo, msg, object) {
    return __awaiter(this, void 0, void 0, function* () {
        let fcm = new fcm_node_1.default(SERVER_KEY);
        var message = {
            to: "/topics/anuncio-" + topico,
            notification: {
                title: titulo,
                body: msg,
                sound: "jingle.mp3",
                color: '#6563A4',
                click_action: "FCM_PLUGIN_ACTIVITY",
                priority: "high",
                icon: "fcm_push_icon"
            },
            data: {
                promocion: true,
                actionUrl: '/principal/empresa',
                empresa: JSON.stringify(object)
            }
        };
        yield new Promise((resolve, reject) => {
            fcm.send(message, (err, response) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(response);
                }
            });
        });
    });
}
function NotificacionEstadoPedido(idCliente, token, opc, tienesistema) {
    return __awaiter(this, void 0, void 0, function* () {
        let fcm = new fcm_node_1.default(SERVER_KEY);
        let message = {};
        switch (opc) {
            case 'PU':
                message = {
                    to: token,
                    notification: {
                        title: '¡En Camino!',
                        body: (tienesistema == 1 ? 'Su pedido está en camino a su ubicación.' : 'Comprando y en camino a su ubicación.'),
                        sound: "jingle.mp3",
                        color: '#6563A4',
                        click_action: "FCM_PLUGIN_ACTIVITY",
                        priority: "high",
                        icon: "fcm_push_icon"
                    },
                    data: {
                        ruta: true,
                        estado: 'PU',
                    }
                };
                break;
            case 'UC':
                message = {
                    to: token,
                    notification: {
                        title: '¡Ha Llegado!',
                        body: 'El repartidor ha llegado con su pedido a su ubicación.',
                        sound: "jingle.mp3",
                        color: '#6563A4',
                        click_action: "FCM_PLUGIN_ACTIVITY",
                        priority: "high",
                        icon: "fcm_push_icon"
                    },
                    data: {
                        ruta: true,
                        estado: 'UC',
                    }
                };
                break;
            case 'PE':
                message = {
                    to: token,
                    notification: {
                        title: (tienesistema == 1 ? '¡Aceptado y Preparando!' : 'Pedido Aceptado'),
                        body: (tienesistema == 1 ? 'Su pedido ha comenzado a prepararse.' : 'Su pedido se ha aceptado, esperando repartidor.'),
                        sound: "jingle.mp3",
                        color: '#6563A4',
                        click_action: "FCM_PLUGIN_ACTIVITY",
                        priority: "high",
                        icon: "fcm_push_icon"
                    },
                    data: {
                        ruta: true,
                        estado: 'F',
                    }
                };
                break;
            case 'F':
                message = {
                    to: token,
                    notification: {
                        title: '¡Finalizado!',
                        body: 'Su pedido se ha completado, gracias por la confianza.',
                        sound: "jingle.mp3",
                        color: '#6563A4',
                        click_action: "FCM_PLUGIN_ACTIVITY",
                        priority: "high",
                        icon: "fcm_push_icon"
                    },
                    data: {
                        ruta: true,
                        estado: 'F',
                    }
                };
                break;
            default:
                break;
        }
        return new Promise((resolve, reject) => {
            fcm.send(message, (err, response) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(response);
                }
            });
        });
    });
}
function NotificacionEstadoMotorizado(idMotorizado) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let conn = yield database.conexionObtener();
            let notificaciones = yield conn.query("SELECT TokenFcm FROM Gen_Motorizado WHERE IdMotorizado = " + idMotorizado);
            let notificacionesFinales = JSON.parse(JSON.stringify(notificaciones[0]));
            if (notificacionesFinales.length > 0) {
                if (notificacionesFinales[0].TokenFcm != null && notificacionesFinales[0].TokenFcm != '') {
                    let fcm = new fcm_node_1.default(SERVER_KEY_MOTORIZADO);
                    let message = {
                        to: notificacionesFinales[0].TokenFcm,
                        notification: {
                            title: '¡Nuevo viaje!',
                            body: 'Tiene una nueva solicitud de viaje!!!',
                            sound: "jingle.mp3",
                            color: '#6563A4',
                            click_action: "FCM_PLUGIN_ACTIVITY",
                            priority: "high",
                            icon: "fcm_push_icon"
                        },
                        data: {
                            motorizado: true,
                            estado: 'PU',
                        }
                    };
                    return new Promise((resolve, reject) => {
                        fcm.send(message, (err, response) => {
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve(response);
                            }
                        });
                    });
                }
                else {
                    return null;
                }
            }
            else {
                return null;
            }
        }
        catch (error) {
            return null;
        }
    });
}
function NotificacionMensaje(opc, token, autor, mensaje, titulo) {
    return __awaiter(this, void 0, void 0, function* () {
        let fcm = new fcm_node_1.default(opc == 2 ? SERVER_KEY : SERVER_KEY_MOTORIZADO);
        let message = {
            to: token,
            notification: {
                title: titulo,
                body: autor + ": " + mensaje,
                sound: "jingle.mp3",
                color: '#6563A4',
                click_action: "FCM_PLUGIN_ACTIVITY",
                priority: "high",
                icon: "fcm_push_icon"
            },
            data: {
                mensaje: true,
                mensajeBody: mensaje,
                autor: autor
            }
        };
        return new Promise((resolve, reject) => {
            fcm.send(message, (err, response) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(response);
                }
            });
        });
    });
}
/*
export async function NotificacionMensaje(idCliente:number,token:string,opc:string){
    let fcm = new FCM(SERVER_KEY);
    let message = {};
    switch (opc) {
        case 'PU':
            message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                to: token,
                
                notification: {
                    title: 'En Camino!',
                    body: 'Su pedido está en camino a su ubicación.',
                    sound:"jingle.mp3",
                    click_action:"FCM_PLUGIN_ACTIVITY",
                    priority: "high",
                    icon:"fcm_push_icon"
                },
                
                data: {  //you can send only notification or only data(or include both)
                    ruta: true,
                    estado:'PU',
                }
            }
            break;
        case 'UC':
             message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                to: token,
                
                notification: {
                    title: 'Ha Llegado!!',
                    body: 'El repartidor ha llegado a su ubicación.',
                    sound:"jingle.mp3",
                    click_action:"FCM_PLUGIN_ACTIVITY",
                    priority: "high",
                    icon:"fcm_push_icon"
                },
                
                data: {  //you can send only notification or only data(or include both)
                    ruta: true,
                    estado:'UC',
                }
            }
            break;
        case 'F':
             message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                to: token,
                
                notification: {
                    title: 'Finalizado',
                    body: 'Pedido completado, gracias por la confianza.',
                    sound:"jingle.mp3",
                    click_action:"FCM_PLUGIN_ACTIVITY",
                    priority: "high",
                    icon:"fcm_push_icon"
                },
                
                data: {  //you can send only notification or only data(or include both)
                    ruta: true,
                    estado:'F',
                }
            }
            break;
    
        default:
            break;
    }

    return new Promise((resolve,reject)=>{
        fcm.send(message,(err:any, response:any)=>{
            if (err) {
                reject(err);
            } else {
                resolve(response);
            }
        })
    })
}
*/ 
