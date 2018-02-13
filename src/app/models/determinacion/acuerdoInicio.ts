export class AcuerdoInicio {
    id:number;
    nombrePersonaAcepta:string;
    presentoLlamada: string;
    manifesto: string;
    sintesisHechos: string;
    observaciones: string;
    caso: Caso= new Caso();
    tipo:string="Inicio";
  }
  export class Caso {
    public id       : number;
    public titulo   : string;
    public sintesis : string;
    public delito   : string;
    public nic      : string;
    public nuc      : string;
}