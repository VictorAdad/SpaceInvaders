import { FormatosGlobal } from './../../solicitud-preliminar/formatos';
import { Predenuncia } from '@models/predenuncia';
import { Component, ViewChild,Output,Input,EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { TableService } from '@utils/table/table.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { OnLineService } from '@services/onLine.service';
import { HttpService } from '@services/http.service';
import { _config } from '@app/app.config';
import { CIndexedDB } from '@services/indexedDB';

export class PredenunciaGlobal{
  public validateMsg(form: FormGroup){
        return !form.valid ? 'No se han llenado los campos requeridos' : '';
    }
	public validateForm(form: FormGroup) {
        Object.keys(form.controls).forEach(field => {
            const control = form.get(field);
            if (control instanceof FormControl) {
                control.markAsTouched({ onlySelf: true });
            } else if (control instanceof FormGroup) {
                this.validateForm(control);
            }
        });
    }

}

@Component({
    templateUrl:'./create.component.html',
})
export class PredenunciaCreateComponent {
    public casoId: number = null;
    public hasPredenuncia:boolean = false;
    public apiUrl:string="/v1/base/predenuncias/casos/";
    public breadcrumb = [];
    solicitudId:number=null

    constructor(private route: ActivatedRoute, private http: HttpService){}

    ngOnInit(){
        this.route.params.subscribe(params => {
            if(params['id']){
                this.casoId = +params['id'];
                this.breadcrumb.push({path:`/caso/${this.casoId}/detalle`,label:"Detalle del caso"})
            }
            if (params['casoId']){
                this.http.get(this.apiUrl+params['casoId']).subscribe(response => {
                    if(parseInt(response.totalCount) !== 0){
                        this.hasPredenuncia = true;
                    }
                });
            }

        });
    }


    idUpdate(event: any) {
      this.solicitudId = event.id;
      console.log("Recibiendo id emitido", event.id);
    }

}

@Component({
	selector: 'predenuncia',
    templateUrl:'./predenuncia.component.html',
})
export class PredenunciaComponent  extends PredenunciaGlobal{
	public form : FormGroup;
    public model : Predenuncia;
    public isUserX: boolean=false;// cambiar aquí la lógica del usuario
    public casoId: number = null;
    public hasPredenuncia:boolean=false;
    public apiUrl:string="/v1/base/predenuncias/casos/";
    @Output() idEmitter = new EventEmitter<any>();

    constructor(
        private _fbuilder: FormBuilder,
        private onLine: OnLineService,
        private http: HttpService,
        private router: Router,
        private route: ActivatedRoute) {
            super();
        }

    ngOnInit(){
        this.route.params.subscribe(params => {
            if (params['casoId'])
              {  this.casoId = +params['casoId'];
                 console.log(this.casoId);
                 this.http.get(this.apiUrl+this.casoId).subscribe(response => {
                 if(parseInt(response.totalCount) !== 0){
                    this.hasPredenuncia = true;
                    console.log("Dont have predenuncia");
                    this.form.disable();
                    this.model= response.data[0] as Predenuncia;
                    console.log("Emitiendo id..",this.model.id)
                    this.idEmitter.emit({id: this.model.id});
                    this.fillForm(response.data[0]);
                }
             });
            }

        });

        this.model = new Predenuncia();
        if (this.isUserX) {
            this.form  = new FormGroup({
            'calidadUsuario'        :  new FormControl(this.model.calidadUsuario),
            'numeroTelefono'        :  new FormControl(this.model.numeroTelefono),
            'tipoLineaTelefonica'   :  new FormControl(this.model.tipoLineaTelefonica),
            'lugarLlamada'          :  new FormControl(this.model.lugarLlamada),
            'hechosNarrados'        :  new FormControl(this.model.hechosNarrados),
            'usuario'               :  new FormControl(this.model.usuario),
            'horaConlcusionLlamada' :  new FormControl(this.model.horaConlcusionLlamada),
            'duracionLlamada'       :  new FormControl(this.model.duracionLlamada),
            'nombreServidorPublico' :  new FormControl(this.model.nombreServidorPublico),
            'observaciones'         :  new FormControl(this.model.observaciones),

          });
        } else {
            this.form  = new FormGroup({
            //Constancia de lectura de Derechos
            'numeroFolio'                    :  new FormControl(this.model.numeroFolio),
            'hablaEspanol'                   :  new FormControl(this.model.hablaEspanol),
            'idioma'                         :  new FormControl(this.model.idioma),
            'nombreInterprete'               :  new FormControl(this.model.nombreInterprete),
            'comprendioDerechos'             :  new FormControl(this.model.comprendioDerechos),
            'copiaDerechos'                  :  new FormControl(this.model.copiaDerechos),
            //Oficio de asignación de asesor jurídico
            'autoridadOficioAsignacion'      :  new FormControl(this.model.autoridadOficioAsignacion),
            'denunciaQuerella'               :  new FormControl(this.model.denunciaQuerella),
            'ubicacionUnidadInmediata'       :  new FormControl(this.model.ubicacionUnidadInmediata),
            'victimaOfendidoQuerellante'     :  new FormControl(this.model.victimaOfendidoQuerellante),
            'cargoAutoridadOficioAsignacion' :  new FormControl(this.model.cargoAutoridadOficioAsignacion),
             // Registro presenial
            'calidadPersona'          :  new FormControl(this.model.calidadPersona),
            'tipoPersona'          :  new FormControl(this.model.tipoPersona),
            'lugarHechos'          :  new FormControl(this.model.lugarHechos),
            'hechosNarrados'        :  new FormControl(this.model.hechosNarrados),
            'conclusionHechos'          :  new FormControl(this.model.conclusionHechos),
            'canalizacion'          :  new FormControl(this.model.canalizacion),
            'institucionCanalizacion'          :  new FormControl(this.model.institucionCanalizacion),
            'motivocanalizacion'          :  new FormControl(this.model.motivocanalizacion),
            'fechaCanalizacion'          :  new FormControl(this.model.fechaCanalizacion),
            'horaCanalizacion'          :  new FormControl(this.model.horaCanalizacion),
            'personaCausohecho'          :  new FormControl(this.model.personaCausohecho),
            'domicilioQuienCauso'          :  new FormControl(this.model.domicilioQuienCauso),
            'personaRegistro'          :  new FormControl(this.model.personaRegistro),
             // Oficio Ayuda atencion victima

            'oficio'                         :  new FormControl(this.model.victimaOfendidoQuerellante),
            'nombreAutoridadDirigeOficio'    :  new FormControl(this.model.victimaOfendidoQuerellante),
            'necesidadesCubrir'              :  new FormControl(this.model.victimaOfendidoQuerellante),
            'ubicacionUnidadInmediataVictima':  new FormControl(this.model.victimaOfendidoQuerellante),
            'cargoAutoridadVictima'          :  new FormControl(this.model.victimaOfendidoQuerellante),
            'observaciones'         :  new FormControl(this.model.observaciones),
          });

        }

    }

    public save(valid : any, _model : any){
        return new Promise<any>(
            (resolve, reject) => {
                if(this.onLine.onLine){
                    Object.assign(this.model, _model);
                    this.model.caso.id = this.casoId;
                    console.log(this.model);
                    this.model.tipo="Predenuncia";// temporalmente
                    this.http.post('/v1/base/predenuncias', this.model).subscribe(
                        (response) => {
                            console.log(response)
                            resolve(this.router.navigate(['/caso/'+this.casoId+'/predenuncia/create' ]));
                         },
                        (error) => {
                            console.error('Error', error);
                            reject(error);
                        }
                    );
                }
            }
        );
    }

    public fillForm(_data) {
        this.form.patchValue(_data);
        console.log(_data);
    }

}

@Component({
	selector: 'documento-predenuncia',
    templateUrl:'./documento-predenuncia.component.html',
})

export class DocumentoPredenunciaComponent extends FormatosGlobal {
  displayedColumns = ['nombre', 'procedimiento', 'fechaCreacion'];
  @Input() id:number=null;

	data: DocumentoPredenuncia[] = [
		{id: 1, nombre: 'Entrevista.pdf',    	procedimiento: 'N/A', 		fechaCreacion:'07/09/2017'},
		{id: 2, nombre: 'Nota.pdf',         	procedimiento: 'N/A', 		fechaCreacion:'07/09/2017'},
		{id: 3, nombre: 'Fase.png',         	procedimiento: 'N/A', 		fechaCreacion:'07/09/2017'},
		{id: 4, nombre: 'Entrevista1.pdf',  	procedimiento: 'N/A',     	fechaCreacion:'07/09/2017'},
		{id: 5, nombre: 'Fase1.png',        	procedimiento: 'N/A',     	fechaCreacion:'07/09/2017'},
	];
  dataSource: TableService | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
      public http: HttpService
      ){
      super(http);
  }

  ngOnInit() {
      this.dataSource = new TableService(this.paginator, this.data);
  }
}

export class DocumentoPredenuncia {
	id:number
	nombre: string;
	procedimiento: string;
	fechaCreacion: string;
}
