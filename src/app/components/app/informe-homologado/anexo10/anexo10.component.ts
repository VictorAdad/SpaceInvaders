import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService} from '@services/http.service';

@Component({
    selector: 'anexo10',
    templateUrl: './anexo10.component.html'
})

export class Anexo10Component {

    public breadcrumb = [];

    constructor(
        private route: ActivatedRoute,
        private http: HttpService){
        // super();
    }

}