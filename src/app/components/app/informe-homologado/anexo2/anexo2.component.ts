import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService} from '@services/http.service';

@Component({
    selector: 'anexo2',
    templateUrl: './anexo2.component.html'
})

export class Anexo2Component {

    public breadcrumb = [];

    constructor(
        private route: ActivatedRoute,
        private http: HttpService){
        // super();
    }

}