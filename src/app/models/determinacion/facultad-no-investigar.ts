export class FacultadNoInvestigar {
    id:number;
    sintesisHechos: string;
    datosPrueba: string;
    motivos: string;
    medioAlternativo: string;
    remitente: string;
    superiorJerarquico: string;
    creadoPor: string;
    fechaCreacion: string;
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