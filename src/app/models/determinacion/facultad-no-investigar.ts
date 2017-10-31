export class FacultadNoInvestigar {
    id:number;
    sintesisHechos: string;
    datosPrueba: string;
    motivosAbstuvoInvestigar: string;
    medioAlternativoSolucion: string;
    destinatarioDeterminacion: string;
    superiorJerarquico: string;
    createdBy: string;
    nombreDenunciante
    domicilioDenunciante: string;
    edadDenunciante: string;
    originarioDenunciante: string;
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
