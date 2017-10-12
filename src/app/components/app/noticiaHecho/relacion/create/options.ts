import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';
import { MOption } from '@partials/form/select2/select2.component'
import { CIndexedDB } from '@services/indexedDB';
import {MatrizTipoTransportacion} from '@services/noticia-hecho/relacion/tipoTransportacion';
import {MatrizConductaDetalle} from '@services/noticia-hecho/relacion/conductaDetalle';
import {MatrizEfectoDetalle} from '@services/noticia-hecho/relacion/efectoDetalle';
import {MatrizViolenciaGenero} from '@services/noticia-hecho/relacion/violenciaGenero';
import {MatrizModalidadAmbito} from '@services/noticia-hecho/relacion/modalidadAmbito';
import {MatrizDesaparicionConsumacion} from '@services/noticia-hecho/relacion/desaparicionConsumacion';

export class Options {

    public gradoParticipacion: MOption[]       = [];
    public formaAccion: MOption[]              = [];
    public concursoDelito: MOption[]           = [];
    public clasificacionDelitoOrden: MOption[] = [];
    public modalidadDelito: MOption[]          = [];
    public formaComision: MOption[]            = [];
    public clasificacionDelito: MOption[]      = [];
    public elementoComision: MOption[]         = [];
    public formaConducta: MOption[]            = [];

    public matrizTipoTransportacion:MatrizTipoTransportacion; 
    public matrizConductaDetalle:MatrizConductaDetalle;
    public matrizEfectoDetalle:MatrizEfectoDetalle;
    public matrizViolenciaGenero:MatrizViolenciaGenero;
    public matrizModalidadAmbito:MatrizModalidadAmbito;
    public matrizDesaparicionConsumacion:MatrizDesaparicionConsumacion;

    constructor(
        private http: HttpService,
        private db:CIndexedDB
        ) {
        this.getData();
    }

    public getData(){
        this.getOptions('gradoParticipacion', '/v1/catalogos/relacion/grado-participacion');
        this.getOptions('formaAccion', '/v1/catalogos/relacion/forma-accion');
        this.getOptions('concursoDelito', '/v1/catalogos/relacion/concurso-delito');
        this.getOptions('clasifiacionDelitoOrden', '/v1/catalogos/relacion/clasificacion-delito-orden');
        this.getOptions('modalidadDelito', '/v1/catalogos/relacion/modalidad-delito');
        this.getOptions('formaComision', '/v1/catalogos/relacion/forma-comision');
        this.getOptions('clasificacionDelito', '/v1/catalogos/relacion/clasificacion-delito');
        this.getOptions('elementoComision', '/v1/catalogos/relacion/elemento-comision');
        this.getOptions('formaConducta', '/v1/catalogos/relacion/forma-conducta');
        this.matrizTipoTransportacion=new MatrizTipoTransportacion(this.db);
        this.matrizConductaDetalle=new MatrizConductaDetalle(this.db);
        console.log("conductadetalle",this.matrizConductaDetalle);
        this.matrizEfectoDetalle=new MatrizEfectoDetalle(this.db);
        this.matrizViolenciaGenero=new MatrizViolenciaGenero(this.db);
        this.matrizModalidadAmbito=new MatrizModalidadAmbito(this.db);
        this.matrizDesaparicionConsumacion=new MatrizDesaparicionConsumacion(this.db);
    }

    public getOptions(_attr: string, _url: string){
        this.http.get(_url).subscribe((response) => {
            this[_attr] = this.constructOptions(response);
        });
    }

    public constructOptions(_data:any){
        let options: MOption[] = [];

        for (var key in _data) {
            options.push({value: parseInt(key), label: _data[key]});
        }

        return options;
    }


}
