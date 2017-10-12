import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';
import { MOption } from '@partials/form/select2/select2.component'

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

    constructor(
        private http: HttpService
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
