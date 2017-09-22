export class Caso {
	id       : number;
    titulo   : string;
    sintesis : string;
    delito   : string;
    nic      : string;
    nuc      : string;
    created  : Date = new Date();
    name     : string = `NIC: ${this.nic || ''}  -  NUC: ${this.nuc || ''}`;
    formatFecha : string = this.fecha(this.created);

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
}