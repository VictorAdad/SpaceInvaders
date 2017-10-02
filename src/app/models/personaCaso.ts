import { Caso } from '@models/caso';
import { Persona } from '@models/persona';
import { TipoInterviniente } from '@models/tipoInterviniente';

export class PersonaCaso {
	id: number;

	caso: Caso = new Caso();
	personaId: Persona = new Persona();
	tipoIntervinienteId: TipoInterviniente = new TipoInterviniente();
}