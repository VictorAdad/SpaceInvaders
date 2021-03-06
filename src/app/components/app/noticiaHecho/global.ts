import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { Logger } from "@services/logger.service";

export class NoticiaHechoGlobal{

    public validateMsg(form: FormGroup){
        return !form.valid ? 'No se han llenado los campos requeridos' : '';
    }

    public validateForm(form: FormGroup) {

        Object.keys(form.controls).forEach(field => {
            const control = form.get(field);
            if (control instanceof FormControl) {
                if (control.status === 'INVALID') {
                    // Logger.log('Validate Control', control);
                    control.markAsTouched({ onlySelf: true });
                }
            } else if (control instanceof FormGroup) {
                this.validateForm(control);
            } else if (control instanceof FormArray){
                Object.keys(control.controls).forEach(fieldArray => {
                    const controlArray = control.controls[fieldArray];
                    if (controlArray instanceof FormControl) {
                        controlArray.markAsTouched({ onlySelf: true });
                    } else if (controlArray instanceof FormGroup) {
                        this.validateForm(controlArray);
                    }
                });
            }
        });
    }

    public cleanNulls(object){
        if (typeof object == "object"){
            for(let i in object){
                if (object[i]==null || typeof object[i] =="undefined")
                    delete object[i];
                // if (typeof object[i]=="object")
                //     this.cleanNulls(object[i]);
            }
        }

        return object;
    }

    public formAtLeatsOneValue(_form: FormGroup) {
        for (let i = 0; i < Object.keys(_form.controls).length; i++) {

            const keys = Object.keys(_form.controls);

            const control = _form.get(keys[i]);

            if (control instanceof FormControl) {
                if (control.value !== '' && control.value !== undefined && control.value !== null ) {
                    return true;
                }
            } else if (control instanceof FormGroup) {
                if (this.formAtLeatsOneValue(control)) {
                    return true;
                }
            } else if (control instanceof FormArray) {
                for (let j = 0; j < Object.keys(_form.controls).length; j++) {
                    const arrkeys = Object.keys(_form.controls);
                    const controlArray = control.controls[arrkeys[j]];
                    if (controlArray instanceof FormControl) {
                        if (control.value !== '' && control.value !== undefined && control.value !== null ) {
                            return true;
                        }
                    } else if (controlArray instanceof FormGroup) {
                        if (this.formAtLeatsOneValue(controlArray)) {
                            return true;
                        }
                    }
                }
            }

        }

        return false;
    }
}
