import { Component } from '@angular/core';
import { MOption } from '@partials/select2/select2.component';

@Component({
    templateUrl: './create.component.html'
})

export class RelacionCreateComponent {

    tiposRelacion:MOption[] = [
        { value:'Defensor del imputado', label:'Defensor del imputado' },
        { value:'Imputado-Víctima-Delito', label:'Imputado-Víctima-Delito' },
        { value:'Asesor jurídico de la víctima', label:'Asesor jurídico de la víctima' },
        { value:'Representante de la víctima', label:'Representante de la víctima' },
        { value:'Tutor de la víctima', label:'Tutor de la víctima' }
    ];
}