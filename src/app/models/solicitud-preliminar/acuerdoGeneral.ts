export class AcuerdoGeneral {
    id: number;
    tipo: string;
    fudamentoLegal: string;
    contenidoAcuerdo: string;
    finalidad: string;
    plazo: string;
    apercibimiento: string;
    senialar: string;
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