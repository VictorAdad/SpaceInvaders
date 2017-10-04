export class RequerimientoInformacion {
    id: number;
    numeroOficio: string;
    fechaRequerimiento: string;
    nombreAutoridad: string;
    cargoTurnoAutoridad: string;
    domicilioAutoridad: string;
    informacion: string;
    plazoMaxino: string;
    apercibimiento: string;
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