import { Estado } from '@models/caso/estado';

export class Municipio {
	id: number;
	nombre: string;
	activo: boolean;
	created: Date;
	updated: Date;

	estado: Estado = new Estado();
	createdBy: number;
	updatedBy: number;

}