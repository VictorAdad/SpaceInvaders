import { _usuarios } from '@services/auth/usuarios';

export class Caso {
    public id       : number;
    public titulo   : string;
    public sintesis : string;
    public delito   : string;
    public nic      : string;
    public nuc      : string;
    public created  : Date;
    public name     : string = `NIC: ${this.nic || ''}  -  NUC: ${this.nuc || ''}`;
    public delitoCaso: DelitoCaso = new DelitoCaso();
    public hasPredenuncia:boolean;
    public hasRelacionVictimaImputado:boolean;
    public hasAcuerdoInicio:boolean;
    public predenuncias: any;
    
    fecha (){
       let meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

       var date = new Date(this.created);
       if(this.created) {
         var dia = date.getDate();
         var mes = date.getMonth();
         var year = date.getFullYear();

         var user = _usuarios['']; //Necesita recibir el usuario 

         var x = 'Creado el '+ dia + ' de ' + meses[mes] + ' de ' + year;
         return x;  
       } else {
         return 'Caso creado offline'
       }
    }

    nombre(){
      return `NIC: ${ this.hasPredenuncia || this.predenuncias != null ? this.nic : ''}  -  NUC: ${this.nuc || ''}`;
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