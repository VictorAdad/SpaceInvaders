export class Perito {
    id: number;
    tipoSolicitud: string;
    hechosNarrados: string;
    numeroOficio: string;
    nombreDirector: string;
    solicitaPerito: string;
    finalidadRequerimiento: string;
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