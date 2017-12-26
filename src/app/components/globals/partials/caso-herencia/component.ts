import { ConfirmationService } from '@jaspero/ng2-confirmations';
import { Observable } from 'rxjs';
import { MatPaginator, MatDialog } from '@angular/material';
import { HttpService } from '@services/http.service';
import { NoticiaHechoService } from './../../../../services/noticia-hecho.service';
import { Component, OnInit, Input, ViewChild, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Caso, CasoService } from '@services/caso/caso.service';
import { Logger } from "@services/logger.service";
import { TableService} from '@utils/table/table.service';
import { Event } from '@angular/router/src/events';
import { EventEmitter } from 'events';
import { ResolveEmit,ConfirmSettings} from '@utils/alert/alert.service';


@Component({
	selector    : 'caso-herencia',
  	templateUrl : './component.html'
})
export class CasoHerenciaComponent implements OnInit{
  public personas:any[];
	@Input()
	public casoId: number;

	@Input()
	public form: FormGroup;
  @Output()
  public lugarChange:EventEmitter;
  @Output()
  public armaChange:EventEmitter;
  @Output()
  public vehiculoChange:EventEmitter;
  @Output()
  public delitoChange:EventEmitter;
  @Output()
  public personasChange:EventEmitter;

  public settings:ConfirmSettings={
		overlayClickToClose: false, // Default: true
		showCloseButton: true, // Default: true
		confirmText: "Continuar", // Default: 'Yes'
		declineText: "Cancelar",
	};

  public caso: Caso
  public heredar:boolean;
	constructor(
    public casoServ: CasoService,
    public optionsNoticia: NoticiaHechoService,
    private http: HttpService,
    private _confirmation: ConfirmationService,
    public dialog: MatDialog

  ){
	}

	ngOnInit(){
		this.casoServ.find(this.casoId).then(
      response =>{
        this.caso = this.casoServ.caso
        this.optionsNoticia.setId(this.casoId, this.caso);
        this.optionsNoticia.getData();
        this.optionsNoticia.getPersonas();
        this.personas=[];
        this.heredar=false;
        this.setHeredarDatos(this.heredar);
  })
 };
  public addPersona(_id){
    console.log('Persona Change',_id)
    for (let i=0; i<this.optionsNoticia.personas.length;i++){
      if(this.optionsNoticia.personas[i].value==_id && !this.isInPersonas(_id)){
        this.personas.push(this.optionsNoticia.personas[i]);
        (this.form.controls.personas as FormArray).push(new FormGroup({"id":new FormControl(_id,[])}));
        break;
      }
    }
    console.log(this.form)
  }
  public isInPersonas(_id){
    for (let i=0; i<this.personas.length;i++){
         if(this.personas[i].value==_id)
            return true;
    }
   return false;
  }
  public setHeredarDatos(checked){
    console.log(this.form);
    this.heredar=checked;
    if(this.heredar){
      this.form.controls.lugar["controls"].id.enable();
      this.form.controls.delito["controls"].id.enable();
      this.form.controls.vehiculo["controls"].id.enable();
      this.form.controls.arma["controls"].id.enable();
    }
    else{
      this.form.controls.lugar["controls"].id.disable();
      this.form.controls.delito["controls"].id.disable();
      this.form.controls.vehiculo["controls"].id.disable();
      this.form.controls.arma["controls"].id.disable();
    }
  }
  public lugarChanged(event){
     console.log(event as Event);
  }
  public heredarDatos(){
    this._confirmation.create('Advertencia','¿Estás seguro de que deseas heradar estos dato?',this.settings).subscribe(
      (ans: ResolveEmit) => {
        console.log(ans)
        if(ans.resolved){
          console.log("Heredar datos")
        }
        else{ console.log("No heredar datos")
        }
      });
  }
}


export class MOption{
	value: any;
	label: any;
}

