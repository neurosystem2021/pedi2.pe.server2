export class Usuario {
  public idws: string;
  public iddb: string;
  public tipo: string;
  public urlPlat:string;
  public lat:number;
  public lon:number;
  public empresasMotorizado:[];
  constructor(idws: string, iddb: string, tipo: string, urlPlat:string, lat:number = 0, lon:number = 0, empresasMotorizado:[]=[]) {
    this.idws = idws;
    this.iddb = iddb;
    this.tipo = tipo;
    this.urlPlat = urlPlat;
    this.lat = lat;
    this.lon = lon;
    this.empresasMotorizado = empresasMotorizado;
  }
}
