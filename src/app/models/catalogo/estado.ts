
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

export class Pais {
	id: number;
	nombre: string;
}