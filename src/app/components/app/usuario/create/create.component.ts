import { Component, OnInit } from '@angular/core';
import { MRadioButton } from '@partials/form/radiobutton/radiobutton.component'


import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MiservicioService,MDato } from '@services/miservicio.service';




@Component({
  templateUrl: './create.component.html'
})


export class UsuarioCreateComponent implements OnInit{
  titulo: String = "Crear nuevo";
  dato : MDato;
  datosR: MRadioButton[] = [
    {
      "label" : "Radio 1",
      "value" : "valor"
    },
    {
      "label" : "Radio 2",
      "value" : "valor2"
    }
  ];

  constructor(
    private servicio: MiservicioService,
    private route: ActivatedRoute,
    private router: Router) {}
  
  
  ngOnInit(){
   
    this.dato = new MDato();
    this.dato.nombre="yolo";
    
  }

  save(data: MDato){
    console.log(data);
      this.servicio.post(data);
    this.router.navigate(['/usuarios']);
  }
}
