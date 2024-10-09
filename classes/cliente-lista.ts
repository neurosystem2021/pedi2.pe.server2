import { Cliente } from "./cliente";
import Database from "../classes/database";
const database = Database.instance;

export class ClientesLista {
  private listaCliente: Cliente[] = [];

  constructor() {}

  public async addCliente (Cliente:Cliente){
    this.listaCliente.push(Cliente);
    if(Cliente.tokenFcm!=''){
      try {
        let conn = await database.conexionObtener();
        await conn.query("UPDATE Gen_Cliente SET TokenFcm ='"+Cliente.tokenFcm+"' WHERE IdCliente = "+Cliente.iddb);
      } catch (error) {
        
      }
    }

  }  


  public getListaCliente() {
    return this.listaCliente;
  }

  public getCliente(id: string) {
    return this.listaCliente.find((cliente) => cliente.idws === id);
  }

  public getClienteIdWs(idws: string) {
    return this.listaCliente.find((cliente) => cliente.idws === idws);
  }

  public getClienteIdDb(iddb: string) {
    return this.listaCliente.find((cliente) => cliente.iddb === iddb);
  }

  public existeCliente(iddb: string) {
    return this.listaCliente.some((cliente) => cliente.iddb === iddb);
  }

  //Borrar un usuario
  public deleteCliente(idws: string) {
    let objIndex = this.listaCliente.findIndex((cliente) => cliente.idws === idws);
    if (objIndex !== -1) {
      this.listaCliente.splice(objIndex, 1);
    }
  }
}
