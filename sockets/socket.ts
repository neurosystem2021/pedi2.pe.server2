import { Socket } from "socket.io";
import { UsuariosLista } from "../classes/usuario-lista";
import { Usuario } from "../classes/usuario";

import { PlataformasLista } from "../classes/plataforma-lista";
import { ClientesLista } from "../classes/cliente-lista";
import { MotorizadosLista } from "../classes/motorizado-lista";
import { AdminLista } from "../classes/admin-lista";

import { Motorizado } from "../classes/motorizado";
import { Cliente } from "../classes/cliente";
import { Plataforma } from "../classes/plataforma";
import { Admin } from "../classes/admin";


export const usuariosConectados = new UsuariosLista();
export const motorizadosConectados = new MotorizadosLista();
export const clientesConectados = new ClientesLista();
export const plataformasConectados = new PlataformasLista();
export const adminsConectados = new AdminLista();

export const conectar = (clienteSocket: Socket, io: SocketIO.Server) => {
  clienteSocket.on(
    "conectar",
    async (payload: {tipo: string; objeto:any}, callback2: Function) => {
      //console.log(payload.objeto);
      let existe;
      switch (payload.tipo) {
        case 'MOTORIZADO':
          //existe = motorizadosConectados.existeMotorizado(payload.objeto.iddb);
          existe = false;
          break;
        case 'CLIENTE':
          //existe = clientesConectados.existeCliente(payload.objeto.iddb);
          existe = false;
          break;
        case 'PLATAFORMA':
          existe = false;
          break;

        case 'ADMIN':
          existe = false;
          break;

        default:
          existe = false;
          break;
      }

      if (!existe) {

        switch (payload.tipo) {
          case 'MOTORIZADO':
            const motorizado = new Motorizado(clienteSocket.id,payload.objeto.iddb,payload.objeto.nombres,payload.objeto.apellidos,payload.objeto.token,0,0,[],payload.objeto.idregion);
            motorizadosConectados.addMotorizado(motorizado);
            let listaPlataformas = plataformasConectados.getListaPlataforma();
            let listaPlataformasfiltrada = listaPlataformas.map((a) => a.idws);
            for (let index = 0; index < listaPlataformasfiltrada.length; index++) {
              io.to("" + listaPlataformasfiltrada).emit("lista-on-motorizado",motorizadosConectados.getListaMotorizado());
            }

            if(payload.objeto.idregion!=0){
              let lista = adminsConectados.getListaAdmin().filter((a)=>a.idregion == payload.objeto.idregion);
              let listaFiltrada = lista.map((a)=>a.idws);
              for (let index = 0; index < listaFiltrada.length; index++) {
                io.to("" + listaFiltrada).emit("lista-on-motorizado",motorizadosConectados.getListaMotorizado().filter((m)=>m.idregion==payload.objeto.idregion));
              }
            }
            break;
          case 'CLIENTE':
            const cliente = new Cliente(clienteSocket.id,payload.objeto.iddb,payload.objeto.nombres,payload.objeto.apellidos,payload.objeto.token);
            clientesConectados.addCliente(cliente);
            break;
          
          case 'PLATAFORMA':
            const plataforma = new Plataforma(clienteSocket.id,payload.objeto.iddb,payload.objeto.urlplat,payload.objeto.idalmacen);
            plataformasConectados.addPlataforma(plataforma);

          case 'ADMIN':
            const admin = new Admin(clienteSocket.id,payload.objeto.iddb,payload.objeto.nombre,payload.objeto.idperfil,payload.objeto.idregion)
            adminsConectados.addAdmin(admin)
            break;
        }

      } else {

      }

      await callback2({
        existe: existe,
        //estado: estado
      });

    }
  );
};

export const desconectar = (clienteSocket: Socket, io: SocketIO.Server) => {
  clienteSocket.on("disconnect", () => {
    let cliente = clientesConectados.getClienteIdWs(clienteSocket.id);
    let motorizado = motorizadosConectados.getMotorizadoIdWs(clienteSocket.id);
    let plataforma = plataformasConectados.getPlataformaIdWs(clienteSocket.id);
    let admin = adminsConectados.getAdminIdWs(clienteSocket.id);
    if(cliente != undefined){
      clientesConectados.deleteCliente(clienteSocket.id);
      //console.log("Cliente "+cliente.nombres + " desconectado." );
    }else if(motorizado != undefined ){
      motorizadosConectados.deleteMotorizado(clienteSocket.id);
      emitirActulizacionMotorizado(io,motorizado.empresasMotorizado);
      emitirActulizacionMotorizadoAdmin(io,motorizado.idregion);
      //console.log("Motorizado "+motorizado.nombres + " desconectado.");
    }else if(plataforma != undefined ){
      plataformasConectados.deletePlataforma(clienteSocket.id);
      //console.log("Plataforma "+plataforma.urlPlat + " desconectada.");
    }else if(admin != undefined)
      adminsConectados.deleteAdmin(clienteSocket.id);
  });
};

const emitirActulizacionMotorizado = (io: SocketIO.Server,empresas:any) => {
  //borrar online motorizado
  if(empresas.length>0){
    for (let index = 0; index <empresas.length; index++) {
      let plataformas = plataformasConectados.getListaPlataforma().filter((plat)=>plat.urlPlat==empresas[index].FacturaUrl && plat.idAlmacen==empresas[index].IdAlmacen)
      let plataformasFiltrada = plataformas.map((a) => a.idws);  
      let motorizadosFiltro: Motorizado[]= [];
      motorizadosConectados.getListaMotorizado().map((motorizado)=>{
        motorizado.empresasMotorizado.map((emp:any)=>{
          if(emp.FacturaUrl==empresas[index].FacturaUrl && emp.IdAlmacen == empresas[index].IdAlmacen){
            motorizadosFiltro.push(motorizado)
          }
        })
      })
      for (let index = 0; index < plataformas.length; index++) {
        io.to("" + plataformasFiltrada[index]).emit("lista-on-motorizado",motorizadosFiltro);
      }
    }
  }
};

const emitirActulizacionMotorizadoAdmin = (io: SocketIO.Server,idregion:number) => {
  //borrar online motorizado
  if(idregion != 0){
    let lista = adminsConectados.getListaAdmin().filter((a)=>a.idregion == idregion);
    let listaFiltrada = lista.map((a)=>a.idws);
    for (let index = 0; index < listaFiltrada.length; index++) {
      io.to("" + listaFiltrada).emit("lista-on-motorizado",motorizadosConectados.getListaMotorizado().filter((m)=>m.idregion==idregion));
    }
  }
};



export const pedidoCancelado = (cliente: Socket, io: SocketIO.Server) => {
  cliente.on(
    "emitir-cancelado-pedido",
    async (payload: { nombre: string, idPedido:any , idEmpresa:any}, callback: Function) => {
      let data = {
        nombre: payload.nombre,
        idPedido: payload.idPedido,
        idEmpresa:payload.idEmpresa
      };

      let plataformas = plataformasConectados.getListaPlataforma().filter((plat)=>plat.iddb==payload.idEmpresa)
      let plataformasFiltrada = plataformas.map((a) => a.idws); 
      for (let index = 0; index < plataformas.length; index++) {
        io.to("" + plataformasFiltrada[index]).emit("cancelado-pedido",data);
      }
    }
  );
};

export const pedidoNuevo = (cliente: Socket, io: SocketIO.Server) => {
  cliente.on(
    "emitir-nuevo-pedido",
    async (payload: { nombres: string, plataforma:string, idalmacen:number,iddbempresa:number,tienesistema:number,idregion:number}, callback: Function) => {
      let lista = []
      let listaFiltrada = []
      let listaAdminDash = adminsConectados.getListaAdmin().map((a) => a.idws)
      if(payload.tienesistema == 0){
        lista = adminsConectados.getListaAdmin().filter((a)=>a.idregion == payload.idregion);
        listaFiltrada = lista.map((a)=>a.idws);
      }else{
        lista = plataformasConectados.getListaPlataforma().filter((p) => p.urlPlat === payload.plataforma && p.idAlmacen== payload.idalmacen);
        listaFiltrada = lista.map((a) => a.idws);
      }
      let data = {
        nombre: payload.nombres
      }
      for (let index = 0; index < listaFiltrada.length; index++) {
        io.to("" + listaFiltrada[index]).emit("nuevo-pedido", data);
      }
      for (let index2 = 0; index2 < listaAdminDash.length; index2++) {
        io.to("" + listaAdminDash[index2]).emit("nuevo-pedido-dash", data);
      }
    }
  );
};

/*
export const motorizadosOnline = (cliente: Socket, io: SocketIO.Server) => {
  cliente.on("motorizado-nuevo-on", (callback: Function) => {
    let listaweb = usuariosConectados.getLista().filter((u) => u.tipo == "web");
    let listamotorizado = usuariosConectados.getLista().filter((u) => u.tipo == "MOTORIZADO");
    let listaWebfiltrada = listaweb.map((a) => a.idws);
    let listaMotorizado= usuariosConectados.getLista().filter((u) => u.tipo == "MOTORIZADO");

    for (let index = 0; index < listaweb.length; index++) {
      io.to("" + listaWebfiltrada[index]).emit(
        "lista-on-motorizado",
        listaMotorizado
      );
    }

    callback({
      ok: true,
      mensaje: "recibio info motorizado",
    });
  });
};
*/

export const nuevoViaje = (cliente: Socket, io: SocketIO.Server) => {
  cliente.on("nuevo-viaje-solicitado", (payload:{idmotorizado:string,idpedido:string,cliente:string},callback: Function) => {
    let listaMotorizado = motorizadosConectados.getListaMotorizado().filter((m)=> m.iddb == payload.idmotorizado);
    let listafiltradaMotorizado = listaMotorizado.map((a) => a.idws);
    for (let index = 0; index < listafiltradaMotorizado.length; index++) {
      io.to("" + listafiltradaMotorizado[index]).emit("nuevo-viaje-recibido", payload);
    }
  });
};

//NUEVOS SOCKET
//escuchar mensaje verificar
export const mensajeChat = (cliente: Socket, io: SocketIO.Server) => {
  cliente.on("mensaje-emitir", (payload: { iddb: string, idPedido: string, tipo:string, msg:string },callback: Function) => {
    switch (payload.tipo) {
      case 'CLIENTE':
        let listaCliente = clientesConectados.getListaCliente().filter((c) => c.iddb == payload.iddb);
        let listafiltradaCliente = listaCliente.map((a) => a.idws);
        for (let index = 0; index < listafiltradaCliente.length; index++) {
          io.to("" + listafiltradaCliente[index]).emit("mensaje-recibido", payload);
        }

      case 'MOTORIZADO':
        let listaMotorizado = motorizadosConectados.getListaMotorizado().filter((m) => m.iddb == payload.iddb);
        let listafiltradaMotorizado = listaMotorizado.map((a) => a.idws);
        for (let index = 0; index < listafiltradaMotorizado.length; index++) {
          io.to("" + listafiltradaMotorizado[index]).emit("mensaje-recibido", payload);
        }
    }
  });
};


//
export const estadoPedidoCambio = (cliente: Socket, io: SocketIO.Server) => {
  cliente.on("estado-pedido-actualizar", (payload: { iddb: string, idpedido: string, tipo:string, estado:string, plataforma:string, idalmacen:number, idregion:number },callback: Function) => {
    switch (payload.tipo) {
      case 'CLIENTE':
        let listaCliente = clientesConectados.getListaCliente().filter((c) => c.iddb == payload.iddb);
        let listafiltradaCliente = listaCliente.map((a) => a.idws);
        for (let index = 0; index < listafiltradaCliente.length; index++) {
          io.to("" + listafiltradaCliente[index]).emit("estado-pedido-actualizado", payload);
        }

        let lista = plataformasConectados.getListaPlataforma().filter((p) => p.urlPlat === payload.plataforma && p.idAlmacen== payload.idalmacen);
        let listafiltrada = lista.map((a) => a.idws);
        for (let index = 0; index < listafiltrada.length; index++) {
          io.to("" + listafiltrada[index]).emit("estado-pedido-actualizado-plataforma", payload);
        }

        if(payload.idregion != 0){
          let lista = adminsConectados.getListaAdmin().filter((a)=>a.idregion == payload.idregion);
          let listaFiltrada = lista.map((a)=>a.idws);
          for (let index = 0; index < listaFiltrada.length; index++) {
            io.to("" + listaFiltrada).emit("estado-pedido-actualizado",payload);
          }
        }
        break;
    
      case 'MOTORIZADO':
        let listaMotorizado = motorizadosConectados.getListaMotorizado().filter((m) => m.iddb == payload.iddb);
        let listafiltradaMotorizado = listaMotorizado.map((a) => a.idws);
        for (let index = 0; index < listafiltradaMotorizado.length; index++) {
          io.to("" + listafiltradaMotorizado[index]).emit("estado-pedido-actualizado", payload);
        }
        break;
    }
  });
};

export const ubicacionMotorizado = (cliente: Socket, io: SocketIO.Server) => {

  cliente.on("ubicacion-motorizado-actualizar", (payload: { idmotorizado:string, idcliente:string,idpedido:string,
     latitud:string,longitud:string, tipo:string },callback: Function) => {

      switch (payload.tipo) {
        case 'CLIENTE':
          let infoMotorizado = {
            IdMotorizado: payload.idmotorizado,
            IdCliente: payload.idcliente,
            IdPedido: payload.idpedido,
            Latitud: payload.latitud,
            Longitud: payload.longitud
          }
          let listaCliente = clientesConectados.getListaCliente().filter((c) => c.iddb == payload.idcliente);
          let listafiltradaCliente = listaCliente.map((a) => a.idws);
          for (let index = 0; index < listafiltradaCliente.length; index++) {
            io.to("" + listafiltradaCliente[index]).emit("ubicacion-motorizado-recibir", infoMotorizado);
          }

          break;
      }
  });
};



export const estadoPedidoPlataforma = (cliente: Socket, io: SocketIO.Server) => {

  cliente.on("estado-pedido-emitir-plataforma", (payload: { IdCliente:string,
     IdPedido:string, Estado:string, IdMotorizado:any },callback: Function) => {
    let infoPedido = {
      IdPedido: payload.IdPedido,
      Estado: payload.Estado
    }

    let listaCliente = clientesConectados.getListaCliente().filter((c)=>c.iddb == payload.IdCliente);
    let listafiltradaCliente = listaCliente.map((a) => a.idws);
    for (let index = 0; index < listafiltradaCliente.length; index++) {
      io.to("" + listafiltradaCliente[index]).emit("estado-pedido-actualizado", infoPedido);
    }


    if(payload.IdMotorizado!=null){
      let listaMotorizado = motorizadosConectados.getListaMotorizado().filter((m)=>m.iddb == payload.IdMotorizado);
      let listafiltradaMotorizado = listaMotorizado.map((a) => a.idws);
      for (let index = 0; index < listafiltradaMotorizado.length; index++) {
        io.to("" + listafiltradaMotorizado[index]).emit("estado-pedido-actualizado", infoPedido);
      }
    }

  });
};

export const estadoPedidoAdmin = (cliente: Socket, io: SocketIO.Server) => {

  cliente.on("estado-pedido-emitir-admin", (payload: { IdCliente:string,
     IdPedido:string, Estado:string, IdMotorizado:any, IdRegion:number },callback: Function) => {
    let infoPedido = {
      IdPedido: payload.IdPedido,
      Estado: payload.Estado
    }

    let listaCliente = clientesConectados.getListaCliente().filter((c)=>c.iddb == payload.IdCliente);
    let listafiltradaCliente = listaCliente.map((a) => a.idws);
    for (let index = 0; index < listafiltradaCliente.length; index++) {
      io.to("" + listafiltradaCliente[index]).emit("estado-pedido-actualizado", infoPedido);
    }

    let listaAdmin = adminsConectados.getListaAdmin().filter((a)=>a.idregion == payload.IdRegion)
    let listafiltradaAdmin = listaAdmin.map((a)=>a.idws)
    for (let index = 0; index < listafiltradaAdmin.length; index++) {
      io.to("" + listafiltradaAdmin[index]).emit("estado-pedido-actualizado", infoPedido);
    }

    if(payload.IdMotorizado!=null){
      let listaMotorizado = motorizadosConectados.getListaMotorizado().filter((m)=>m.iddb == payload.IdMotorizado);
      let listafiltradaMotorizado = listaMotorizado.map((a) => a.idws);
      for (let index = 0; index < listafiltradaMotorizado.length; index++) {
        io.to("" + listafiltradaMotorizado[index]).emit("estado-pedido-actualizado", infoPedido);
      }
    }

  });
};

export const motorizadosOnlinePlataforma = (cliente: Socket, io: SocketIO.Server) => {
  cliente.on("motorizado-on-consulta", (payload: { facturaurl:string, idalmacen:number} ,callback: Function) => {
    let motorizadosFiltro: Motorizado[]= [];
    motorizadosConectados.getListaMotorizado().map((motorizado)=>{
      motorizado.empresasMotorizado.map((emp:any)=>{
        if(emp.FacturaUrl==payload.facturaurl && emp.IdAlmacen== payload.idalmacen ){
          motorizadosFiltro.push(motorizado)
        }
      })
    })

    let lista = plataformasConectados.getListaPlataforma().filter((p) => p.urlPlat === payload.facturaurl && p.idAlmacen== payload.idalmacen);
    let listafiltrada = lista.map((a) => a.idws);
    for (let index = 0; index < listafiltrada.length; index++) {
      io.to("" + listafiltrada[index]).emit("lista-on-motorizado", motorizadosConectados.getListaMotorizado());
    }
  });
};

export const motoriazadosOnlineAdmin = (cliente: Socket, io: SocketIO.Server) => {
  cliente.on("motorizado-on-consulta-admin", (payload: { idregion:number} ,callback: Function) => {
    let lista = adminsConectados.getListaAdmin().filter((a)=>a.idregion == payload.idregion);
    let listaFiltrada = lista.map((a)=>a.idws);
    for (let index = 0; index < listaFiltrada.length; index++) {
      io.to("" + listaFiltrada).emit("lista-on-motorizado",motorizadosConectados.getListaMotorizado().filter((m)=>m.idregion==payload.idregion));
    }
  });
};


export const ObtenerCoordenadasMotorizado = (cliente: Socket, io: SocketIO.Server) => {
  cliente.on("coordenadas-motorizado", (payload: { IdMotorizado:string, Lat:number, Lon:number, Empresas:any, IdRegion:number },callback: Function) => {
    let motorizado = motorizadosConectados.actualizarCoordMotorizado(payload.IdMotorizado,payload.Lat,payload.Lon,payload.Empresas,payload.IdRegion)
    if(payload.Empresas.length>0 && motorizado !=null){
      for (let index = 0; index < payload.Empresas.length; index++) {
        let plataformas = plataformasConectados.getListaPlataforma().filter((plat)=>plat.urlPlat==payload.Empresas[index].FacturaUrl && plat.idAlmacen==payload.Empresas[index].IdAlmacen)
        if(plataformas.length>0){
          let plataformasFiltrada = plataformas.map((a) => a.idws);  
          for (let index2 = 0; index2 < plataformasFiltrada.length; index2++) {
            io.to("" + plataformasFiltrada[index2]).emit("coordenadas-motorizado-nueva",motorizado);
          }
        }
      }
    }
    if(payload.IdRegion != 0 && motorizado != null){
      let admins =  adminsConectados.getListaAdmin().filter((adm)=>adm.idregion == payload.IdRegion)
      let adminsFiltrado = admins.map((a)=>a.idws)
      for (let index3 = 0; index3 < adminsFiltrado.length; index3++) {
        io.to("" + adminsFiltrado[index3]).emit("coordenadas-motorizado-nueva",motorizado);
      }
    }
  });
};







