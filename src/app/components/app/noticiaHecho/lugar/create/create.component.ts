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
import { Observable } from 'rxjs';

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
    @ViewChild("search")
    public searchElementRef: ElementRef;
    public breadcrumb = [];


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
            if(params['casoId']){
                this.casoId = +params['casoId'];
                this.breadcrumb.push({path:`/caso/${this.casoId}/noticia-hecho`,label:"Detalle noticia de hechos"})
             }
            if(params['id']){
                this.id = +params['id'];
                if(this.onLine.onLine){
                    this.http.get('/v1/base/lugares/'+this.id).subscribe(response =>{
                        console.log(response)
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
            'tipo'            : new FormControl('', [Validators.required,]),
            'tipoZona'        : new FormControl('', [Validators.required,]),
            'calle'           : new FormControl('', [Validators.required,]),
            'referencias'     : new FormControl('', [Validators.required,]),
            'estadoOtro'      : new FormControl('', [Validators.required,]),
            'municipioOtro'   : new FormControl('', []),
            'coloniaOtro'     : new FormControl('', []),
            'fecha'           : new FormControl('', [Validators.required,]),
            'hora'            : new FormControl('', [Validators.required,]),
            'cp'              : new FormControl('', []),
            'dia'             : new FormControl('', []),
            'descripcionLugar'     : new FormControl('', []),
            'notas'           : new FormControl('', []),
            'numExterior'     : new FormControl('', []),
            'numInterior'     : new FormControl('', []),
            'refeGeograficas' : new FormControl('', []),
            'detalleLugar' : new FormGroup({
                'id': new FormControl("",[])                
            }),
            'pais': new FormGroup({
                'id': new FormControl("",[Validators.required,]),
            }),
            'estado': new FormGroup({
                'id': new FormControl("",[Validators.required,]),
            }),
            'municipio': new FormGroup({
                'id': new FormControl("",[]),
            }),
            'colonia': new FormGroup({
                'id': new FormControl("",[]),
            }),
            'caso': new FormGroup({
                'id': new FormControl("",[]),
            }),
        });
    }

    public save(_valid : any, _model : any):void{
        _model.municipioOtro="wwww";
        _model.coloniaOtro="wwwwwww";
        _model.estadoOtro="Yucatán"
        _model.caso.id      = this.casoId;
        _model.latitud      = this.latMarker;
        _model.longitud     = this.lngMarker;
        _model.fecha        = moment(_model.fecha).format('YYYY-MM-DD');
        if(this.lugarServ.finded.length > 0){
            _model.detalleLugar.id = this.lugarServ.finded[0].id;
        }
        
        if(this.onLine.onLine){
            this.http.post('/v1/base/lugares', _model).subscribe(
                (response) => {
                    console.log('-> registro guardado', response);
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
        console.log(_data.fecha);
        this.zoom   = 17;
        this.lat    = _data.latitud;
        this.lng    = _data.longitud;
        this.latMarker = _data.latitud;
        this.lngMarker = _data.longitud;
        let timer = Observable.timer(1);
       /* 
        timer.subscribe(t=>{
            this.form.patchValue(
              {
                  'tipo'            : _data.detalleLugar.tipo,
                  'tipoZona'        : _data.detalleLugar.tipoZona,
                  "dia"             :_data.detalleLugar.dia,
              }

            );
        });
        */

        this.form.patchValue(
            {
                'tipo'            : _data.detalleLugar.tipoLugar,
                'tipoZona'        : _data.detalleLugar.tipoZona,
                "dia"             :_data.detalleLugar.dia,
                "colonia"         :_data.detalleLugar.dia,
                "estadoOtro"      :_data.estadoOtro,
                "municipioOtro"   :_data.municipioOtro,
                "coloniaOtro"     :_data.coloniaOtro,
                "cp"              :_data.cp,
                "fecha"           :_data.fecha,
                "hora"            : moment(_data.fecha.getTime()).format("HH:MM"),
                "descripcionLugar":_data.descripcionLugar,
                "notas"           :_data.notas,
                "refeGeograficas" :_data.refeGeograficas,
                "calle"           :_data.calle,
                "numExterior"     :_data.numExterior,
                "numInterior"     :_data.numInterior,
                "pais"            :_data.pais,
                "referencias"     :_data.referencias,
                
            }

          );
    //  this.form.patchValue(_data);
        
    }

    public changeLocation(_e){
        console.log(_e);
        this.latMarker = _e.coords.lat;
        this.lngMarker = _e.coords.lng;
    }

    changePais(id){
        if(id != null){
            if(id === 0){
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

}

