import {Municipio} from './../../../../../models/catalogo/municipio';
import {Colonia} from './../../../../../models/persona';
import {Caso} from './../../../../../models/caso';
import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {FormGroup, FormControl, FormBuilder, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Lugar} from '@models/lugar';
import {OnLineService} from '@services/onLine.service';
import {HttpService} from '@services/http.service';
import {MOption} from '@partials/form/select2/select2.component';
import {CIndexedDB} from '@services/indexedDB';
import {NoticiaHechoGlobal} from '../../global';
import {MapsAPILoader} from '@agm/core';
import {} from 'googlemaps';
import * as moment from 'moment';
import {SelectsService} from '@services/selects.service';
import {LugarService} from '@services/noticia-hecho/lugar.service';
import {Observable} from 'rxjs';
import {_config} from '@app/app.config';
import {Validation} from '@services/validation/validation.service';
import {CasoService} from '@services/caso/caso.service';
import {Logger} from '@services/logger.service';
import { AuthenticationService } from "@services/auth/authentication.service";
import { forEach } from '@angular/router/src/utils/collection';


@Component({
  selector: 'lugar-create',
  templateUrl: './create.component.html'
})
export class LugarCreateComponent extends NoticiaHechoGlobal implements OnInit {

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
  @ViewChild('search')
  public searchElementRef: ElementRef;
  public breadcrumb = [];
  public colonia: any;
  public autocomplete: any;
  public geoCalle: any;
  public geoNumero:any;
  public geoColonia:any;
  public geoMmunicipio:any;
  public geoEstado:any;
  public geoPais:any;
  public geocoder: any=null;
  public editFlag: boolean = false;
  public masDe3Dias:any; 


  constructor(private _fbuilder: FormBuilder,
              private route: ActivatedRoute,
              public onLine: OnLineService,
              private http: HttpService,
              private router: Router,
              private db: CIndexedDB,
              private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone,
              public optionsServ: SelectsService,
              public lugarServ: LugarService,
              private casoService: CasoService,
              private auth:AuthenticationService) {
    super();
    lugarServ.getData();
  }

  options: MOption[] = [
    {value: '1', label: 'Opcion 1'},
    {value: '2', label: 'Opcion 2'},
    {value: '3', label: 'Opcion 3'}
  ];

  ngOnInit() {
    this.auth.masDe3DiasSinConexion().then(r=>{
      let x= r as boolean;
      this.masDe3Dias=r;
    });
    this.model = new Lugar();
    this.searchControl = new FormControl();
    this.form = this.createForm();
    this.optionsServ.getData();
    Logger.log(this.optionsServ);

    this.route.params.subscribe(params => {
      if (params['casoId']) {
        this.casoId = +params['casoId'];
        this.breadcrumb.push({path: `/caso/${this.casoId}/noticia-hecho/lugares`, label: 'Detalle noticia de hechos'});
        this.casoService.find(this.casoId);
      }
      if (params['id']) {
        this.id = +params['id'];
        this.editFlag = true;
        if (this.onLine.onLine) {
          this.http.get('/v1/base/lugares/' + this.id).subscribe(response => {
            Logger.log('Lugar->', response);
            this.fillForm(response);
            this.form.controls.id.patchValue(this.id);
          });
        } else {
          //this.db.get("casos",this.casoId).then(t=>{
          this.casoService.find(this.casoId).then(r => {
            var t = this.casoService.caso;
            let lugares = t['lugares'] as any[];
            for (var i = 0; i < lugares.length; ++i) {
              if ((lugares[i])['id'] == this.id) {
                Logger.log('Lugar->', t);
                this.fillForm(lugares[i]);
                this.form.controls.id.patchValue(this.id);
                break;
              }
            }
          });
        }

      }
    });

    if(this.onLine.onLine){
      this.mapsAPILoader.load().then(() => {
        this.autocomplete= new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
          types: ['address']
        });
        this.autocomplete.addListener('place_changed', () => {
          this.ngZone.run(() => {
            //get the place result
            let place: google.maps.places.PlaceResult = this.autocomplete.getPlace();
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

      //this.geocoder = new google.maps.Geocoder();
    }
    
    let timer = Observable.timer(1);
    timer.subscribe(t => {
      this.validateForm(this.form);
    });
  }

  public createForm(): FormGroup {
    return new FormGroup({
      'id': new FormControl('', []),
      'tipo': new FormControl('', [Validators.required,]),
      'tipoZona': new FormControl('', [Validators.required,]),
      'calle': new FormControl('', [Validators.required,]),
      'referencias': new FormControl('', [Validators.required,]),
      'estadoOtro': new FormControl('', [Validators.required,]),
      'municipioOtro': new FormControl('', [Validators.required,]),
      'coloniaOtro': new FormControl('', [Validators.required,]),
      'fecha': new FormControl('', [Validators.required,]),
      'hora': new FormControl('', [Validators.required,]),
      'cp': new FormControl('', [Validation.validationMax(999999999)]),
      'dia': new FormControl('', []),
      'descripcionLugar': new FormControl('', []),
      'notas': new FormControl('', []),
      'noExterior': new FormControl('', []),
      'noInterior': new FormControl('', []),
      'referenciasGeograficas': new FormControl('', []),
      'detalleLugar': new FormGroup({
        'id': new FormControl('', [])
      }),
      'pais': new FormGroup({
        'id': new FormControl('', [Validators.required,]),
      }),
      'estado': new FormGroup({
        'id': new FormControl('', [Validators.required,]),
      }),
      'municipio': new FormGroup({
        'id': new FormControl('', [Validators.required,]),
      }),
      'colonia': new FormGroup({
        'id': new FormControl('', []),
        'idCp': new FormControl('', [Validators.required,]),
      }),
      'caso': new FormGroup({
        'id': new FormControl('', []),
      }),
    });
  }

  public addNombres(_model) {
    if (this.optionsServ.colonias && _model['colonia']) {
      for (var i = 0; i < this.optionsServ.colonias.length; ++i) {
        if (this.optionsServ.colonias[i]['value'].split('-')[0].indexOf(_model['colonia']['id'])) {
          _model['colonia']['nombre'] = this.optionsServ.colonias[i]['label'];
          _model['colonia']['cp'] = this.optionsServ.colonias[i]['value'].split('-')[1];
          break;
        }
      }
    }
    if (this.optionsServ.municipios && _model['municipio']) {
      for (var i = 0; i < this.optionsServ.municipios.length; ++i) {
        if (this.optionsServ.municipios[i]['value'] == _model['municipio']['id']) {
          _model['municipio']['nombre'] = this.optionsServ.municipios[i]['label'];
          break;
        }
      }
    }
    if (this.optionsServ.estados && _model['estado']) {
      for (var i = 0; i < this.optionsServ.estados.length; ++i) {
        if (this.optionsServ.estados[i]['value'] == _model['estado']['id']) {
          _model['estado']['nombre'] = this.optionsServ.estados[i]['label'];
          break;
        }
      }
    }
  }

  public save(_valid: any, _model: any) {
    if(_valid){
      return new Promise<any>((resolve, reject) => {
        _model.caso.id = this.casoId;
        _model.latitud = this.latMarker.toFixed(8);
        _model.longitud = this.lngMarker.toFixed(8);
        Logger.log('lo que envio: ' + _model.fecha);
        if (_model.fecha) {
          var hora = _model.hora;
          let fechaCompleta = new Date(_model.fecha);
          fechaCompleta.setMinutes(parseInt(hora.split(':')[1]));
          fechaCompleta.setHours(parseInt(hora.split(':')[0]));
          var mes: number = fechaCompleta.getMonth() + 1;
          _model.fecha = fechaCompleta.getFullYear() + '-' + mes + '-' + fechaCompleta.getDate() + ' ' + fechaCompleta.getHours() + ':' + fechaCompleta.getMinutes() + ':00.000';
          Logger.log('lo que envio: ' + _model.fecha);
        }
        if (this.lugarServ.finded.length > 0) {
          _model.detalleLugar.id = this.lugarServ.finded[0].id;
        }
        Logger.logColor('Options', 'cyan', this.optionsServ);

        if (this.onLine.onLine) {
          Logger.log('MODELO', _model);
          this.http.post('/v1/base/lugares', _model).subscribe(
            (response) => {
              Logger.log('-> registro guardado', response);
              Logger.log('hora guardada', new Date(response.fecha));
              resolve('Se creó un nuevo lugar con éxito');
              this.casoService.actualizaCaso();
              this.router.navigate(['/caso/' + this.casoId + '/noticia-hecho/lugares']);
              this.casoService.actualizaCaso();
            },
            (error) => {
              Logger.error('Error', error);
              reject(error);
            }
          );
        } else {
          this.addNombres(_model);
          let temId = Date.now();
          let dato = {
            url: '/v1/base/lugares',
            body: _model,
            options: [],
            tipo: 'post',
            pendiente: true,
            dependeDe: [this.casoId],
            temId: temId,
            username: this.auth.user.username
          };
          this.db.add('sincronizar', dato).then(p => {
            //this.db.get("casos",this.casoId).then(caso=>{
            var caso = this.casoService.caso;
            if (caso) {
              if (!caso['lugares']) {
                caso['lugares'] = [];
              }
              _model['id'] = temId;
              _model.detalleLugar['dia'] = _model['dia'];
              _model.detalleLugar['tipoLugar'] = _model['tipo'];
              _model.detalleLugar['tipoZona'] = _model['tipoZona'];

              caso['lugares'].push(_model);
              this.db.update('casos', caso).then(t => {
                resolve('Se creo un nuevo lugar con éxito');
                this.casoService.actualizaCasoOffline(t);
                this.router.navigate(['/caso/' + this.casoId + '/noticia-hecho/lugares']);
              });
            }
            //});
          });
        }
      });
    }else{
      console.error('El formulario no pasó la validación D:')
    }
  }

  public edit(_valid: any, _model: any) {
    return new Promise<any>((resolve, reject) => {
      Logger.log('-> Lugar@edit()', _model);
      Object.assign(this.model, _model);
      _model['fecha'] = moment(this.model.fecha).format('YYYY-MM-DD');
      _model['latitud'] = this.latMarker;
      _model['longitud'] = this.lngMarker;
      _model.caso.id = this.casoId;
      Logger.log('lo que envio: ' + _model.fecha);

      if (_model.fecha) {
        var hora = _model.hora;
        let fechaCompleta = new Date(_model.fecha);
        let minutos = hora ? hora.split(':')[1] : '0';
        let horas = hora ? hora.split(':')[0] : '0';
        var mes: number = fechaCompleta.getMonth() + 1;
        _model.fecha = fechaCompleta.getFullYear() + '-' + mes + '-' + fechaCompleta.getDate() + ' ' + horas + ':' + minutos + ':00.000';
        Logger.log('lo que envio: ' + _model.fecha);
      }
      if (this.lugarServ.finded.length > 0) {
        _model.detalleLugar.id = this.lugarServ.finded[0].id;
      }
      if (this.onLine.onLine) {
        Logger.log('Modelo a guardar', _model);
        this.http.put('/v1/base/lugares/' + this.id, _model).subscribe((response) => {
          Logger.log('-> Registro acutualizado', response);
          resolve('Se actualizó el lugar');
          this.casoService.actualizaCaso();
        }, e => {
          reject(e);
        });
      } else {
        this.addNombres(_model);
        let dato = {
          url: '/v1/base/lugares/' + this.id,
          body: _model,
          options: [],
          tipo: 'update',
          pendiente: true,
          dependeDe: [this.casoId, this.id],
          username: this.auth.user.username
        };
        this.db.add('sincronizar', dato).then(p => {
          //this.db.get("casos",this.casoId).then(t=>{
          var t = this.casoService.caso;
          let lugares = t['lugares'] as any[];
          _model['id'] = this.id;
          _model.detalleLugar['dia'] = _model['dia'];
          _model.detalleLugar['tipoLugar'] = _model['tipo'];
          _model.detalleLugar['tipoZona'] = _model['tipoZona'];
          for (var i = 0; i < lugares.length; ++i) {
            if ((lugares[i])['id'] == this.id) {
              lugares[i] = _model;
              break;
            }
          }
          this.db.update('casos', t).then(ts => {
            resolve('Se actualizo el lugar de manera local');
            this.casoService.actualizaCasoOffline(ts);
          });
          Logger.log('caso', t);
          //});
        });
      }
    });
  }

  public fillForm(_data) {
    _data.fecha = new Date(_data.fecha);
    Logger.log(_data.fecha.getMinutes());
    Logger.log(_data.fecha.getHours());
    this.zoom = 17;
    this.lat = _data.latitud;
    this.lng = _data.longitud;
    this.latMarker = _data.latitud;
    this.lngMarker = _data.longitud;
    let timer = Observable.timer(1);
    _data.hora = ((_data.fecha.getHours() < 10) ? ('0' + _data.fecha.getHours()) : _data.fecha.getHours()) + ':' + ((_data.fecha.getMinutes() < 10) ? ('0' + _data.fecha.getMinutes()) : _data.fecha.getMinutes());
    Logger.log(_data.hora);
    this.form.patchValue(
      {
        'tipo': _data.detalleLugar ? _data.detalleLugar.tipoLugar : null,
        'tipoZona': _data.detalleLugar ? _data.detalleLugar.tipoZona : null,
        'dia': _data.detalleLugar ? _data.detalleLugar.dia : null,
        'estadoOtro': _data.estadoOtro,
        'municipioOtro': _data.municipioOtro,
        'coloniaOtro': _data.coloniaOtro,
        'cp': _data.cp,
        'fecha': _data.fecha,
        'hora': _data.hora,
        'descripcionLugar': _data.descripcionLugar,
        'notas': _data.notas,
        'referenciasGeograficas': _data.referenciasGeograficas,
        'calle': _data.calle,
        'noExterior': _data.noExterior,
        'noInterior': _data.noInterior,
        'pais': _data.pais,
        'referencias': _data.referencias,
        // "colonia"         :_data.colonia? _data.colonia.nombre:new Colonia(),
        // "estado"          :_data.estado? _data.estado:{},
        // "municipio"       :_data.municipio? _data.municipio:new Municipio(),
        'detalleLugar': _data.detalleLugar ? _data.detalleLugar : {},
        'caso': _data.caso ? _data.caso : new Caso(),

      }
    );

    timer.subscribe(t => {
        this.form.patchValue({
            'colonia': _data.colonia ? _data.colonia : new Colonia(),
            'estado': _data.estado ? _data.estado : {},
            'municipio': _data.municipio ? _data.municipio : new Municipio(),
          }
        );
        if (_data.colonia) {
          this.form.controls.colonia.patchValue({
            id: _data.colonia.id,
            idCp: '' + _data.colonia.id + '-' + _data.colonia.cp
          });
        }
        Logger.logColor('DATOS', 'tomato', this.form.value, _data);
      }
    );


    //  this.form.patchValue(_data);

  }

  public changeLocation(_e) {
    Logger.log(_e);
    this.latMarker = _e.coords.lat;
    this.lngMarker = _e.coords.lng;
    Logger.log(this);
  }

  public fillCalle(value){
    if(value != null && value != undefined){
      this.geoCalle=value;
      if(!this.editFlag){
        if(this.geoCalle.length > 3){
          // this.fillAddress();
        }
      }
    }    
  }

  public fillNum(value){
    if(value != null && value != undefined){    
      this.geoNumero=value;
      if(!this.editFlag){
        // this.fillAddress();
      }
    }  
  }

  public fillColonia(value){
      if(value != null && value != undefined){
        this.editFlag = false;
        if (this.isMexico){
          let timer = Observable.timer(3333);
          timer.subscribe(t => {
          Logger.logColor('<<<<< Direccion >>>>>', this.geoNumero,this.geoCalle,this.geoColonia,this.geoMmunicipio,this.geoEstado,this.geoPais)  
            for(var i=0; i<this.optionsServ.colonias.length; i++){            
              if(value == this.optionsServ.colonias[i]["value"]){
                this.geoColonia = this.optionsServ.colonias[i]["label"]
                this.fillAddress();
                break;
              }
            }
          });  
        }else{
          this.geoColonia=value;
          if(this.geoColonia.length > 3){
            this.fillAddress();
          }
        }
      }
  }

  public fillMunicipio(value){
    if(value != null && value != undefined){
      let timer = Observable.timer(3333);
      timer.subscribe(t => {
        if (!isNaN(value)){
          for(var i=0; i<this.optionsServ.municipios.length; i++){
            if(value == this.optionsServ.municipios[i]["value"]){
              value = this.optionsServ.municipios[i]["label"]
              this.geoMmunicipio=value;
              Logger.logColor("geomunicipio","green",this.geoMmunicipio);
              // if(!this.editFlag){
              //   this.fillAddress();
              // }  
              break;
            }
          }
        }else{
          this.geoMmunicipio=value;
          if(!this.editFlag){
            if(this.geoMmunicipio.length > 3){
              // this.fillAddress();
            }            
          }  
        }
      });  
    }  
  }

  public fillEstado(value){
    if(value != null && value != undefined){
      let timer = Observable.timer(3333);
      timer.subscribe(t => {
        if (!isNaN(value)){
          for(var i=0; i<this.optionsServ.estados.length; i++){
            if(value == this.optionsServ.estados[i]["value"]){
              value = this.optionsServ.estados[i]["label"]
              this.geoEstado=value;
              // if(!this.editFlag){
              //   this.fillAddress();
              // }  
              break;
            }
          }
        }else{
          this.geoEstado=value;
          if(!this.editFlag){
            if(this.geoEstado.length > 3){
              // this.fillAddress();
            }
          }
        }
      });
    }  
  }

  public fillPais(value){
    if(value != null && value != undefined){
      for(var i=0; i<this.optionsServ.paises.length; i++){
        if(value == this.optionsServ.paises[i]["value"]){
          value = this.optionsServ.paises[i]["label"]
          break;
        }
      }
      this.geoPais=value;
      // if(!this.editFlag){
      //   this.fillAddress();
      // }      
    }
  }

  public buildAddress(){
    let address = "";
    address+=this.geoCalle!==null&&this.geoCalle!==undefined?this.geoCalle:"";
    address=this.geoNumero!==null&&this.geoNumero!==undefined?(address!==""?address+",":"")+this.geoNumero:address;
    address=this.geoColonia!==null&&this.geoColonia!==undefined?(address!==""?address+",":"")+this.geoColonia:address;
    address=this.geoMmunicipio!==null&&this.geoMmunicipio!==undefined?(address!==""?address+",":"")+this.geoMmunicipio:address;
    address=this.geoEstado!==null&&this.geoEstado!==undefined?(address!==""?address+",":"")+this.geoEstado:address;
    address=this.geoPais!==null&&this.geoPais!==undefined?(address!==""?address+",":"")+this.geoPais:address;

    Logger.logColor('<<< Addresss >>>','green', address)
    return address;
  }
  public fillAddress() {
    Logger.logColor('<<< FillAddresss >>>','red')
    if (this.onLine.onLine) {
      let timer = Observable.timer(3500);
      timer.subscribe(t => {
        let address = this.buildAddress();
        this.searchElementRef.nativeElement.value = address;
        if (this.geocoder==null)
          this.geocoder = new google.maps.Geocoder();
          this.ngZone.run(() => {
          var place;
          if (this.geocoder) {
            this.geocoder.geocode({'address': address}, (results, status) => {
              console.log('geocode', results, status);
              if (status && results) {
                if(results[0] == undefined){
                  return;
                }else{
                  place = results[0];
                  this.lat = place.geometry.location.lat();
                  this.lng = place.geometry.location.lng();
                  this.latMarker = place.geometry.location.lat();
                  this.lngMarker = place.geometry.location.lng();
                  this.zoom = 17;
                }                  
              } else {
                // alert('Geocode was not successful for the following reason: ' + status);
              }
            });  
          }
          
        });
      });  
    }
  }

  public changePais(id) {

    Logger.log('-------->', id);
    if (id != null && typeof id != 'undefined' && id != "") {
      this.optionsServ.getEstadoByPais(id);
      this.isMexico = (id == _config.optionValue.idMexico);
      Logger.log(this.optionsServ.paises);
    }
    if (id == _config.optionValue.idMexico) {
      this.fillPais("Mexico");
      this.form.controls.estado.enable();
      this.form.controls.municipio.enable();
      this.form.controls.colonia.enable();
      this.form.controls.estadoOtro.disable();
      this.form.controls.coloniaOtro.disable();
      this.form.controls.municipioOtro.disable();
    } else {
      this.form.controls.estado.disable();
      this.form.controls.municipio.disable();
      this.form.controls.colonia.disable();
      this.form.controls.estadoOtro.enable();
      this.form.controls.coloniaOtro.enable();
      this.form.controls.municipioOtro.enable();
    }


  }

  public changeEstado(id) {
    Logger.log('Id de estado', id);
    if (id != null && typeof id != 'undefined' && id != "") {
      this.optionsServ.getMunicipiosByEstado(id);
      this.form.controls.estado.patchValue(id);
      Logger.log(this.form.controls);
    }
    this.cleanSelects(true);
  }

  public changeMunicipio(id) {
    if (id != null && typeof id != 'undefined' && id != "")
      this.optionsServ.getColoniasByMunicipio(id);
    this.cleanSelects(false);
  }

  public changeColonia(idCp) {
    if (idCp) {
      let arr = idCp.split('-');
      this.form.controls.cp.patchValue(arr[1]);
      this.form.controls.colonia.patchValue({id: arr[0]});
    }
  }

  private cleanSelects(municipio) {
    if (municipio)
      this.form.controls.municipio.reset();
    this.form.controls.colonia.reset();
    this.form.controls.cp.reset();
  }

}

