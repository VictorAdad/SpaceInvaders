export class Perito {
    id: number;
    hechosNarrados: string;
    numeroOficio: string;
    nombreDirector: string;
    solicitaPerito: string;
    finalidadRequermiento: string;
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