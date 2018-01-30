import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpService} from '@services/http.service';
import { Form } from './form';
import { Observable } from 'rxjs';
import { InformeBaseComponent } from '@components-app/informe-homologado/informe-base.component';

@Component({
    selector: 'informe-homologado-create',
    templateUrl: './create.component.html'
})

export class InformeHomologadoCreate {

    public breadcrumb = [];

    public form: FormGroup;

    constructor(public fbuilder: FormBuilder, private activatedRoute: ActivatedRoute){
    }

    ngOnInit() {
        this.form =  Form.createForm(this.fbuilder);
        console.log('-> Form', this.form.value);
        this.fillForm()            
    }

    public fillForm() {
        var informeId;
        this.activatedRoute.params.subscribe((params: Params) => {
            informeId = params['informeId'];
        });
        if (informeId != null) {
            let _data = JSON.parse(localStorage.getItem('Principal_'+informeId));
            console.log('------>>> ',_data);
            let timer = Observable.timer(10000);
            timer.subscribe(t => {
                this.form.patchValue(_data);
            });
            InformeBaseComponent.idInforme = informeId;
        }
    }  
}