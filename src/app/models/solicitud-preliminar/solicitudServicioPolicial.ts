export class SolicitudServicioPolicial {
    id: number;
    noOficio: string;
    nombreComisario: string;
    actuacionesSolicitadas: string;
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