export class Motorizado {
    public idws: string;
    public iddb: string;
    public nombres: string;
    public apellidos: string;
    public lat:number;
    public lon:number;
    public empresasMotorizado:[];
    public tokenFcm:string;
    public idregion:number = 0;
    constructor(idws: string, iddb: string, nombres: string, apellidos:string,tokenFcm:string, lat:number = 0, lon:number = 0, empresasMotorizado:[]=[],idRegion:number=0) {
      this.idws = idws;
      this.iddb = iddb;
      this.nombres = nombres;
      this.apellidos = apellidos;
      this.tokenFcm = tokenFcm
      this.lat = lat;
      this.lon = lon;
      this.empresasMotorizado = empresasMotorizado;
      this.idregion = idRegion
    }
  }
  