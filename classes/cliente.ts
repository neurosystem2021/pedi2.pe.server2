export class Cliente {
    public idws: string;
    public iddb: string;
    public nombres: string;
    public apellidos: string;
    public tokenFcm:string;
    constructor(idws: string, iddb: string, nombres: string, apellidos:string,tokenFcm:string) {
      this.idws = idws;
      this.iddb = iddb;
      this.nombres = nombres;
      this.apellidos = apellidos;
      this.tokenFcm = tokenFcm
    }
  }