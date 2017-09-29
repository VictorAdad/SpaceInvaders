import { Caso } from '@models/caso';


export class Relacion {
    id:number
    tipo: string;
    modalidad: string;
    delito: string;
    concursoDelito: string;
    formaComision: string;
    imputado:string;
    victima:string
    lugar:string;
    consultorDelito:string;
    clasificacionDelitoOrden:string;
    elementosComision:string;
    clasificacion:string;
    formaAccion:string;
    consumacion:string;
    gradoParticipacion:string;
    relacionAcusadoOfendido:string;
    formaConducta:string;
    tipoDesaparicion:string;
    flagrancia:boolean;
    violenciaGenero:boolean;
    tipoViolenciaGenero: string;
    victimaDelincuenciaOrganizada: string;
    victimaViolenciaGenero: string;
    victimaTrata:string;
    victimaAcoso:string;
    ordenProteccion:string;
    //efecto:EfectoViolenciaGenero;
  //  trataPersonas:TrataPersonas;
  //  hostigamietoAcoso:HostigamientoAcoso;
    caso: Caso = new Caso();
}