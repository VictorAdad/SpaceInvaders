import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute, Params} from '@angular/router';
import {HttpService} from '@services/http.service';
import {Form} from './form';
import {Observable} from 'rxjs';
import {InformeBaseComponent} from './../../informe-homologado/informe-base.component';

@Component({
  selector: 'informe-homologado-create',
  templateUrl: './create.component.html'
})

export class InformeHomologadoCreate extends InformeBaseComponent {

  public breadcrumb = [];

  public form: FormGroup;

  public casoId: number = null;

  constructor(public fbuilder: FormBuilder, private activatedRoute: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    this.form = Form.createForm(this.fbuilder);
    console.log('-> Form', this.form.value);
    this.fillForm();
  }

  public fillForm() {
    let informeId;
    this.activatedRoute.params.subscribe((params: Params) => {
      informeId = params['informeId'];
    });
    if (informeId != null) {
      let _data = JSON.parse(localStorage.getItem('Principal_' + informeId));
      console.log('------>>> ', _data);
      let timer = Observable.timer(1);
      timer.subscribe(t => {
        this.form.patchValue(_data);

        let timer = Observable.timer(1);
        timer.subscribe(t => {
          this.form.patchValue(_data);
        });
      });
      // InformeBaseComponent.idInforme = informeId;
    }
  }
}
