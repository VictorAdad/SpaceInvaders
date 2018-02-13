import { Caso } from '@models/caso';

export class AcuerdoGeneral {
    id:number
    fundamentoLegal: string;
    contenidoAcuerdo: string;
    finalidad: string;
    plazo: string;
    apercibimientos:string;
    solicita:string;
    observaciones:string;
    caso: Caso = new Caso();
}
