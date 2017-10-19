import { Caso } from '@models/caso';

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
    peritoMateria: PeritoMateria = new PeritoMateria();
    finalidad: string;
    plazoDias: string;
    //Psicofísico
    medicoLegista: string;
    realizadoA: string;
    tipoExamen: TipoExamen = new TipoExamen();

    caso: Caso = new Caso();
}

export class PeritoMateria{
    id          :   number;
    nombre      :   string;
}

export class TipoExamen{
    id          :   number;
    nombre      :   string;
}