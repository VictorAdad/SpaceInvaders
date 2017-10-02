import { Caso } from '@models/caso'
import { Delito } from '@models/catalogo/delito'

export class DelitoCaso {
    id: number;
    principal : boolean;
    createdBy: Date;
    updatedBy: Date;

    caso: Caso = new Caso();
    delito: Delito = new Delito();
 }