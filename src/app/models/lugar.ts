export class Lugar{
    tipo: string;
    tipo_zona: string;
    calle: string;
    noExterior: string;
    noInterior: string;
    referencias: string;
    pais: string;
    estado: string;
    municipio_delegacion: string;
    colonia_asentamiento: string;
    cp: string;
    fecha: any;
    hora: Date;
    dia: string;
    descripcion_lugar: string;
    referencias_geograficas: string;
    notas: string;
    latitud: number;
    longitud: number;
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
