import { FormGroup, FormControl } from '@angular/forms';

export class EntrevistaGlobal{
	
    public validateMsg(form: FormGroup){
        return !form.valid ? 'No se han llenado los campos requeridos' : '';
    }

	public validateForm(form: FormGroup) {
        Object.keys(form.controls).forEach(field => {
            const control = form.get(field);         
            if (control instanceof FormControl) {         
                control.markAsTouched({ onlySelf: true });
            } else if (control instanceof FormGroup) {
                this.validateForm(control);           
            }
        });
    } 
}