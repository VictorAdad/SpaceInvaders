import { MOption } from '@partials/form/select2/select2.component';
import { HttpService } from '@services/http.service';

export class Global {

    public selected;
    public finded   = [];
    public objects  = [];

    constructor(public superHttp: HttpService){

    }

    public getMatriz(url: string){
        this.superHttp.get(url).subscribe((response) => {
            this.objects = response;
            for(let attr in this){
                if(
                    String(attr) !== 'selected'
                    && String(attr) !== 'finded'
                    && String(attr) !== 'objects'
                    && String(attr) !== 'getUniques'
                    && String(attr) !== 'getUnique'
                    && String(attr) !== 'constructor'
                    && String(attr) !== 'find'
                    && String(attr) !== 'validate'){
                    this[String(attr)] = this.getUniques(response, attr);
                }
            }
        });
    }

    public getUniques(_data:any, _unique:string){
        let options: MOption[] = [];

        for(let name of this.getUnique(_data, _unique)){
            options.push({value: name, label: name});
        }

        return options;
    }


    public getUnique(_data:any, _unique:string): string[]{
        let uniques: string[] = [];

        for(let i = 0; i< _data.length; i++){
            if(uniques.indexOf(_data[i][_unique]) === -1)
                uniques.push(_data[i][_unique]);
        }

        return uniques;

    }

    public find(_e, _tipo:string){
        this.selected[_tipo] = _e;
        this.finded = this.objects.filter(object => {
            return this.validate(object, this.selected);
        });
    }

    public validate(_object, _selected){
        return true;
    }

}
