import { Component, ViewChild, OnInit } from '@angular/core';
import { OnLineService } from '@services/onLine.service';
import { CIndexedDB } from '@services/indexedDB';
import { Router, ActivatedRoute } from '@angular/router';
import {Observable} from 'rxjs/Rx';
@Component({
    templateUrl: './nothing.component.html',
})
export class Nothing{
	constructor(
        private db: CIndexedDB,
        private onLine: OnLineService,
        private router : Router,
        ){
    }
	ngOnInit() {
		

    }

}