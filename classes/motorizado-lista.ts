import { Motorizado } from "./motorizado";
import Database from "../classes/database";
const database = Database.instance;

export class MotorizadosLista {
  private listaMotorizado: Motorizado[] = [];

  constructor() {}

  public async addMotorizado (motorizado:Motorizado){
    this.listaMotorizado.push(motorizado);
    if(motorizado.tokenFcm!=''){
      try {
        let conn = await database.conexionObtener();
        await conn.query("UPDATE Gen_Motorizado SET TokenFcm ='"+motorizado.tokenFcm+"' WHERE IdMotorizado = "+motorizado.iddb);
      } catch (error) {
        
      }
    }
  }  


  public getListaMotorizado() {
    return this.listaMotorizado;
  }

  public getMotorizado(id: string) {
    return this.listaMotorizado.find((motorizado) => motorizado.idws === id);
  }

  public getMotorizadoIdWs(idws: string) {
    return this.listaMotorizado.find((motorizado) => motorizado.idws === idws);
  }

  public getMotorizadoIdDb(iddb: string) {
    return this.listaMotorizado.find((motorizado) => motorizado.iddb === iddb);
  }

  public existeMotorizado(iddb: string) {
    return this.listaMotorizado.some((motorizado) => motorizado.iddb === iddb);
  }

  //Borrar un usuario
  public deleteMotorizado(idws: string) {
    let objIndex = this.listaMotorizado.findIndex((motorizado) => motorizado.idws === idws);
    if (objIndex !== -1) {
      this.listaMotorizado.splice(objIndex, 1);
    }
  }

  public actualizarCoordMotorizado(iddb: string,lat:number, lon:number, empresas:[],idregion:number){
    let objIndex = this.listaMotorizado.findIndex((m) => m.iddb === iddb);
    if(objIndex !== -1){
      this.listaMotorizado[objIndex].lat=lat;
      this.listaMotorizado[objIndex].lon=lon;
      this.listaMotorizado[objIndex].empresasMotorizado = empresas;
      this.listaMotorizado[objIndex].idregion = idregion;
      return this.listaMotorizado[objIndex];
    }else{
      return null;
    }
  }
}
