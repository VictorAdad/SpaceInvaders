import { Component, OnInit} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Caso } from '@models/caso';
import { GlobalComponent } from '@components-app/global.component';
import { LoaderComponent } from '@partials/loader/component';
import { MdDialog } from '@angular/material';
import { CIndexedDB } from '@services/indexedDB';
import {Router} from '@angular/router';

@Component({
    selector : 'datos-generales',
    templateUrl:'./component.html'
})
export class DatosGeneralesComponent implements OnInit{
    public form    : FormGroup;
    public model   : Caso;
    private db     : CIndexedDB;
    private router : Router;

    public constructor(
        private _fbuilder: FormBuilder,
        _db: CIndexedDB,
        _router: Router
    ) { 
        this.db = _db;
        this.router = _router;
    }

    ngOnInit(){
        this.model = new Caso();
        this.form  = new FormGroup({
            'titulo'   : new FormControl(this.model.titulo, [Validators.required]),
            'sintesis' : new FormControl(this.model.sintesis, [Validators.required]),
            'delito'   : new FormControl(this.model.delito, [Validators.required])
        });
    }

    public save(_valid : any, _model : any):void{
        console.log('-> Caso@save()', _model);
        _model.created = new Date();
        this.db.add('casos', _model).then(object => {
            this.router.navigate(['/noticia-hecho', object['id']]);
        });
    }

}
