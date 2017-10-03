export class Arma {
    id:number
    clase: string;
    tipo: string;
    subtipo: string;
    calibre: string;
    mecanismoAccion:string;
    serie:string;
    notas:string;
    matricula:string;

    caso: Caso = new Caso();
}

export class Caso {
    public id       : number;
    public titulo   : string;
    public sintesis : string;
    public delito   : string;
    public nic      : string;
    public nuc      : string;
}