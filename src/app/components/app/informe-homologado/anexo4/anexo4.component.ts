import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService} from '@services/http.service';

@Component({
    selector: 'anexo4',
    templateUrl: './anexo4.component.html'
})

export class Anexo4Component {

    public breadcrumb = [];

    constructor(
        private route: ActivatedRoute,
        private http: HttpService){
        // super();
    }
}