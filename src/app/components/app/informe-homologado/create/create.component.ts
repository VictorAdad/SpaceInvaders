import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpService} from '@services/http.service';
import { Form } from './form';

@Component({
    selector: 'informe-homologado-create',
    templateUrl: './create.component.html'
})

export class InformeHomologadoCreate {

    public breadcrumb = [];

    public form: FormGroup

    constructor(public fbuilder: FormBuilder){
    }

    ngOnInit() {
        this.form =  Form.createForm(this.fbuilder);
        console.log('-> Form', this.form.value);
    }

}