import { Component, OnInit} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Caso } from '@models/caso';
import { GlobalComponent } from '@components-app/global.component';
import { LoaderComponent } from '@partials/loader/component';
import { MdDialog } from '@angular/material';

@Component({
    selector : 'datos-generales',
    templateUrl:'./component.html'
})
export class DatosGeneralesComponent implements OnInit{
    public form       : FormGroup;
    public model      : Caso;

    public constructor(private _fbuilder: FormBuilder) { 
        
    }

    ngOnInit(){
        this.model = new Caso();
        this.form  = new FormGroup({
            'titulo'   : new FormControl(this.model.titulo, [Validators.required]),
            'sintesis' : new FormControl(this.model.sintesis, [Validators.required]),
            'delito'   : new FormControl(this.model.delito, [Validators.required])
        });
    }

    public save(valid : any, model : any):void{
        // This works on all devices/browsers, and uses IndexedDBShim as a final fallback 
        var indexedDB = window.indexedDB ;

        // Open (or create) the database
        //por una estraña razon no funciona los nombres si la M antes
        var open = indexedDB.open("MEvomatik", 1);

        // Create the schema
        open.onupgradeneeded = function() {
            var db = open.result;
            var store = db.createObjectStore("MCasos", {keyPath: "id"});
            var index = store.createIndex("Index", ["titulo", "delito"]);
        };

        open.onsuccess = function() {
            // Start a new transaction
            var db = open.result;
            var tx = db.transaction("MCasos", "readwrite");
            var store = tx.objectStore("MCasos");
            var index = store.index("Index");

            // Add some data
            let json = model;
            json.id = Date.now();

            //add or update
            store.put(json);

            var list=store.getAll();
            list.onsuccess=function(){
                var datos=list.result;
                console.log(datos);
            }
            
            
            // Close the db when the transaction is done
            tx.oncomplete = function() {
                db.close();
            };
        }
        console.log('DatosGenerales@save()');
    }

}
