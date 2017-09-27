import { Caso } from '@models/caso';

export class Arma {
    id:number
    clase: string;
    tipo: string;
    subtipo: string;
    calibre: string;
    mecanismoAccion:string;
    serie:string;
    notas:string;
    matricula:string;
    caso: Caso = new Caso();
}