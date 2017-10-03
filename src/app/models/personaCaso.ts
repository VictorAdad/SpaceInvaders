import { Persona } from '@models/persona';
import { TipoInterviniente } from '@models/catalogo/tipoInterviniente';

export class PersonaCaso {
	id: number;

	caso: Caso = new Caso();
	// personaId: Persona = new Persona();
	tipoIntervinienteId: TipoInterviniente = new TipoInterviniente();
}

export class Caso {
    public id       : number;
    public titulo   : string;
    public sintesis : string;
    public delito   : string;
    public nic      : string;
    public nuc      : string;
}