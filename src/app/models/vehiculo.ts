export class Vehiculo {
    motivoRegistro: string;
    campoVehiculo: string;
    tarjetaCirculacion: string;
    economico: string;
    clase: string;
    marca: string;
    submarca: string;
    color: string;
    modelo: string;
    estado_origen_placas: string;
    placas: string;
    placas_adicionales: string;
    rfv: string;
    serie: string;
    motor: string;
    aseguradora: string;
    factura: string;
    datos_tomados_de: string;
    n_poliza: string;
    valor_estimado: string;
    tipoUso: string;
    procedencia: string;
    pedimento_de_importacion: string;
    lleva_carga: boolean;
    alterado: boolean;
    señas_particulares: string;

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