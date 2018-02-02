import {Component, ViewChild} from '@angular/core';
import {BasePaginationComponent} from './../../base/pagination/component';
import {TableService} from '@utils/table/table.service';
import {MatPaginator} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {HttpService} from '@services/http.service';
import {InformeBaseComponent} from './../../informe-homologado/informe-base.component';

@Component({
  selector: 'principal',
  templateUrl: './principal.component.html'
})

export class PrincipalInformeHomologadoCreate extends InformeBaseComponent {

  public casoId: number = null;
  public breadcrumb = [];
  public lat: number = 19.4968732;
  public lng: number = -99.7232673;
  public latMarker: number = 19.4968732;
  public lngMarker: number = -99.7232673;
  public zoom: number = 10;

  public cProteccion = false;
  public cResguardo = false;
  public cTraslado = false;
  public cInspeccion = false;
  public cAcordonamiento = false;
  public cResguardo2 = false;
  public cMedicoOtraAgencia = false;
  public cMedicoParticular = false;

  columns = ['cuip', 'nombre', 'institucion', 'entidadMunicipio', 'accion'];
  columns2 = ['riesgoPara', 'tipo', 'accion'];
  columns3 = ['apoyo', 'nEconomico', 'accion'];
  columns4 = ['evento', 'fecha', 'hora'];
  dataSource: TableService | null;
  dataSource2: TableService | null;
  dataSource3: TableService | null;
  dataSource4: TableService | null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginator2: MatPaginator;
  @ViewChild(MatPaginator) paginator3: MatPaginator;
  @ViewChild(MatPaginator) paginator4: MatPaginator;

  constructor(private route: ActivatedRoute,
              private http: HttpService) {
    super();

  }

  ngOnInit() {
    var rows = {};
    rows['cuip'] = "12372368476327432"
    rows['nombre'] = "Noé Robles Camacho"
    rows['institucion'] = "Policia Federal"
    rows['entidadMunicipio'] = "Xalapa, Veracruz (10,018)"

    this.dataSource = new TableService(this.paginator, [rows, rows]);

    var rows2 = {};
    rows2['riesgoPara'] = "Víctima"
    rows2['tipo'] = "Salud"

    this.dataSource2 = new TableService(this.paginator2, [rows2, rows2]);

    var rows3 = {};
    rows3['apoyo'] = "Bomberos"
    rows3['nEconomico'] = "34535"

    this.dataSource3 = new TableService(this.paginator3, [rows3, rows3]);


    var rows4 = {};
    rows4['evento'] = "Conocimiento del hecho"
    rows4['fecha'] = "24/01/2018"
    rows4['hora'] = "11:35"

    this.dataSource4 = new TableService(this.paginator4, [rows4, rows4]);
  }

  showProteccion(value) {
    (value == "Sí") ? this.cProteccion = true : this.cProteccion = false;
  }

  showResguardo(value) {
    (value == "Sí") ? this.cResguardo = true : this.cResguardo = false;
  }

  showTraslado(value) {
    (value == "Sí") ? this.cTraslado = true : this.cTraslado = false;
  }

  showInspeccion(value) {
    (value == "Sí") ? this.cInspeccion = true : this.cInspeccion = false;
  }

  showAcordonamiento(value) {
    (value == "Sí") ? this.cAcordonamiento = true : this.cAcordonamiento = false;
  }

  showResguardo2(value) {
    (value == "Sí") ? this.cResguardo2 = true : this.cResguardo2 = false;
  }

  showMedicoOtraAgencia(value) {
    (value == "Sí") ? this.cMedicoOtraAgencia = true : this.cMedicoOtraAgencia = false;
  }

  showMedicoParticular(value) {
    (value == "Sí") ? this.cMedicoParticular = true : this.cMedicoParticular = false;
  }

  public changeLocation(_e) {
    this.latMarker = _e.coords.lat;
    this.lngMarker = _e.coords.lng;
  }
}
