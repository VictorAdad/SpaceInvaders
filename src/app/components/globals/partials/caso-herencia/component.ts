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
import { forEach } from '@angular/router/src/utils/collection';

@Component({
	selector    : 'caso-herencia',
  	templateUrl : './component.html'
})
export class CasoHerenciaComponent implements OnInit{

  panelOpenState: boolean = true;

  public lugares:any[]=[];
  public personasTipo:any[] =[];
  @Input()
  public optionPersonas:any[];
  @Input()
  public people:any[];
  @Input()
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
  @Output()
  public heredarChange:EventEmitter<boolean> = new EventEmitter<boolean>();

  public settings:ConfirmSettings={
		overlayClickToClose: false,
		showCloseButton: true,
		confirmText: "Continuar",
		declineText: "Cancelar",
	};

  public caso: Caso
  public heredar:boolean;
  public heredarSintesisHechos:boolean;

	constructor(
    public casoServ: CasoService,
    public optionsNoticia: NoticiaHechoService,
    private http: HttpService,
    private _confirmation: ConfirmationService,
    public dialog: MatDialog

  ){
	}

	ngOnInit(){
    this.heredar=false;
    this.setHeredarDatos(this.heredar);
		this.casoServ.find(this.casoId).then(
      response =>{
        console.log('CaseoServ', this.casoServ);
        this.caso = this.casoServ.caso
        this.optionsNoticia.setId(this.casoId, this.caso);
        this.optionsNoticia.getData();
        this.optionsNoticia.getPersonas();
        this.personasTipo = this.casoServ.caso.optionsPersonasTipo();
        this.lugares = this.casoServ.caso.optionsLugares();
        this.personas=[]; 
        this.people
        this.fillCampos();
        let timer = Observable.timer(10000);
        timer.subscribe(t => {
          if (this.people){
            for (let i=0; i<this.people.length; i++){
              this.addPersona(this.people[i].personaCaso.id);
            }
          }
        })   
  })
 };
  public addPersona(_id){
    console.log('Persona Change',_id)
    for (let i=0; i<this.casoServ.caso.personaCasos.length;i++){
      if(this.casoServ.caso.personaCasos[i].id==_id && !this.isInPersonas(_id)){
        var response = this.casoServ.caso.personaCasos[i];
          (this.form.controls.personas as FormArray).push(new FormGroup({"id":new FormControl(_id,[])}));
          this.personas.push(response);
          this.personasChanged();
          break;
      }
    }
    console.log(this.form)
  }
  public isInPersonas(_id){
    for (let i=0; i<this.personas.length;i++){
         if(this.personas[i].id==_id)
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
    this.heredarChanged();

  }
  public setHeredarSintesis(checked){
    console.log(this.form);
    this.heredarSintesisHechos=checked;
  }

  public fillCampos(){
    let timer = Observable.timer(1000);
    timer.subscribe(t => {
      this.personas.push(this.caso.personaCasos[0]);
      this.form.patchValue({
        'personas':[{
          'id':this.personasTipo[0].value
        }],
        'lugar': {
          'id': this.lugares[0].value
        },
        'delito': this.caso,
        'vehiculo': {
          'id': this.optionsNoticia.vehiculos.length > 0 ? this.optionsNoticia.vehiculos[0].value : ''
        },
        'arma': {
          'id': this.optionsNoticia.armas.length > 0 ? this.optionsNoticia.armas[0].value : ''
        }
      });
    });
  }

  public heredarDatos(){
    this._confirmation.create('Advertencia','¿Estás seguro de que deseas heradar estos datos?',this.settings).subscribe(
      (ans: ResolveEmit) => {
        if(ans.resolved){
          console.log("Heredar datos", this.heredarFunction)

          if (this.heredarFunction)
            this.heredarFunction();

          if (this.heredarChanged)
              this.heredarChanged();

          this.panelOpenState= false;

        }
        else{
          console.log("No heredar datos")
        }
      });
  }
  public changeState(){
    this.panelOpenState= true;
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
  public heredarChanged(){
    this.heredarChange.emit(this.heredar);
  }
}



export class MOption{
	value: any;
	label: any;
}

