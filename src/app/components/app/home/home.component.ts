import {Component, OnInit} from '@angular/core';
import { ActivatedRoute }    from '@angular/router';

@Component({
    templateUrl: './home.component.html',
    styleUrls  :['./home.component.css']
})
export class HomeComponent implements OnInit {

    folders = [
    {
      name    : 'NIC: CAI/AIN/00/UAI/268/00126/17/08   NUC: CAI/AIN/00/UAI/268/00126/17/08',
      titulo  : 'Título de la noticia de hechos',
      descripcion: 'Esta es una breve y muy corta descripción', 
      updated:   this.fecha()
    },
    {
      name: 'NIC: CAI/AIN/00/UAI/268/00126/17/08   NUC: CAI/AIN/00/UAI/268/00126/17/08',
      titulo  : 'Título de la noticia de hechos',
      descripcion: 'Esta es una breve y muy corta descripción',
      updated:   this.fecha()
    },
    {
      name: 'NIC: CAI/AIN/00/UAI/268/00126/17/08   NUC: CAI/AIN/00/UAI/268/00126/17/08',
      titulo  : 'Título de la noticia de hechos',
      descripcion: 'Esta es una breve y muy corta descripción',
      updated:   this.fecha()
    },
    {
      name    : 'NIC: CAI/AIN/00/UAI/268/00126/17/08   NUC: CAI/AIN/00/UAI/268/00126/17/08',
      titulo  : 'Título de la noticia de hechos',
      descripcion: 'Esta es una breve y muy corta descripción',
      updated:   this.fecha()
    },
    {
      name: 'NIC: CAI/AIN/00/UAI/268/00126/17/08   NUC: CAI/AIN/00/UAI/268/00126/17/08',
      titulo  : 'Título de la noticia de hechos',
      descripcion: 'Esta es una breve y muy corta descripción',
      updated:   this.fecha()
    },
    {
      name: 'NIC: CAI/AIN/00/UAI/268/00126/17/08   NUC: CAI/AIN/00/UAI/268/00126/17/08',
      titulo  : 'Título de la noticia de hechos',
      descripcion: 'Esta es una breve y muy corta descripción',
      updated:   this.fecha()
    }
    ];
    

    constructor(private route: ActivatedRoute) { }

    ngOnInit(){
        console.log('-> Route', this.route);
    }
    fecha (){
           let meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

           var date = new Date ('12/02/1993');

           var dia = date.getDay();
           var mes = date.getMonth();
           var year = date.getFullYear();

           var user = 'Administrador del sistema'; //Necesita recibir el usuario 

           var x = 'Creado el '+ dia + ' de ' + meses[mes] + ' de ' + year + ' por el ' + user;
           return x;  
      }
}