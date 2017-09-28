import { Caso } from '@models/caso';

export class Vehiculo {
    motivoRegistro: string;
    vehiculo: string;
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