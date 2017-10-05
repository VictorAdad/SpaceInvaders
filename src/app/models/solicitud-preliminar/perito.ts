export class Perito {
    id: number;
    //Comunes
    tipoSolicitud: string;
    numeroOficio: string;
    apercibimiento: string;
    observaciones: string;
    //Periciales
    hechosDenunciados: string;  
    hechosNarrados: string;
    nombreDirector: string;
    solicitaPerito: string;
    finalidadRequermiento: string;
    plazoDias: string;
    //Psicofísico
    nombreMedico: string;
    nombreRealizaExamen: string;
    examen: string;

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