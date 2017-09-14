import {Component, OnInit} from '@angular/core';
import { ActivatedRoute }    from '@angular/router';

@Component({
    templateUrl: './home.component.html',
    styleUrls  :['./home.component.css']
})
export class HomeComponent implements OnInit {
    folders = [
    {
      name    : 'CAI/AIN/UAI/268/00126/17/08',
      titulo  : 'Título de la noticia de hechos',
      descripcion: 'Esta es una breve y muy corta descripción',
      updated : new Date('1/1/16'),
    },
    {
      name: 'CAI/AIN/UAI/268/00126/17/08',
      titulo  : 'Título de la noticia de hechos',
      descripcion: 'Esta es una breve y muy corta descripción',
      updated: new Date('1/17/16'),
    },
    {
      name: 'CAI/AIN/UAI/268/00126/17/08',
      titulo  : 'Título de la noticia de hechos',
      descripcion: 'Esta es una breve y muy corta descripción',
      updated: new Date('1/28/16'),
    },
    {
      name    : 'CAI/AIN/UAI/268/00126/17/08',
      titulo  : 'Título de la noticia de hechos',
      descripcion: 'Esta es una breve y muy corta descripción',
      updated : new Date('1/1/16'),
    },
    {
      name: 'CAI/AIN/UAI/268/00126/17/08',
      titulo  : 'Título de la noticia de hechos',
      descripcion: 'Esta es una breve y muy corta descripción',
      updated: new Date('1/17/16'),
    },
    {
      name: 'CAI/AIN/UAI/268/00126/17/08',
      titulo  : 'Título de la noticia de hechos',
      descripcion: 'Esta es una breve y muy corta descripción',
      updated: new Date('1/28/16'),
    }
    ];
    constructor(private route: ActivatedRoute) { }

    ngOnInit(){
        console.log('-> Route', this.route);
    }
}