export class NoEjercicioAccionPenal {
    id:number;
    //Determinación de no ejercicio
    narracionHechos: string;
    datosPrueba: string;
    fechaHechoDelictivo: string;
    articuloCpem: string;
    hipotesisCnpp: string;
    fraccionArticulo: string;
    hipotesisSobreseimiento: string;
    nombreProcurador: string;

    //Determinación incompetencia
    ambitoHechos: string;
    autoridadCompetente: string;
    causaIncompetencia: string;
    cargoAutoridadCompetente: string;
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