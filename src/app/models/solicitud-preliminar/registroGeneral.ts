export class RegistroGeneral {
    id: number;
    //Constancia general
    constancia: string;
    //Constancia de llamada
    numero: string;
    nombre: string;
    observaciones: string;
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