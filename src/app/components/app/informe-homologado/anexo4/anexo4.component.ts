import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpService} from '@services/http.service';
import {InformeBaseComponent} from '@components-app/informe-homologado/informe-base.component';

@Component({
  selector: 'anexo4',
  templateUrl: './anexo4.component.html'
})

export class Anexo4Component extends InformeBaseComponent {

  public breadcrumb = [];

  constructor(private route: ActivatedRoute,
              private http: HttpService) {
    super();
  }
}