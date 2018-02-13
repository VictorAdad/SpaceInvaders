export class AcuerdoRadicacion {
    id:number;
    titulo:string;
    creadoPor: string;
    created: string;
    observaciones: string;
    caso: Caso = new Caso();
    tipo:string="Radicación"
}
export class Caso {
    public id       : number;
    public titulo   : string;
    public sintesis : string;
    public delito   : string;
    public nic      : string;
    public nuc      : string;
}