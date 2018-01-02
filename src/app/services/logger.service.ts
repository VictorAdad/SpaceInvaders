import { Injectable } from '@angular/core';
import { _config} from '@app/app.config';

/**
 * Servicio para tener un propio logger. No es necesario injectar a nuestro componente, basta con que se importe la clase y se utilicen los metodos estaticos.
 * La ventaja de tener nuestro propio logger, es que tenemos la variable _config.develop y si es true muestra los mensajes sino no mostratamos nada.
 */
@Injectable()
export class Logger {
    /**
     * Inicializa el logger, basicamente muestra el mensaje de bienvenidad de la app.
     */
    constructor(
    ) { 
        var estilo= 'background-color:black; border-left:3px solid gray;border-top:3px solid gray; border-right:3px solid gray; font-size:20px; font-weight: bold;padding:3px 5px;color:';
        var estilo2= 'background-color:black; border-left:3px solid gray;border-bottom:3px solid gray; font-size:20px; font-weight: bold;padding:3px 5px;color:';
        var estilo3= 'background-color:black; gray;border-bottom:3px solid gray; font-size:20px; font-weight: bold;padding:3px;color:';
        var estilo4= 'background-color:black; border-bottom:3px solid gray; font-size:20px; font-weight: bold;padding:3px;color:';
        var estilo5= 'background-color:black; border-right:3px solid gray;border-bottom:3px solid gray; font-size:20px; font-weight: bold; padding:3px;color:';
        
        console.log("%c" + "F G J ",estilo+"white; padding-left: 75px;padding-right: 74px;");
        console.log("%c"+"ESTADO DE %cMÉ%cXI%cCO", estilo2+"white",estilo3+"green",estilo4+"white",estilo5+"red");
        console.log("%c" + "EVOMATIK", "color: #2b697f;font-weight:bold; font-size: 20px; letter-spacing: ;padding-left: 125px;");
        console.log("%c" + "SOFTWARE", "color:#e5493c;padding-left: 170px;");
        console.log("%c" + "Sede:" +"%c"+_config.sede, "color: blue;font-weight:bold;", "color: black;");
    }
    /**
     * Lo mismo que console.error
     * @param args argumentos a imprimir
     */
    public static error(...args){
        if (_config.develop){
            console.error.apply(console, args);
        }
    }
    /**
     * Lo mismo que console.log
     * @param args argumentos a imprimir
     */
    public static log(...args){
        if (_config.develop){
            console.log.apply(console, args);
        }
    }
    /**
     * Igual que console.warn
     * @param args argumentos a imprimir
     */
    public static warn(...args){
        if (_config.develop){
            console.warn.apply(console, args);
        }
    }
    /**
     * Igual que console.info
     * @param args argumentos a imprimir
     */
    public static info(...args){
        if (_config.develop){
            console.info.apply(console, args);
        }
    }
    /**
     * Igual que console.time
     * @param args argumentos a imprimir
     */
    public static time(...args){
        if (_config.develop){
            console.time.apply(console, args);
        }
    }
    /**
     * Igual que console.timeEnd
     * @param args argumentos a imprimir
     */
    public static timeEnd(...args){
        if (_config.develop){
            console.timeEnd.apply(console, args);
        }
    }
    /**
     * Funcion para resaltar mensajes en la consola, normalmente solo queremos el primer texto para resaltar. para esto lo utilizamos.
     * @param texto Texto a resaltar
     * @param color Color para el estilo del texto.Puede ser un nombre o el exadecimal o el rgb igual que si lo usaramos en un estilo.
     * @param args argumentos extra a imprimir
     */
    public static logColor(texto,color="black",...args){
        if (_config.develop){
            var arg2=["%c"+texto,"color:"+color+";font-weight:bold;"];
            arg2=arg2.concat(args);
            console.log.apply(console, arg2);
        }
    }

    
}
