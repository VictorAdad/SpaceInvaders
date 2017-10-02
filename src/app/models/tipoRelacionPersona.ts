import { Caso } from '@models/caso';
import { Persona } from '@models/persona';
import { PersonaCaso } from '@models/personaCaso';

export class TipoRelacionPersona {
	
	caso: Caso = new Caso();
	persona: Persona = new Persona();
	personaCaso: PersonaCaso = new PersonaCaso();

}