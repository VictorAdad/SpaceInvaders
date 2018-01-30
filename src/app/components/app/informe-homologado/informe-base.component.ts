import { EventEmitter, Input, Output  } from '@angular/core';
import { FormGroup  } from '@angular/forms';


export class InformeBaseComponent {

    @Input()
    public form: FormGroup;   

    public static userOption: boolean = false;

    public static idInforme = "";

    constructor(){
    }

    public save(form) {

        console.log("-->>>>>>>>> " + InformeBaseComponent.idInforme);

        var idInfo = InformeBaseComponent.idInforme;

        if (typeof idInfo != 'undefined') {
    	    localStorage.removeItem('Principal_'+idInfo);
        }
    	return new Promise( (resolve,reject) => {
			resolve("Form valido");
			let fecha = new Date();
    		form.fechaCreacion= fecha;
			localStorage.setItem('Principal_'+form.numeroReferencia, JSON.stringify(form));
    	});

        
    }

}