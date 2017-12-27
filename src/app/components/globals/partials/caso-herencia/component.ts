import { ConfirmationService } from '@jaspero/ng2-confirmations';
import { Observable } from 'rxjs';
import { MatPaginator, MatDialog } from '@angular/material';
import { HttpService } from '@services/http.service';
import { NoticiaHechoService } from './../../../../services/noticia-hecho.service';
import { Component, OnInit, Input, ViewChild, Output,EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Caso, CasoService } from '@services/caso/caso.service';
import { Logger } from "@services/logger.service";
import { TableService} from '@utils/table/table.service';
import { Event } from '@angular/router/src/events';
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
  @Input('heredarFunction')
	public heredarFunction: any;
  @Output()
  public lugarChange:EventEmitter<string> = new EventEmitter<string>();
  @Output()
  public armaChange:EventEmitter<string> = new EventEmitter<string>();
  @Output()
  public vehiculoChange:EventEmitter<string> = new EventEmitter<string>();
  @Output()
  public delitoChange:EventEmitter<string> = new EventEmitter<string>();
  @Output()
  public personasChange:EventEmitter<any[]> = new EventEmitter<any[]>();

  public settings:ConfirmSettings={
		overlayClickToClose: false,
		showCloseButton: true,
		confirmText: "Continuar",
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
        this.http.get('/v1/base/personas-casos/'+_id).subscribe(response =>{
          (this.form.controls.personas as FormArray).push(new FormGroup({"id":new FormControl(_id,[])}));
          console.log(response);
          this.personas.push(response);
          console.log(this.personas);
          this.personasChanged();
    });
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
  public heredarDatos(){
    this._confirmation.create('Advertencia','¿Estás seguro de que deseas heradar estos datos?',this.settings).subscribe(
      (ans: ResolveEmit) => {
        if(ans.resolved){
          console.log("Heredar datos", this.heredarFunction)
          this.heredarFunction();
        }
        else{
          console.log("No heredar datos")
        }
      });
  }
  public lugarChanged(id){
    this.lugarChange.emit(id);
  }
  public armaChanged(id){
    this.armaChange.emit(id);
  }
  public delitoChanged(id){
    this.delitoChange.emit(id);
  }
  public vehiculoChanged(id){
    this.vehiculoChange.emit(id);
  }
  public personasChanged(){
    this.personasChange.emit(this.personas);
  }
}


export class MOption{
	value: any;
	label: any;
}

