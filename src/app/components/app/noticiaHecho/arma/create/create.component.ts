import {Component} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MOption } from '@partials/select2/select2.component'
@Component({
  selector: 'arma-create',
  templateUrl: 'create.component.html',
})

export class ArmaCreateComponent{
  clasesArmas:MOption[]=[
    {value:"Arma Blanca", label:"Arma Fuego"},
    {value:"Macana", label:"Macana"},
    {value:"Otra", label:"Otra"}
    ];
   options:MOption[]=[
    {value:"1", label:"Opcion 1"},
    {value:"2", label:"Opcion 2"},
    {value:"3", label:"Opcion 3"}
    ];
    isArmaFuego:boolean=false;
    valueChange(option){
    if(option=="Arma Blanca"){
    	console.log(option);
       this.isArmaFuego=true;
    }
    else{
       this.isArmaFuego=false;
    }
    }
    
}