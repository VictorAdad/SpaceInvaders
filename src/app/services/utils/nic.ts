
export class Nic {
    constructor() {
        
    }
    generate(claveFiscalia:string,claveAgencia:string,claveTurno:string,claveAutoridad:string,idIdentificador:number,idDelito:number){
        let fiscalia =claveFiscalia.slice(-3);
        let agencia  =claveAgencia.slice(-3);
        let turno    =claveTurno.slice(-2);
        let autoridad=claveAutoridad.slice(-3);
        let identificador=("0000"+idIdentificador).slice(-5);
        let date=new Date();
        let mes=("0"+date.getMonth()).slice(-2);
        let anio=("0"+date.getFullYear()).slice(-2);
        //let idDelito = 11;
        let delito = ("000"+idDelito).slice(-3);
        return fiscalia+'/'+agencia+'/'+turno+'/'+autoridad+'/'+identificador+'/'+mes+'/'+anio+'/'+delito;
    }
}