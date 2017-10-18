export class Arma {
    id:number
    serie:string;
    notas:string;
    matricula:string;

    caso: Caso = new Caso();
    claseArma: ClaseArma = new ClaseArma();
    calibreMecanismo: CalibreMecanismo = new CalibreMecanismo();
    public created   : Date;
    public updated   : Date;
}

export class Caso {
    public id       : number;
    public titulo   : string;
    public sintesis : string;
    public delito   : string;
    public nic      : string;
    public nuc      : string;
}

export class ClaseArma {
    public id        : number
    public claseArma: string;
    public tipo      : string;
    public subtipo   : string;
}

export class CalibreMecanismo {
    public id        : number
    public mecanismo : string;
    public calibre   : string;
    public created   : Date;
    public createdBy : number;
    public updated   : Date;
    public updatedBy : number;
}