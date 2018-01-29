import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '@services/http.service';
import { Form } from './form';
import { Observable } from 'rxjs';
import { InformeBaseComponent } from '@components-app/informe-homologado/informe-base.component';

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
        if (InformeBaseComponent.userOption) {
            this.fillForm()            
        }

    }

    public fillForm() {
        let _data = JSON.parse(localStorage.getItem('Principal'));
        let timer = Observable.timer(10);
        timer.subscribe(t => {
            this.form.patchValue(_data);
        });
        InformeBaseComponent.userOption = false;
        
    }  

}