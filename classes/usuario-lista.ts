import { Usuario } from "./usuario";

export class UsuariosLista {
  private lista: Usuario[] = [];

  constructor() {}

  //Agregar un usuario
  public agregar(usuario: Usuario) {
    this.lista.push(usuario);
    return usuario;
  }

  public addUsuario(usuario: Usuario) {
    this.lista.push(usuario);
  }

  //obtener lista de usuarios
  public getLista() {
    return this.lista;
  }

  public getUsuario(id: string) {
    return this.lista.find((usuario) => usuario.idws === id);
  }

  public getUsuarioCelular(celular: any) {
    return this.lista.find((usuario) => usuario.iddb === celular);
  }

  public getUsuarioIdWs(idws: string) {
    return this.lista.find((usuario) => usuario.idws === idws);
  }

  public getUsuarioIdDb(iddb: string) {
    return this.lista.find((usuario) => usuario.iddb === iddb);
  }

  public existeUsuario(iddb: string,tipo:string) {
    return this.lista.some((usuario) => usuario.iddb === iddb && usuario.tipo===tipo);
  }

  //Borrar un usuario
  public borrarUsuario(idws: string) {
    let objIndex = this.lista.findIndex((usuario) => usuario.idws === idws);
    if (objIndex !== -1) {
      this.lista.splice(objIndex, 1);
    }
  }

  public actualizarCoordMotorizado(iddb: string,lat:number, lon:number, empresas:[]){
    let objIndex = this.lista.findIndex((usuario) => usuario.iddb === iddb && usuario.tipo=='MOTORIZADO');
    if(objIndex !== -1){
      this.lista[objIndex].lat=lat;
      this.lista[objIndex].lon=lon;
      this.lista[objIndex].empresasMotorizado = empresas;
      return this.lista[objIndex];
    }else{
      return null;
    }
  }
}
