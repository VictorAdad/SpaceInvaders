import { Component, OnInit } from '@angular/core';


import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MiservicioService,MDato } from '@services/miservicio.service';




@Component({
  templateUrl: './create.component.html'
})


export class UsuarioCreateComponent implements OnInit{
  titulo: String = "Crear nuevo";
  dato : MDato;

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
