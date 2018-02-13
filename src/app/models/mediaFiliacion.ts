import { Persona } from '@models/persona';

export class MediaFiliacion {
	id: number;

	personaId: Persona = new Persona();
	orejaDerecha: Oreja = new Oreja(); 
	orejaIzquiera:Oreja = new Oreja(); 
}

export class Oreja {
	id: number;
	forma: string;
	helixOriginal: string;
	helixSuperior: string; 
	helixPosterior: string;
	helixAdherencia: string;
	lobuloContorno: string;
	lobuloAdherencia: string;
	lobuloParticularidad: string;
	lobuloDimension: string;
}