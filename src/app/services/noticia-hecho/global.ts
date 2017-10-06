import { MOption } from '@partials/form/select2/select2.component'

export class Global {

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

    
}
