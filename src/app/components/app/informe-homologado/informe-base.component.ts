import { EventEmitter, Input, Output  } from '@angular/core';
import { FormGroup  } from '@angular/forms';


export class InformeBaseComponent {

    @Input()
    public form: FormGroup;   

    public static userOption: boolean = false;

    constructor(){
    }

    public save(form) {
    	localStorage.removeItem('Principal');    	
    	return new Promise( (resolve,reject) => {
			resolve("Form valido");
			let fecha = new Date();
    		form.fechaCreacion= fecha;
			localStorage.setItem('Principal', JSON.stringify(form));

   			//json = {x:1, nombre:"cosoaoosao sa s a sa"};
			// localStorage.setItem('YASON', JSON.stringify(json));
			// xxxx= localStorage.getItem('YASON');
			// xxxx = JSON.parse(xxxx);
				
    	});
        
    }

}