export class Inspeccion {
    id: number;
    fechaHoraInspeccion: string;
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