
import Database from "../classes/database";
import FCM from 'fcm-node';
const database = Database.instance;
import * as dotenv from "dotenv";
dotenv.config();
const SERVER_KEY = process.env.SERVER_KEY;
const SERVER_KEY_MOTORIZADO = process.env.SERVER_KEY_MOTORIZADO;

export async function NotificacionCliente(token:string,titulo:string,msg:string){
    let fcm = new FCM(SERVER_KEY);
    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: token,
        
        notification: {
            title: ""+titulo, 
            body: ""+msg,
            sound:"jingle",
            vibration: true,
            visibility: 1,
            click_action:"FCM_PLUGIN_ACTIVITY",
            priority: "high",
            color: '#6563A4',
            icon:"fcm_push_icon"
        },
        
        data: {  //you can send only notification or only data(or include both)
            body:'body',
            title:'title',
            sound: 'jingle.mp3',
            actionUrl:'action',
            vibration: true,
            visibility: 1,
        }
    }

    await new Promise((resolve,reject)=>{
        fcm.send(message,(err:any, response:any)=>{
            if (err) {
                reject(err);
            } else {
                resolve(response);
            }
        })
    })
}

export async function NotificacionMotorizado(token:string,titulo:string,msg:string){
    let fcm = new FCM(SERVER_KEY_MOTORIZADO);
    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: token,
        
        notification: {
            title: ""+titulo, 
            body: ""+msg,
            sound:"jingle",
            click_action:"FCM_PLUGIN_ACTIVITY",
            priority: "high",
            icon:"https://i.pinimg.com/736x/b6/9b/d3/b69bd3f147c5a368a376c65bbf2f9b81--bead-patterns-perler-patterns.jpg'",
            color: '#6563A4',
            //image: 'https://i.pinimg.com/736x/b6/9b/d3/b69bd3f147c5a368a376c65bbf2f9b81--bead-patterns-perler-patterns.jpg'
        },
        
        data: {  //you can send only notification or only data(or include both)
            body:'body',
            title:'title',
            actionUrl:'action'
        }
    }


    await new Promise((resolve,reject)=>{
        fcm.send(message,(err:any, response:any)=>{
            if (err) {
                reject(err);
            } else {
                resolve(response);
            }
        })
    })
}

export async function NotificacionTopicoTodos(titulo:string,msg:string){
    let fcm = new FCM(SERVER_KEY);
    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to:"/topics/all",
        
        notification: {
            title: titulo, 
            body: msg,
            sound:"jingle.mp3",
            color: '#6563A4',
            click_action:"FCM_PLUGIN_ACTIVITY",
            priority: "high",
            icon:"fcm_push_icon"
        },
        
        data: {  //you can send only notification or only data(or include both)
        }
    }


    await new Promise((resolve,reject)=>{
        fcm.send(message,(err:any, response:any)=>{
            if (err) {
                reject(err);
            } else {
                resolve(response);
            }
        })
    })
}

export async function NotificacionTopico(topico:string,titulo:string,msg:string){
    let fcm = new FCM(SERVER_KEY);
    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to:"/topics/anuncio-"+topico,
        
        notification: {
            title: titulo, 
            body: msg,
            sound:"jingle.mp3",
            color: '#6563A4',
            click_action:"FCM_PLUGIN_ACTIVITY",
            priority: "high",
            icon:"fcm_push_icon"
        },
        
        data: {  //you can send only notification or only data(or include both)
            anuncio:true
        }
    }


    await new Promise((resolve,reject)=>{
        fcm.send(message,(err:any, response:any)=>{
            if (err) {
                reject(err);
            } else {
                resolve(response);
            }
        })
    })
}

export async function NotificacionTopicoPromo(topico:string,titulo:string,msg:string,object:any){
    let fcm = new FCM(SERVER_KEY);
    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to:"/topics/anuncio-"+topico,
        
        notification: {
            title: titulo, 
            body: msg,
            sound:"jingle.mp3",
            color: '#6563A4',
            click_action:"FCM_PLUGIN_ACTIVITY",
            priority: "high",
            icon:"fcm_push_icon"
        },
        
        data: {  //you can send only notification or only data(or include both)
            promocion:true,
            actionUrl:'/principal/empresa',
            empresa: JSON.stringify(object)
        }
    }


    await new Promise((resolve,reject)=>{
        fcm.send(message,(err:any, response:any)=>{
            if (err) {
                reject(err);
            } else {
                resolve(response);
            }
        })
    })
}


export async function NotificacionEstadoPedido(idCliente:number,token:string,opc:string,tienesistema:number){
    let fcm = new FCM(SERVER_KEY);
    let message = {};
    switch (opc) {
        case 'PU':
            message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                to: token, 
                
                notification: {
                    title: '¡En Camino!', 
                    body: (tienesistema==1?'Su pedido está en camino a su ubicación.':'Comprando y en camino a su ubicación.'),
                    sound:"jingle.mp3",
                    color: '#6563A4',
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
                    title: '¡Ha Llegado!', 
                    body: 'El repartidor ha llegado con su pedido a su ubicación.',
                    sound:"jingle.mp3",
                    color: '#6563A4',
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
        case 'PE':
             message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                to: token, 
                
                notification: {
                    title: (tienesistema==1?'¡Aceptado y Preparando!':'Pedido Aceptado'), 
                    body: (tienesistema==1?'Su pedido ha comenzado a prepararse.':'Su pedido se ha aceptado, esperando repartidor.'),
                    sound:"jingle.mp3",
                    color: '#6563A4',
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
        case 'F':
            message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                to: token, 
                
                notification: {
                    title: '¡Finalizado!', 
                    body: 'Su pedido se ha completado, gracias por la confianza.',
                    sound:"jingle.mp3",
                    color: '#6563A4',
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

export async function NotificacionEstadoMotorizado(idMotorizado:string){

    try {
        let conn = await database.conexionObtener();
        let notificaciones = await conn.query("SELECT TokenFcm FROM Gen_Motorizado WHERE IdMotorizado = "+idMotorizado);
        let notificacionesFinales = JSON.parse(JSON.stringify(notificaciones[0]));
        if (notificacionesFinales.length > 0) {
            if(notificacionesFinales[0].TokenFcm != null && notificacionesFinales[0].TokenFcm!='' ){
                let fcm = new FCM(SERVER_KEY_MOTORIZADO);
                let message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                    to: notificacionesFinales[0].TokenFcm, 
                    
                    notification: {
                        title: '¡Nuevo viaje!', 
                        body: 'Tiene una nueva solicitud de viaje!!!',
                        sound:"jingle.mp3",
                        color: '#6563A4',
                        click_action:"FCM_PLUGIN_ACTIVITY",
                        priority: "high",
                        icon:"fcm_push_icon"
                    },
                    
                    data: {  //you can send only notification or only data(or include both)
                        motorizado: true,
                        estado:'PU',
                    }
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
            
            }else{
                return null;
            }

        } else {
            return null;
        }

    } catch (error){
        return null;
    }
}


export async function NotificacionMensaje(opc:number,token:string,autor:string,mensaje:string,titulo:string){
    let fcm = new FCM(opc==2?SERVER_KEY:SERVER_KEY_MOTORIZADO);

    let message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: token, 
        
        notification: {
            title: titulo, 
            body: autor+": "+mensaje,
            sound:"jingle.mp3",
            color: '#6563A4',
            click_action:"FCM_PLUGIN_ACTIVITY",
            priority: "high",
            icon:"fcm_push_icon"
        },
        
        data: {  //you can send only notification or only data(or include both)
            mensaje: true,
            mensajeBody:mensaje,
            autor:autor
        }
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