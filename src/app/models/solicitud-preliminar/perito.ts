export class Perito {
    id: number;
    //Comunes
    tipo: string;
    noOficio: string;
    apercibimiento: string;
    observaciones: string;
    //Periciales
    hechosDenunciados: string;  
    hechosNarrados: string;
    directorInstituto: string;
    peritoMateria: string;
    finalidad: string;
    plazoDias: string;
    //Psicofísico
    medicoLegista: string;
    realizadoA: string;
    tipoExamen: string;

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