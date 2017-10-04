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