import { Caso } from '@models/caso';

export class Predenuncia{
	id:number;

	calidadUsuario:string;
	numeroTelefono:string;
	tipoLineaTelefonica:string;
	lugarLlamada:string;
	hechosNarrados:string;
	usuario:string;
	horaConlcusionLlamada:string;
	duracionLlamada: number;
    nombreServidorPublico: string;
	observaciones:string;
    //Constancia de lectura de Derechos
	numeroFolio:number;
	hablaEspanol:string;
	idioma:string;
	nombreInterprete:string;
	comprendioDerechos:string;
	copiaDerechos:string;
	//Oficio de asignación de asesor jurídico
	autoridadOficioAsignacion:string;
	denunciaQuerella:string;
	ubicacionUnidadInmediata:string;
	victimaOfendidoQuerellante: string;
	cargoAutoridadOficioAsignacion:string;
    // Registro presenial
    calidadPersona:string;
	tipoPersona:string;
	lugarHechos:string;
	conclusionHechos: string;
	canalizaOtraArea:string;
	institucionCanalizacion:string;
	motivocanalizacion:string;
    fechaCanalizacion:string;
    nombrePersonaRegistro:string;
    horaCanalizacion:string;
    personaCausohecho:string;
    domicilioQuienCauso:string;
    personaRegistro:string;


    // Oficio Ayuda atencion victima
    oficio:string;
    nombreAutoridadDirigeOficio:string;
    necesidadesCubrir:string;
    ubicacionUnidadInmediataVictima:string;
	cargoAutoridadVictima:string;

	caso: Caso = new Caso();
	
}