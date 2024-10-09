export class Plataforma {
    public idws: string;
    public iddb: string;
    public urlPlat:string;
    public idAlmacen:number;
    constructor(idws: string, iddb: string, urlPlat:string, idAlmacen:number) {
      this.idws = idws;
      this.iddb = iddb;
      this.urlPlat = urlPlat;
      this.idAlmacen = idAlmacen;
    }
  }
  