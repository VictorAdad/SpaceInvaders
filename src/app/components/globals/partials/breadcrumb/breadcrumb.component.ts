import { Component, OnInit } from "@angular/core";
import { Router, Params, NavigationEnd} from "@angular/router";
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
    <a class="breadcrumb-item" routerLink="/"><md-icon>home</md-icon></a>
    <a class="breadcrumb-item"   *ngFor="let ruta of breadcrumb.childs"   routerLink="{{ruta.path}}" >{{ruta.label}}</a>
    <span class="breadcrumb-item active">{{breadcrumb.label}}</span>
  </nav>
  `
})
export class BreadcrumbComponent implements OnInit {

  public breadcrumb: IBreadcrumb;

  /**
   * @class DetailComponent
   * @constructor
   */
  constructor(
    private router: Router
  ) {
    this.breadcrumb=new IBreadcrumb();
    this.breadcrumb.childs=[];
    this.breadcrumb.label="";
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
    console.log(this.router);
    this.breadcrumb=this.dataRouting(this.router.url, this.router.config, this.router);
  }

  dataRouting(theUrl, config, router){
    console.log("alla",router.url);
    let url:string;
    url = theUrl.replace('/','');
    let n:number = config.length;
    for (let i = 0; i < n; ++i) {
      if (this.router.config[i].path==url){
        let data:IBreadcrumb;
        data=new IBreadcrumb();
        data.childs=[];
        data.label="Home"
        data.url=this.router.url;

        if (this.router.config[i].data){
          if(this.router.config[i].data.rutas){
           data.childs=this.router.config[i].data.rutas;
          }
          if (this.router.config[i].data.breadcrumb)
            data.label=this.router.config[i].data.breadcrumb;
        }
        console.log(data);
        return data;
      }
    }

    return null;

  }
  

}