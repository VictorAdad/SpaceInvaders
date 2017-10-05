export class NoEjercicioAccionPenal {
    id:number;
    //Determinación de no ejercicio
    narracionHechos: string;
    datosPrueba: string;
    fechaHecho: string;
    articuloCPEM: string;
    referirHipotesis: string;
    fraccionArticulo: string;
    hipotesis: string;
    nombreProcurador: string;

    //Determinación incompetencia
    hechosAmbito: string;
    nombreAutoridad: string;
    causa: string;
    cargoAutoridad: string;
    observaciones: string;
    caso: Caso = new Caso();
}
export class Caso {
    public id       : number;
    public titulo   : string;
    public sintesis : string;
    public delito   : string;
    public nic      : string;
    public nuc      : string;
}