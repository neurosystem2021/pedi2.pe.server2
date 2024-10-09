import { Plataforma } from "./plataforma";

export class PlataformasLista {
  private listaPlataforma: Plataforma[] = [];

  constructor() {}

  public addPlataforma (Plataforma:Plataforma){
    this.listaPlataforma.push(Plataforma);
  }  


  public getListaPlataforma() {
    return this.listaPlataforma;
  }

  public getPlataforma(id: string) {
    return this.listaPlataforma.find((plataforma) => plataforma.idws === id);
  }

  public getPlataformaIdWs(idws: string) {
    return this.listaPlataforma.find((plataforma) => plataforma.idws === idws);
  }

  public getPlataformaIdDb(iddb: string) {
    return this.listaPlataforma.find((plataforma) => plataforma.iddb === iddb);
  }

  public existePlataforma(iddb: string) {
    return this.listaPlataforma.some((plataforma) => plataforma.iddb === iddb);
  }

  //Borrar un usuario
  public deletePlataforma(idws: string) {
    let objIndex = this.listaPlataforma.findIndex((plataforma) => plataforma.idws === idws);
    if (objIndex !== -1) {
      this.listaPlataforma.splice(objIndex, 1);
    }
  }
}