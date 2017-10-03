export class DelitoCaso {
    id: number;
    principal : boolean;
    createdBy: Date;
    updatedBy: Date;

    caso: Caso = new Caso();
    delito: Delito = new Delito();
 }


export class Caso {
    public id       : number;
    public titulo   : string;
    public sintesis : string;
    public delito   : string;
    public nic      : string;
    public nuc      : string;
}

export class Delito {
	id: number;
	nombre: string;
}