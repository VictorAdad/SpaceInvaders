import { Component, OnInit, Input } from "@angular/core";
import { Router, Params, NavigationEnd, ActivatedRoute} from "@angular/router";
import "rxjs/add/operator/filter";

class IBreadcrumb {
  childs: any;
  url: string;
  label: string;
}

@Component({
  selector: "breadcrumb",
  template: `
  <nav class="breadcrumb">
    <a class="breadcrumb-item" routerLink="/"><mat-icon>home</mat-icon></a>
    <a class="breadcrumb-item"   *ngFor="let ruta of breadcrumb.childs"   routerLink="{{ruta.path}}" >{{ruta.label}}</a>
    <span class="breadcrumb-item active">{{breadcrumb.label}}</span>
  </nav>
  `
})
export class BreadcrumbComponent implements OnInit {

  public breadcrumb: IBreadcrumb;

  @Input()
  public rutas = [];

  /**
   * @class DetailComponent
   * @constructor
   */
  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {
    this.breadcrumb=new IBreadcrumb();
    this.breadcrumb.childs=[];
    this.breadcrumb.label="Home";
    this.breadcrumb.url="";
  }

  /**
   * Let's go!
   *
   * @class DetailComponent
   * @method ngOnInit
   */
  ngOnInit() {
    let url = this.router.url;
    this.breadcrumb=this.dataRouting(this.router.url, this.router.config, this.router);
  }

  dataRouting(theUrl, config, router){
    let url:string;
    url = theUrl.replace('/','');
    let n:number = config.length;

    let breadcrumb:IBreadcrumb;
    breadcrumb=new IBreadcrumb();
    breadcrumb.childs=[];
    breadcrumb.label="Home"
    breadcrumb.url=this.activeRoute.url.toString();

    this.activeRoute.data.subscribe(data => {
        // console.log('-> Data Route', data);
        if (data){
            if(this.rutas.length === 0){
              if(data.rutas){
                  breadcrumb.childs=data.rutas;
              }
            }else{
              breadcrumb.childs = this.rutas;
            }
            if (data.breadcrumb)
                breadcrumb.label=data.breadcrumb;
        }
    });

    return breadcrumb;


  }

  

}