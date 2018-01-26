import { EventEmitter, Input, Output  } from '@angular/core';
import { FormGroup  } from '@angular/forms';


export class InformeBaseComponent {

    @Input()
    public form: FormGroup;   

    constructor(){
    }

    public save(form) {
    	return new Promise( (resolve,reject) => {
			console.log('<<< Ya me guardaron :3 >>>', form);
			resolve("Form valido");
			let result

			localStorage.setItem('Principal', JSON.stringify(form));


			result = JSON.parse(localStorage.getItem('Principal'));
			console.log('<<< Ya regrese :3 >>>', result);

   			//json = {x:1, nombre:"cosoaoosao sa s a sa"};
			// localStorage.setItem('YASON', JSON.stringify(json));
			// xxxx= localStorage.getItem('YASON');
			// xxxx = JSON.parse(xxxx);
			// localStorage.removeItem('YASON');	
    	});
        
    }

}