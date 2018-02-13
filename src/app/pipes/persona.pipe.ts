import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name : 'personaNombre'})
export class PersonaNombre implements PipeTransform {
	transform(element:any){
		var nombre

		if (element.tipoInterviniente.tipo == "Víctima desconocida" || element.tipoInterviniente.tipo == "Imputado desconocido"){
			if (element.tipoInterviniente.tipo == "Imputado desconocido") {
				if (element.persona.nombre == null && element.persona.paterno == null && element.persona.materno == null) {
					nombre = "Quién Resulte Responsable";
				}else{
					if (element.persona.nombre == null) {
						element.persona.nombre = ""
					}
					if (element.persona.paterno == null) {
						element.persona.paterno = ""
					}
					if (element.persona.materno == null) {
						element.persona.materno = ""
					}
					nombre = element.persona.nombre+" "+element.persona.paterno+" "+element.persona.materno;
				}
			}else{
				if (element.persona.nombre == null && element.persona.paterno == null && element.persona.materno == null) {
					nombre = "Identidad desconocida";
				}else{
					if (element.persona.nombre == null) {
						element.persona.nombre = ""
					}
					if (element.persona.paterno == null) {
						element.persona.paterno = ""
					}
					if (element.persona.materno == null) {
						element.persona.materno = ""
					}
					nombre = element.persona.nombre+" "+element.persona.paterno+" "+element.persona.materno;
				}
			}
		}else{
			if (element.persona.materno == null) {
				element.persona.materno = ""
			}
			nombre = element.persona.nombre+" "+element.persona.paterno+" "+element.persona.materno;
		}

		return nombre;
	}
}


@Pipe({name : 'personaDomicilio'})
export class PersonaDomicilio implements PipeTransform {
	transform(personaCaso:any,idLocalizacion){
    let localizacion = personaCaso.persona.localizacionPersona[idLocalizacion];
		var domicilio="";
    if(localizacion){
    let calle=localizacion.calle?localizacion.calle:null;
    let noExterior=localizacion.noExterior?localizacion.noExterior:null;
    let municipio=(localizacion.municipio?localizacion.municipio.nombre:(localizacion.municipioOtro?localizacion.municipioOtro:null))
    let colonia=(localizacion.colonia?localizacion.colonia.nombre:(localizacion.coloniaOtro?localizacion.coloniaOtro:null))
    let estado=(localizacion.estado?localizacion.estado.nombre:(localizacion.estadoOtro?localizacion.estadoOtro:null))
    domicilio=(calle?calle+" ":"")+ (noExterior?noExterior+" ":"")+(colonia?colonia+" ":"")+(municipio?municipio+" ":"")+(estado?estado+" ":"")
    }
		return domicilio;
	}
}
@Pipe({name : 'personaOriginario'})
export class PersonaOriginario implements PipeTransform {
	transform(personaCaso:any){
		var originario="";
    let municipio=(personaCaso.persona.municipio?personaCaso.persona.municipio.nombre:(personaCaso.persona.municipioNacimientoOtro?personaCaso.persona.municipioNacimientoOtro:null))
    let estado=(personaCaso.persona.estado?personaCaso.persona.estado.nombre:(personaCaso.persona.estadoNacimientoOtro?personaCaso.persona.estadoNacimientoOtro:null))
    let pais=personaCaso.persona.pais?personaCaso.persona.pais.nombre:"";
    originario=(municipio?municipio+" ":"")+ (estado?estado+" ":"")+(pais?pais+" ":"");
		return originario;
	}
}
