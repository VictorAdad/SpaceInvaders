import {Component, ViewChild} from '@angular/core';
import {BasePaginationComponent} from '@components-app/base/pagination/component';
import {TableService} from '@utils/table/table.service';
import {MatPaginator} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {HttpService} from '@services/http.service';
import {InformeBaseComponent} from '@components-app/informe-homologado/informe-base.component';

@Component({
  selector: 'anexo8',
  templateUrl: './anexo8.component.html'
})

export class Anexo8Component extends InformeBaseComponent {

  public breadcrumb = [];
  columns = ['nombre', 'objeto', 'accion'];
  dataSource: TableService | null;
  public divTipoArma = false;
  public divDinero = false;
  public divPersona = false;
  public divCadaver = false;
  public divRestosHumanos = false;
  public divDocumentos = false;
  public divOtro = false;
  public divCaracteristicas = false;
  public divInspeccion = false;
  public divObjeto = false;
  public divArmaObjeto = false;
  public divDineroObjeto = false;
  public divCaracteristicasObjeto = false;
  public divDocumentosObjeto = false;
  public divOtroObjeto = false;
  public divTransporteEncontrados = false;
  public divArmasEncontrados = false;
  public divEncontrados = false;
  public divCargadoresEncontrados = false;
  public divCartuchosEncontrados = false;
  public divCasquillosEncontrados = false;
  public divDineroEncontrado = false;
  public divNarcoticosEncontrados = false;
  public divDocumentosEncontrados = false;
  public divPersonasEncontrados = false;
  public divCadaverEncontrado = false;
  public divRestosEncontrados = false;
  public divSustanciaEncontrado = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private route: ActivatedRoute,
    private http: HttpService) {
    super();
  }

  ngOnInit() {
    var rows = {};
    rows['nombre'] = 'Yair Ruiz';
    rows['objeto'] = 'Arma de fuego';
    this.dataSource = new TableService(this.paginator, [rows]);
  }

  showTipoArma(value) {
    (value == 'true') ? this.divTipoArma = true : this.divTipoArma = false;
  }

  showDinero(value) {
    (value == 'true') ? this.divDinero = true : this.divDinero = false;
  }

  showPersona(value) {
    (value == 'true') ? this.divPersona = true : this.divPersona = false;
  }

  showCadaver(value) {
    (value == 'true') ? this.divCadaver = true : this.divCadaver = false;
  }

  showRestosHumanos(value) {
    (value == 'true') ? this.divRestosHumanos = true : this.divRestosHumanos = false;
  }

  showDocumentos(value) {
    (value == 'true') ? this.divDocumentos = true : this.divDocumentos = false;
  }

  showOtro(value) {
    (value == 'true') ? this.divOtro = true : this.divOtro = false;
  }

  showCaracteristicas(value) {
    (value == 'true') ? this.divCaracteristicas = true : this.divCaracteristicas = false;
  }

  showInspeccion(value) {
    (value == 'true') ? this.divInspeccion = true : this.divInspeccion = false;
  }

  showObjeto(value) {
    (value == 'true') ? this.divObjeto = true : this.divObjeto = false;
  }

  showArmaObjeto(value) {
    (value == 'true') ? this.divArmaObjeto = true : this.divArmaObjeto = false;
  }

  showDineroObjeto(value) {
    (value == 'true') ? this.divDineroObjeto = true : this.divDineroObjeto = false;
  }

  showCaracteristicasObjeto(value) {
    (value == 'true') ? this.divCaracteristicasObjeto = true : this.divCaracteristicasObjeto = false;
  }

  showDocumentosObjeto(value) {
    (value == 'true') ? this.divDocumentosObjeto = true : this.divDocumentosObjeto = false;
  }

  showOtroObjeto(value) {
    (value == 'true') ? this.divOtroObjeto = true : this.divOtroObjeto = false;
  }

  showTransporteEcontrados(value) {
    (value == 'true') ? this.divTransporteEncontrados = true : this.divTransporteEncontrados = false;
  }

  showArmasEncontrados(value) {
    (value == 'true') ? this.divArmasEncontrados = true : this.divArmasEncontrados = false;
  }

  showCargadoresEncontrados(value) {
    (value == 'true') ? this.divCargadoresEncontrados = true : this.divCargadoresEncontrados = false;
  }

  showCartuchosEncontrados(value) {
    (value == 'true') ? this.divCartuchosEncontrados = true : this.divCartuchosEncontrados = false;
  }

  showCasquillosEncontrados(value) {
    (value == 'true') ? this.divCasquillosEncontrados = true : this.divCasquillosEncontrados = false;
  }

  showDineroEncontrado(value) {
    (value == 'true') ? this.divDineroEncontrado = true : this.divDineroEncontrado = false;
  }

  showNarcoticosEncontrados(value) {
    (value == 'true') ? this.divNarcoticosEncontrados = true : this.divNarcoticosEncontrados = false;
  }

  showDocumentosEncontrados(value) {
    (value == 'true') ? this.divDocumentosEncontrados = true : this.divDocumentosEncontrados = false;
  }

  showPersonasEncontrados(value) {
    (value == 'true') ? this.divPersonasEncontrados = true : this.divPersonasEncontrados = false;
  }

  showCadaverEncontrado(value) {
    (value == 'true') ? this.divCadaverEncontrado = true : this.divCadaverEncontrado = false;
  }

  showRestosEncontrados(value) {
    (value == 'true') ? this.divRestosEncontrados = true : this.divRestosEncontrados = false;
  }

  showSustanciaEncontrado(value) {
    (value == 'true') ? this.divSustanciaEncontrado = true : this.divSustanciaEncontrado = false;
  }


}
