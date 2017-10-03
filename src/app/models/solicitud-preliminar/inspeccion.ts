export class Inspeccion {
    id: number;
    fecha: string;
    hora: string;
    adscripcion: string;
    descripcion: string;
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