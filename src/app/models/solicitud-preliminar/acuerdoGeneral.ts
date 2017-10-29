import { Caso } from '@models/caso';

export class AcuerdoGeneral {
    id: number;
    tipo: string;
    fundamentoLegal: string;
    contenidoAcuerdo: string;
    finalidad: string;
    plazo: string;
    apercibimiento: string;
    senialar: string;
    observaciones: string;
    noOficioAtencion: string;
    autoridadAtencion: string;
    cargoAdscripcionAtencion: string;
    necesidades: string;
    ubicacionAtencion: string;
    autoridadJuridico: string;
    cargoAdscripcionJuridico: string;
    ubicacionJuridico: string;
    denunciaQuerella: DenunciaQuerella = new DenunciaQuerella();
    victimaQuerellante: VictimaQuerellante = new VictimaQuerellante();
    caso: Caso = new Caso();
}

export class DenunciaQuerella{
    id      :   number;
    nombre  :   string;
}

export class VictimaQuerellante{
    id      :   number;
    nombre  :   string;
}