import { Admin } from "./admin";

export class AdminLista {
  private listaAdmin: Admin[] = [];

  constructor() {}

  public addAdmin(Admin:Admin){
    this.listaAdmin.push(Admin);
  }  


  public getListaAdmin() {
    return this.listaAdmin;
  }

  public getAdmin(id: string) {
    return this.listaAdmin.find((admin) => admin.idws === id);
  }

  public getAdminIdWs(idws: string) {
    return this.listaAdmin.find((admin) => admin.idws === idws);
  }

  public getAdminIdDb(iddb: string) {
    return this.listaAdmin.find((admin) => admin.iddb === iddb);
  }

  public existeAdmin(iddb: string) {
    return this.listaAdmin.some((admin) => admin.iddb === iddb);
  }

  //Borrar un usuario
  public deleteAdmin(idws: string) {
    let objIndex = this.listaAdmin.findIndex((admin) => admin.idws === idws);
    if (objIndex !== -1) {
      this.listaAdmin.splice(objIndex, 1);
    }
  }
}