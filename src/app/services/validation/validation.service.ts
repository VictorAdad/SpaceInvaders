import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

export class Validation{
	
	constructor() {
	}

	static validationMax(maxValue) {
	  return (c: FormControl) => {
	    let err = {
	      rangeError: {
	        given: c.value,
	        max: maxValue || 10,
	        
	      }
	    };

	  return (c.value > +maxValue) ? err: null;
	  }
	}

}





