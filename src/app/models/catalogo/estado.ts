import { Pais } from '@models/catalogo/pais';

export class Estado {
	id: number;
	nombre: string;
	activo: boolean;
	created: Date;
	updated: Date;

	pais: Pais = new Pais();
	createdBy: number;
	updatedBy: number;
}