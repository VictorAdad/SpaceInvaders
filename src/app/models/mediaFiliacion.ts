import { Persona } from '@models/persona';
import { Oreja } from '@models/catalogo/oreja'

export class MediaFiliacion {
	id: number;

	personaId: Persona = new Persona();
	orejaDerecha: Oreja = new Oreja(); 
	orejaIzquiera:Oreja = new Oreja(); 
}