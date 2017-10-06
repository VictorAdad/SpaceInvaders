import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router} from '@angular/router';
import { Lugar } from '@models/lugar';
import { OnLineService} from '@services/onLine.service';
import { HttpService} from '@services/http.service';
import { MOption } from '@partials/form/select2/select2.component';
import { CIndexedDB } from '@services/indexedDB';
import { NoticiaHechoGlobal } from '../../global';
import { MapsAPILoader } from '@agm/core';
import { } from 'googlemaps';
import * as moment from 'moment';
import { SelectsService} from '@services/selects.service';
import { LugarService} from '@services/noticia-hecho/lugar.service';

@Component({
    selector: 'lugar-create',
    templateUrl: './create.component.html'
})
export class LugarCreateComponent extends NoticiaHechoGlobal implements OnInit{

    public form: FormGroup;
    public model: Lugar;
    public lat: number = 19.4968732;
    public lng: number = -99.7232673;
    public latMarker: number = 19.4968732;
    public lngMarker: number = -99.7232673;
    public casoId: number = null;
    public id: number = null;
    public searchControl: FormControl;
    public zoom: number = 10;
    public isMexico: boolean = false;
    public detalleLugar = new DetalleLugar();
    public detalleLugarFinded = [];
    @ViewChild("search")
    public searchElementRef: ElementRef;

    constructor(
        private _fbuilder: FormBuilder,
        private route: ActivatedRoute,
        private onLine: OnLineService,
        private http: HttpService,
        private router: Router,
        private db:CIndexedDB,
        private mapsAPILoader: MapsAPILoader,
        private ngZone: NgZone,
        private optionsServ: SelectsService,
        private lugarServ: LugarService
        ) {
        super();
        lugarServ.getData();
    }

    options:MOption[]=[
        {value:"1", label:"Opcion 1"},
        {value:"2", label:"Opcion 2"},
        {value:"3", label:"Opcion 3"}
        ];

    ngOnInit() {
        this.model = new Lugar();
        this.searchControl = new FormControl();
        this.form = this.createForm();

        this.route.params.subscribe(params => {
            if(params['casoId'])
                this.casoId = +params['casoId'];
            if(params['id']){
                this.id = +params['id'];
                if(this.onLine.onLine){
                    this.http.get('/v1/base/lugares/'+this.id).subscribe(response =>{
                        this.fillForm(response);
                    });
                }else{
                  this.db.get("casos",this.casoId).then(t=>{
                    let lugares=t["lugar"] as any[];
                    for (var i = 0; i < lugares.length; ++i) {
                        if ((lugares[i])["id"]==this.id){
                            this.fillForm(lugares[i]);
                            break;
                        }
                    }
                   });
                }
                
            }
        });
        this.mapsAPILoader.load().then(() => {
            let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
                types: ["address"]
            });
            autocomplete.addListener("place_changed", () => {
                this.ngZone.run(() => {    
                //get the place result
                let place: google.maps.places.PlaceResult = autocomplete.getPlace();

                //verify result
                if (place.geometry === undefined || place.geometry === null) {
                return;
                }

                //set latitude, longitude and zoom
                this.lat = place.geometry.location.lat();
                this.lng = place.geometry.location.lng();
                this.latMarker = place.geometry.location.lat();
                this.lngMarker = place.geometry.location.lng();
                this.zoom = 17;
                });
            });
        });
    }

    public createForm(): FormGroup{
        return new FormGroup({
            'tipo'            : new FormControl(this.model.tipo, [Validators.required,]),
            'tipoZona'        : new FormControl(this.model.tipo_zona, [Validators.required,]),
            'calle'           : new FormControl(this.model.calle, [Validators.required,]),
            'referencias'     : new FormControl(this.model.referencias, [Validators.required,]),
            'estadoOtro'      : new FormControl(this.model.estado, [Validators.required,]),
            'municipioOtro'   : new FormControl(this.model.municipio_delegacion, [Validators.required,]),
            'coloniaOtro'     : new FormControl(this.model.colonia_asentamiento, [Validators.required,]),
            'fecha'           : new FormControl(this.model.fecha, [Validators.required,]),
            'hora'            : new FormControl(this.model.hora, [Validators.required,]),
            'cp'              : new FormControl(this.model.notas, []),
            'dia'             : new FormControl(this.model.notas, []),
            'descripcion'     : new FormControl(this.model.notas, []),
            'notas'           : new FormControl(this.model.notas, []),
            'numExterior'     : new FormControl(this.model.notas, []),
            'numInterior'     : new FormControl(this.model.notas, []),
            'refeGeograficas' : new FormControl(this.model.notas, []),
            'detalleLugar' : new FormGroup({
                'id': new FormControl("",[]),
            }),
            'pais': new FormGroup({
                'id': new FormControl("",[Validators.required,]),
            }),
            'estado': new FormGroup({
                'id': new FormControl("",[Validators.required,]),
            }),
            'municipio': new FormGroup({
                'id': new FormControl("",[Validators.required,]),
            }),
            'colonia': new FormGroup({
                'id': new FormControl("",[Validators.required,]),
            }),
            'caso': new FormGroup({
                'id': new FormControl("",[]),
            }),
        });
    }

    public save(_valid : any, _model : any):void{
        _model.caso.id      = this.casoId;
        _model.latitud      = this.latMarker;
        _model.longitud     = this.lngMarker;
        _model.fecha        = moment(_model.fecha).format('YYYY-MM-DD');
        if(this.detalleLugarFinded.length > 0){
            _model.detalleLugar.id = this.detalleLugarFinded[0].id;
        }
        
        if(this.onLine.onLine){
            this.http.post('/v1/base/lugares', _model).subscribe(
                (response) => {
                    this.router.navigate(['/caso/'+this.casoId+'/noticia-hecho' ]);
                },
                (error) => {
                    console.error('Error', error);
                }
            );
        }else{
            let temId=Date.now();
            let dato={
                url:'/v1/base/lugares',
                body:_model,
                options:[],
                tipo:"post",
                pendiente:true,
                dependeDe:[this.casoId],
                temId: temId
            }
            this.db.add("sincronizar",dato).then(p=>{
                this.db.get("casos",this.casoId).then(caso=>{
                    if (caso){
                        if(!caso["lugar"]){
                            caso["lugar"]=[];
                        }
                        _model["id"]=temId;
                        caso["lugar"].push(_model);
                        this.db.update("casos",caso).then(t=>{
                            this.router.navigate(['/caso/'+this.casoId+'/noticia-hecho' ]);
                        });
                    }
                });
            }); 
        }
    }

    public edit(_valid : any, _model : any):void{
        console.log('-> Lugar@edit()', _model);
        Object.assign(this.model, _model);
        this.model.fecha = moment(this.model.fecha).format('YYYY-MM-DD');
        this.model.latitud      = this.latMarker;
        this.model.longitud     = this.lngMarker;
        if(this.onLine.onLine){
            this.http.put('/v1/base/lugares/'+this.id, _model).subscribe((response) => {
                console.log('-> Registro acutualizado', response);
            });
        }else{
            let dato={
                url:'/v1/base/lugares/'+this.id,
                body:_model,
                options:[],
                tipo:"update",
                pendiente:true,
                dependeDe:[this.casoId, this.id]
            }
            this.db.add("sincronizar",dato).then(p=>{
                this.db.get("casos",this.casoId).then(t=>{
                    let lugares=t["lugar"] as any[];
                    for (var i = 0; i < lugares.length; ++i) {
                        if ((lugares[i])["id"]==this.id){
                            lugares[i]=_model;
                            break;
                        }
                    }
                    console.log("caso",t);
                });
            }); 
        }
    }

    public fillForm(_data){
        _data.fecha = new Date(_data.fecha);
        this.zoom   = 17;
        this.lat    = _data.latitud;
        this.lng    = _data.longitud;
        this.latMarker = _data.latitud;
        this.lngMarker = _data.longitud;
        this.form.patchValue(_data);
    }

    public changeLocation(_e){
        console.log(_e);
        this.latMarker = _e.coords.lat;
        this.lngMarker = _e.coords.lng;
    }

    changePais(id){
        if(id){
            if(id === 1){
                this.isMexico = true;
                this.optionsServ.getEstadoByPais(id);
                this.form.controls.estado.enable();
                this.form.controls.municipio.enable();
                this.form.controls.colonia.enable();
                this.form.controls.estadoOtro.disable();
                this.form.controls.municipioOtro.disable();
                this.form.controls.coloniaOtro.disable();
            }else{
                this.isMexico = false;
                this.form.controls.estado.disable();
                this.form.controls.municipio.disable();
                this.form.controls.colonia.disable();
                this.form.controls.estadoOtro.enable();
                this.form.controls.municipioOtro.enable();
                this.form.controls.coloniaOtro.enable();
            }
        }
    }  

    changeEstado(id){
        if(id)
            this.optionsServ.getMunicipiosByEstado(id);
    }

    changeMunicipio(id){
        if(id)
            this.optionsServ.getColoniasByMunicipio(id);
    }

    findDetalleLugar(_e, _tipo:string){
        this.detalleLugar.setValue(_e, _tipo)
        this.detalleLugarFinded = this.lugarServ.detalleLugar.filter(object => {
            return object.tipoLugar === this.detalleLugar.tipoLugar && object.tipoZona === this.detalleLugar.tipoZona && object.dia === this.detalleLugar.dia
        });
    }

}

export class DetalleLugar {
    
    public tipoLugar: string;
    public tipoZona: string;
    public dia: string;

    public setValue(_value:string, _tipo:string){
        if(_tipo === 'tipoLugar'){
            this.tipoLugar = _value;
        }
        if(_tipo === 'tipoZona'){
            this.tipoZona = _value;
        }
        if(_tipo === 'dia'){
            this.dia = _value;
        }
    }

    changeMunicipio(id){
        console.log("municipio=>",id);
        if (id)
            this.optionsServ.getColoniasByMunicipio(id);
    }

}