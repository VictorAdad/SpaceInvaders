import { EventEmitter, Input, Output  } from '@angular/core';
import { FormGroup  } from '@angular/forms';


export class InformeBaseComponent {

    @Input()
    public form: FormGroup;   

    constructor(){
    }

    public save(valid, form) {
    	if (valid) {
    		console.log('<<< form >>>',form);	
    	} else {
    		console.log('<<< form >>>',form);
    	}
        
    }

}