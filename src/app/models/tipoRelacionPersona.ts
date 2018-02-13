import { Persona } from '@models/persona';

export class TipoRelacionPersona {
	
	caso: Caso = new Caso();
	persona: Persona = new Persona();
	personaCaso: PersonaCaso = new PersonaCaso();

}

export class Caso {
    public id       : number;
    public titulo   : string;
    public sintesis : string;
    public delito   : string;
    public nic      : string;
    public nuc      : string;
}

export class PersonaCaso {
	id: number;

	caso: Caso = new Caso();
	// personaId: Persona = new Persona();
}