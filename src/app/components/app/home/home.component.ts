import {Component} from '@angular/core';

@Component({
    templateUrl: './home.component.html',
    styleUrls  :['./home.component.css']
})
export class HomeComponent {
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
}