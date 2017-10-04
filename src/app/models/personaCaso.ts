import { Persona } from '@models/persona';

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

export class TipoInterviniente {
    id: number;
    tipo: string;
    created: Date;
    updated: Date;

    createdBy: number;
    updatedBy: number;


}