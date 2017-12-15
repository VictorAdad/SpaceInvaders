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