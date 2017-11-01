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
import { OnLineService} from '@services/onLine.service';

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
        private db:CIndexedDB,
        private onLine:OnLineService
        ) {
    }

    public getData(){
        this.getOptions('gradoParticipacion', '/v1/catalogos/relacion/grado-participacion/options',"grado_participacion");
        this.getOptions('formaAccion', '/v1/catalogos/relacion/forma-accion/options',"forma_accion");
        this.getOptions('concursoDelito', '/v1/catalogos/relacion/concurso-delito/options',"concurso_delito");
        this.getOptions('clasificacionDelitoOrden', '/v1/catalogos/relacion/clasificacion-delito-orden/options',"clasificacion_delito_orden");
        this.getOptions('modalidadDelito', '/v1/catalogos/relacion/modalidad-delito/options',"modalidad_delito");
        this.getOptions('formaComision', '/v1/catalogos/relacion/forma-comision/options',"forma_comision");
        this.getOptions('clasificacionDelito', '/v1/catalogos/relacion/clasificacion-delito/options',"clasificacion_delito");
        this.getOptions('elementoComision', '/v1/catalogos/relacion/elemento-comision/options',"elemento_comision");
        this.getOptions('formaConducta', '/v1/catalogos/relacion/forma-conducta/options',"forma_conducta");
        this.matrizTipoTransportacion=new MatrizTipoTransportacion(this.db);
        this.matrizConductaDetalle=new MatrizConductaDetalle(this.db);
        this.matrizEfectoDetalle=new MatrizEfectoDetalle(this.db);
        this.matrizViolenciaGenero=new MatrizViolenciaGenero(this.db);
        this.matrizModalidadAmbito=new MatrizModalidadAmbito(this.db);
        this.matrizDesaparicionConsumacion=new MatrizDesaparicionConsumacion(this.db);

    }

    public getOptions(_attr: string, _url: string, _catalogo:string){
        if (this.onLine.onLine){ 
            this.http.get(_url).subscribe((response) => {
                this[_attr] = this.constructOptions(response);
            });   
        }else{
            this.db.get("catalogos",_catalogo).then(cata=>{
                this[_attr] = this.constructOptions( cata["arreglo"] );
            });
        }
    }

    public constructOptions(_data:any){
        let options: MOption[] = [];
        for (var key in _data) {
            options.push({value: parseInt(key), label: _data[key]});
        }

        return options;
    }


}
