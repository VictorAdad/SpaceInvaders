import { Caso } from '@models/caso';

export class Lugar{
    tipo: string;
    tipo_zona: string;
    calle: string;
    n_exterior: string;
    n_interior: string;
    referencias: string;
    pais: string;
    estado: string;
    municipio_delegacion: string;
    colonia_asentamiento: string;
    cp: string;
    fecha: string;
    hora: Date;
    dia: string;
    descripcion_lugar: string;
    referencias_geograficas: string;
    notas: string;
    latitud: string;
    longitud: string;
    caso: Caso = new Caso();
}