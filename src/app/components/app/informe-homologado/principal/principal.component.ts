import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService} from '@services/http.service';

@Component({
    selector: 'principal',
    templateUrl: './principal/principal.component.html'
})

export class PrincipalInformeHomologadoCreate {

    public breadcrumb = [];

    constructor(
        private route: ActivatedRoute,
        private http: HttpService){
        // super();
    }

}