import { Component } from "@angular/core";
import { InformeBaseComponent } from "../informe-base.component";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Form } from "../create/form";

@Component({
    selector: 'app-solicitud-iph',
    templateUrl: './solicitud.component.html'
})

export class SolicitudIphComponent extends InformeBaseComponent  {

    public form: FormGroup;
    constructor(public fbuilder: FormBuilder, private activatedRoute: ActivatedRoute) {
        super();
    }

    ngOnInit() {
        this.form = Form.createForm(this.fbuilder);
        console.log('-> Form', this.form.value);
    }
}
