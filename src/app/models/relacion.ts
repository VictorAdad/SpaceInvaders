import {ViolenciaGenero} from './violenciaGenero';
import {TrataPersonas} from './trataPersonas';
import {HostigamientoAcoso} from './hostigamientoAcoso';

export class Relacion {
    id:number
    tipo: string;
    modalidad: string;
    delito: string;
    concursoDelito: string;
    formaComision: string;
    imputado:string;
    victimaUOfendido:string
    lugar:string;
    consultorDelito:string;
    clasificacionDelito:string;
    elementoComision:string;
    clasificacion:string;
    formaAccion:string;
    consumacion:string;
    gradoParticipacion:string;
    relacionAcusadoOfendido:string;
    formaConducta:string;
    tipoDesaparicion:string;
    flagrancia:boolean;
    violenciaGenero:ViolenciaGenero;
    trataPersonas:TrataPersonas;
    hostigamietoAcoso:HostigamientoAcoso;
  }