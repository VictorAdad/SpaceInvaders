export class Caso {
    public id       : number;
    public titulo   : string;
    public sintesis : string;
    public delito   : string;
    public nic      : string;
    public nuc      : string;
    public created  : Date = new Date();
    public name     : string = `NIC: ${this.nic || ''}  -  NUC: ${this.nuc || ''}`;
    public formatFecha : string = this.fecha(this.created);
    public delitoCaso: DelitoCaso = new DelitoCaso();

    fecha (_date: Date){
       let meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

       var date = _date;

       var dia = date.getDay();
       var mes = date.getMonth();
       var year = date.getFullYear();

       var user = 'Administrador del sistema'; //Necesita recibir el usuario 

       var x = 'Creado el '+ dia + ' de ' + meses[mes] + ' de ' + year + ' por el ' + user;
       return x;  
    }


    public personas:any[];
    public delitos:any[];
    public lugares:any[];
    public armas:any[];
    public vehiculos:any[];
    public relaciones:any[];
    public titulares:any[];
    public documentos:any[];
    

}

export class DelitoCaso {
    id: number;
    principal : boolean;
    createdBy: Date;
    updatedBy: Date;

    delito: Delito = new Delito();

    //caso: Caso = new Caso();
 }

export class Delito {
    id: number;
}