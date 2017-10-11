export class RequerimientoInformacion {
    id: number;
    noOficio: string;
    fechaReq: string;
    autoridadReq: string;
    cargoTurnoAdscripcion: string;
    domicilioAutoridad: string;
    infoRequerida: string;
    plazoDias: string;
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