import { Component, ViewChild } from '@angular/core';
import { MdPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';
import { Predenuncia } from '@models/predenuncia';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
    templateUrl:'./create.component.html',
})
export class PredenunciaCreateComponent {

}

@Component({
	selector: 'predenuncia',
    templateUrl:'./predenuncia.component.html',
})
export class PredenunciaComponent {
	public form1  : FormGroup;
    public form2  : FormGroup;
    public model : Predenuncia;


    constructor(private _fbuilder: FormBuilder) { }
    ngOnInit(){
        this.model = new Predenuncia();
        this.form1  = new FormGroup({
            'calidadUsuario'        :  new FormControl(this.model.calidadUsuario),
            'numeroTelefono'	    :  new FormControl(this.model.numeroTelefono),
            'tipoLineaTelefonica'   :  new FormControl(this.model.tipoLineaTelefonica),
            'lugarLlamada'          :  new FormControl(this.model.lugarLlamada),
            'hechosNarrados'        :  new FormControl(this.model.hechosNarrados),
            'usuario'               :  new FormControl(this.model.usuario),
            'horaConlcusionLlamada' :  new FormControl(this.model.horaConlcusionLlamada),
            'duracionLlamada'       :  new FormControl(this.model.duracionLlamada),
            'nombreServidorPublico' :  new FormControl(this.model.nombreServidorPublico),
            'observaciones'         :  new FormControl(this.model.observaciones),

          });

            this.form2  = new FormGroup({
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
            'canalizaOtraArea'          :  new FormControl(this.model.canalizaOtraArea),
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
          });

    }

    public save(valid : any, model : any):void{
        console.log('Predenuncia@save()');
    }


	
}

@Component({
	selector: 'documento-predenuncia',
    templateUrl:'./documento-predenuncia.component.html',
})

export class DocumentoPredenunciaComponent {
	displayedColumns = ['nombre', 'procedimiento', 'fechaCreacion'];
	data: DocumentoPredenuncia[] = [
		{id: 1, nombre: 'Entrevista.pdf',    	procedimiento: 'N/A', 		fechaCreacion:'07/09/2017'},
		{id: 2, nombre: 'Nota.pdf',         	procedimiento: 'N/A', 		fechaCreacion:'07/09/2017'},
		{id: 3, nombre: 'Fase.png',         	procedimiento: 'N/A', 		fechaCreacion:'07/09/2017'},
		{id: 4, nombre: 'Entrevista1.pdf',  	procedimiento: 'N/A',     	fechaCreacion:'07/09/2017'},
		{id: 5, nombre: 'Fase1.png',        	procedimiento: 'N/A',     	fechaCreacion:'07/09/2017'},
	];

	dataSource: TableService | null;
	@ViewChild(MdPaginator) paginator: MdPaginator;


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
